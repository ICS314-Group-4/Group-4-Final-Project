'use client';

import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Category, Template } from '@prisma/client';
import TemplateItem from './TemplateItem';
import { categoryLabels } from '@/lib/categoryLabels';

type Props = {
  templates: Template[];
  categories: string[];
  authors: { email: string; name: string | null }[];
  commentCounts: Record<number, number>;
};

const TemplateFilter = ({ templates, categories, authors, commentCounts }: Props) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const authorNames = Object.fromEntries(
    authors.map(({ email, name }) => [email, name ?? email]),
  );

  const countByCategory = templates.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + 1;
    return acc;
  }, {});

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

  {/* Click event to automatically search for tags with same name as clicked tag */}
  const tagSearchEvent = (tag: string) => {
    setSearch(tag);
  };
  
    const [existingTags, setExistingTags] = useState<string[]>([]);

  useEffect(() => {
  fetch('/api/tags')
    .then(res => res.json())
    .then(data => setExistingTags(data))
    .catch(err => console.error('Failed to load tag suggestions', err));
}, []);


  return (
    <>
      {/* Search + filters */}
      <div className="mb-4 d-flex flex-column gap-3">
        <div style={{ position: 'relative', maxWidth: '420px', width: '100%' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, category, or tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: '420px', fontSize: '0.9rem' }}
            list={search.length > 0 ? "search-tag-suggestions" : undefined}
          />
          {search.length > 0 && (
            <datalist id="search-tag-suggestions">
              {existingTags
                .filter(tag => !search.toLowerCase().includes(tag.toLowerCase()))
                .map(tag => (
                  <option key={tag} value={tag} />
                ))}
            </datalist>
          )}
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: '#888',
              padding: 0,
              lineHeight: 1,
            }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
        <div className="d-flex flex-wrap gap-2">
          {['All', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="btn btn-sm"
              style={{
                fontSize: '0.8rem',
                backgroundColor: activeCategory === cat ? '#024731' : '#f0f0f0',
                color: activeCategory === cat ? '#fff' : '#333',
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
      {filtered.length > 0 ? (
        <Table
          hover
          responsive
          className="w-100"
          style={{ tableLayout: 'fixed' }}
        >
          <thead>
            <tr
              className="text-muted"
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                borderBottom: '2px solid #dee2e6',
              }}
            >
              <th className="py-3 fw-semibold" style={{ width: '38%' }}>Template</th>
              <th className="py-3 fw-semibold" style={{ width: '21%' }}>Category</th>
              <th className="py-3 fw-semibold" style={{ width: '21%' }}>Author</th>
              <th className="py-3 fw-semibold" style={{ width: '10%' }}>Used</th>
              <th className="py-3 fw-semibold" style={{ width: '10%' }}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <TemplateItem key={t.id} template={t} authorName={authorNames[t.author]} commentCount={commentCounts[t.id] ?? 0} onTagClick={tagSearchEvent} /> 
            ))}
          </tbody>
        </Table>
      ) : (
        <div
          className="text-center py-5"
          style={{ color: '#6c757d' }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.3 }}>📭</div>
          <p className="mb-1 fw-semibold">No templates found</p>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            {search || activeCategory !== 'All'
              ? 'Try adjusting your search or filter.'
              : 'No templates have been added yet.'}
          </p>
          {!search && activeCategory === 'All' && (
            <a
              href="/add"
              className="btn btn-sm fw-semibold"
              style={{ backgroundColor: '#024731', color: '#fff', border: 'none' }}
            >
              + Add the first one
            </a>
          )}
        </div>
      )}
    </>
  );
};

export default TemplateFilter;
