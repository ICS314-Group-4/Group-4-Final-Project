'use client';

import { useState } from 'react';
import { Table } from 'react-bootstrap';
import { Category, Template } from '@prisma/client';
import TemplateItem from './TemplateItem';
import { categoryLabels } from '@/lib/categoryLabels';

type SortCol = 'title' | 'category' | 'author' | 'used' | 'comments';
type SortDir = 'asc' | 'desc';

type Props = {
  templates: Template[];
  categories: string[];
  authors: { email: string; name: string | null }[];
  commentCounts: Record<number, number>;
  initialCategory?: string;
  initialSearch?: string;
};

const TemplateFilter = ({ templates, categories, authors, commentCounts, initialCategory = 'All', initialSearch = '' }: Props) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sortCol, setSortCol] = useState<SortCol>('used');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const authorNames = Object.fromEntries(
    authors.map(({ email, name }) => [email, name ?? email]),
  );

  const countByCategory = templates.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + 1;
    return acc;
  }, {});

  const handleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir(col === 'used' || col === 'comments' ? 'desc' : 'asc');
    }
  };

  const filtered = templates.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch = !q
      || t.id.toString() === q.replace('#', '')
      || t.title?.toLowerCase().includes(q)
      || t.category?.toLowerCase().includes(q)
      || t.tags?.some(tag => tag.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;
    switch (sortCol) {
      case 'title':    aVal = a.title ?? '';                        bVal = b.title ?? '';                        break;
      case 'category': aVal = categoryLabels[a.category] ?? '';     bVal = categoryLabels[b.category] ?? '';     break;
      case 'author':   aVal = authorNames[a.author] ?? a.author;    bVal = authorNames[b.author] ?? b.author;    break;
      case 'used':     aVal = a.used ?? 0;                          bVal = b.used ?? 0;                          break;
      case 'comments': aVal = commentCounts[a.id] ?? 0;             bVal = commentCounts[b.id] ?? 0;             break;
    }
    if (typeof aVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
    }
    return sortDir === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
  });

  const SortHeader = ({ col, label, width }: { col: SortCol; label: string; width: string }) => {
    const active = sortCol === col;
    return (
      <th className="py-3" style={{ width }}>
        <button
          onClick={() => handleSort(col)}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '0.75rem', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: active ? '#024731' : '#6c757d',
          }}
        >
          {label}
          <span style={{ fontSize: '0.6rem', opacity: active ? 1 : 0.35 }}>
            {active && sortDir === 'asc' ? '▲' : '▼'}
          </span>
        </button>
      </th>
    );
  };

  return (
    <>
      {/* Search + filters */}
      <div className="mb-4 d-flex flex-column gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title, category, or tag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '420px', fontSize: '0.9rem' }}
        />
        <div className="d-flex flex-wrap gap-2">
          {['All', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="btn btn-sm"
              style={{
                fontSize: '0.8rem',
                backgroundColor: activeCategory === cat ? '#024731' : '#f4f7f5',
                color: activeCategory === cat ? '#fff' : '#495057',
                border: 'none',
                borderRadius: '20px',
                padding: '5px 14px',
              }}
            >
              {cat === 'All'
                ? `All (${templates.length})`
                : `${categoryLabels[cat as Category] ?? cat} (${countByCategory[cat] ?? 0})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {sorted.length > 0 ? (
        <Table hover responsive className="w-100" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #dee2e6' }}>
              <SortHeader col="title"    label="Template" width="38%" />
              <SortHeader col="category" label="Category" width="21%" />
              <SortHeader col="author"   label="Author"   width="21%" />
              <SortHeader col="used"     label="Used"     width="10%" />
              <SortHeader col="comments" label="Comments" width="10%" />
            </tr>
          </thead>
          <tbody>
            {sorted.map(t => (
              <TemplateItem key={t.id} template={t} authorName={authorNames[t.author]} commentCount={commentCounts[t.id] ?? 0} />
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center py-5" style={{ color: '#6c757d' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.3 }}>📭</div>
          <p className="mb-1 fw-semibold">No templates found</p>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            {search || activeCategory !== 'All'
              ? 'Try adjusting your search or filter.'
              : 'No templates have been added yet.'}
          </p>
          {!search && activeCategory === 'All' && (
            <a href="/add" className="btn btn-sm fw-semibold" style={{ backgroundColor: '#024731', color: '#fff', border: 'none' }}>
              + Add the first one
            </a>
          )}
        </div>
      )}
    </>
  );
};

export default TemplateFilter;
