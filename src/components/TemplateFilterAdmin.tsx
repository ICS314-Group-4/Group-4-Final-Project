'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table } from 'react-bootstrap';
import { Category, Template } from '@prisma/client';
import TemplateItemAdmin from './TemplateItemAdmin';
import { categoryLabels } from '@/lib/categoryLabels';
import { deleteTemplate } from '@/lib/dbActions';

const PAGE_SIZE = 20;

type Props = {
  templates: Template[];
  categories: string[];
};

const pageBtnStyle = (active: boolean): React.CSSProperties => ({
  minWidth: '36px', height: '36px',
  border: `1px solid ${active ? '#024731' : '#e4ebe7'}`,
  borderRadius: '0.375rem',
  backgroundColor: active ? '#024731' : '#fff',
  color: active ? '#fff' : '#495057',
  fontSize: '0.85rem', fontWeight: active ? 600 : 400,
  cursor: 'pointer', padding: '0 8px',
});

const TemplateFilterAdmin = ({ templates, categories }: Props) => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null);

  const showToast = (message: string, error = false) => {
    setToast({ message, error });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: number, title: string) => {
    const result = await deleteTemplate(id);
    if ('error' in result) { showToast(result.error, true); return; }
    router.refresh();
    showToast(`"${title}" deleted`);
  };

  const filtered = templates.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch = !q
      || t.title?.toLowerCase().includes(q)
      || t.category?.toLowerCase().includes(q)
      || t.tags?.some(tag => tag.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pageNumbers = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  })();

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          backgroundColor: toast.error ? '#842029' : '#024731', color: '#fff',
          padding: '12px 20px', borderRadius: '0.5rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          fontSize: '0.9rem', fontWeight: 500,
        }}>
          {toast.message}
        </div>
      )}

      {/* Search + filters */}
      <div className="mb-4 d-flex flex-column gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title, category, or tag..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ maxWidth: '420px', fontSize: '0.9rem' }}
        />
        <div className="d-flex flex-wrap gap-2">
          {['All', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setPage(1); }}
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
              {cat === 'All' ? `All (${templates.length})` : `${categoryLabels[cat as Category] ?? cat}`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <>
          <Table hover responsive className="w-100" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr
                className="text-muted"
                style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid #dee2e6' }}
              >
                <th className="py-3 fw-semibold" style={{ width: '40%' }}>Template</th>
                <th className="py-3 fw-semibold" style={{ width: '20%' }}>Category</th>
                <th className="py-3 fw-semibold" style={{ width: '20%' }}>Author</th>
                <th className="py-3 fw-semibold" style={{ width: '10%' }}>Used</th>
                <th className="py-3 fw-semibold text-end" style={{ width: '10%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(t => (
                <TemplateItemAdmin key={t.id} template={t} onDelete={handleDelete} />
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
            <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
              Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            {totalPages > 1 && (
              <div className="d-flex gap-1 align-items-center">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ ...pageBtnStyle(false), opacity: page === 1 ? 0.4 : 1 }}
                >
                  ←
                </button>
                {pageNumbers.map((p, i) =>
                  p === '...'
                    ? <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: '#adb5bd', fontSize: '0.85rem' }}>…</span>
                    : <button key={p} onClick={() => setPage(p)} style={pageBtnStyle(page === p)}>{p}</button>
                )}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{ ...pageBtnStyle(false), opacity: page === totalPages ? 0.4 : 1 }}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-5 text-muted">
          <p className="mb-1">No templates found.</p>
          <p style={{ fontSize: '0.9rem' }}>
            {search || activeCategory !== 'All'
              ? 'Try adjusting your search or filter.'
              : 'No templates have been added yet.'}
          </p>
        </div>
      )}
    </>
  );
};

export default TemplateFilterAdmin;
