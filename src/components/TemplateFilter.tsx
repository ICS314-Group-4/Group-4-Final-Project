'use client';

import { useState } from 'react';
import { Table } from 'react-bootstrap';
import { Category, Template } from '@prisma/client';
import TemplateItem from './TemplateItem';
import { categoryLabels } from '@/lib/categoryLabels';

type Props = {
  templates: Template[];
  categories: string[];
  authors: { email: string; name: string | null }[];
};

const TemplateFilter = ({ templates, categories, authors }: Props) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const authorNames = Object.fromEntries(
    authors.map(({ email, name }) => [email, name ?? email]),
  );

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
                backgroundColor: activeCategory === cat ? '#024731' : '#f0f0f0',
                color: activeCategory === cat ? '#fff' : '#333',
                border: 'none',
                borderRadius: '20px',
                padding: '5px 14px',
              }}
            >
              {cat === 'All' ? 'All' : categoryLabels[cat as Category] ?? cat}
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
              <th className="py-3 fw-semibold" style={{ width: '42%' }}>Template</th>
              <th className="py-3 fw-semibold" style={{ width: '22%' }}>Category</th>
              <th className="py-3 fw-semibold" style={{ width: '22%' }}>Author</th>
              <th className="py-3 fw-semibold" style={{ width: '14%' }}>Used</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <TemplateItem key={t.id} template={t} authorName={authorNames[t.author]} />
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center py-5 text-muted">
          <p className="mb-1">No templates found.</p>
          <p style={{ fontSize: '0.9rem' }}>
            {search || activeCategory !== 'All'
              ? 'Try adjusting your search or filter.'
              : 'Be the first to add one!'}
          </p>
        </div>
      )}
    </>
  );
};

export default TemplateFilter;
