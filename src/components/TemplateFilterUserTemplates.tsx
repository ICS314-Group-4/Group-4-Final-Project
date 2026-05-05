'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table } from 'react-bootstrap';
import { Category, Template } from '@prisma/client';
import TemplateItemUserTemplates from './TemplateItemUserTemplates';
import { categoryLabels } from '@/lib/categoryLabels';
import { deleteTemplate } from '@/lib/dbActions';

const PAGE_SIZE = 20;

type SortCol = 'title' | 'category' | 'used' | 'comments';
type SortDir = 'asc' | 'desc';

const SortHeader = ({ col, label, width, sortCol, sortDir, onSort }: {
  col: SortCol; label: string; width: string;
  sortCol: SortCol; sortDir: SortDir; onSort: (col: SortCol) => void;
}) => {
  const active = sortCol === col;
  return (
    <th className="py-3" style={{ width }}>
      <button
        onClick={() => onSort(col)}
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

type Props = {
  templates: Template[];
  categories: string[];
  isEditor: boolean;
  name: string;
  commentCount: Record<number, number>;
  emptyMessage?: string;
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

const TemplateFilterUserTemplates = ({ templates, categories, isEditor, name, commentCount, emptyMessage }: Props) => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState<SortCol>('used');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/tags')
      .then(res => res.json())
      .then(data => setExistingTags(data))
      .catch(err => console.error('Failed to load tag suggestions', err));
  }, []);

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

  const handleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir(col === 'used' || col === 'comments' ? 'desc' : 'asc');
    }
    setPage(1);
  };

  const tagSearchEvent = (tag: string) => {
    setSearch(tag);
    setPage(1);
  };

  const countByCategory = templates.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + 1;
    return acc;
  }, {});

  const filtered = templates.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch = !q
      || t.title?.toLowerCase().includes(q)
      || t.category?.toLowerCase().includes(q)
      || t.tags?.some(tag => tag.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;
    switch (sortCol) {
      case 'title':    aVal = a.title ?? '';                    bVal = b.title ?? '';                    break;
      case 'category': aVal = categoryLabels[a.category] ?? ''; bVal = categoryLabels[b.category] ?? ''; break;
      case 'used':     aVal = a.used ?? 0;                      bVal = b.used ?? 0;                      break;
      case 'comments': aVal = commentCount[a.id] ?? 0;          bVal = commentCount[b.id] ?? 0;          break;
    }
    if (typeof aVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
    }
    return sortDir === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
        <div style={{ position: 'relative', maxWidth: '420px', width: '100%' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, category, or tag..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ fontSize: '0.9rem' }}
            list={search.length > 0 ? 'search-tag-suggestions-ut' : undefined}
          />
          {search.length > 0 && (
            <datalist id="search-tag-suggestions-ut">
              {existingTags
                .filter(tag => !search.toLowerCase().includes(tag.toLowerCase()))
                .map(tag => <option key={tag} value={tag} />)}
            </datalist>
          )}
          {search && (
            <button
              onClick={() => { setSearch(''); setPage(1); }}
              style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', fontSize: '1.2rem',
                cursor: 'pointer', color: '#888', padding: 0, lineHeight: 1,
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
              onClick={() => { setActiveCategory(cat); setPage(1); }}
              className="btn btn-sm"
              style={{
                fontSize: '0.8rem',
                backgroundColor: activeCategory === cat ? '#024731' : '#f4f7f5',
                color: activeCategory === cat ? '#fff' : '#495057',
                border: 'none', borderRadius: '20px', padding: '5px 14px',
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
        <>
          <Table hover responsive className="w-100" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                <SortHeader col="title"    label="Template" width="43%" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <SortHeader col="category" label="Category" width="23%" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <SortHeader col="used"     label="Used"     width="12%" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <SortHeader col="comments" label="Comments" width="12%" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                {isEditor ? (
                  <th className="py-3 fw-semibold text-end" style={{ width: '10%', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6c757d' }}>Actions</th>
                ) : (
                  <th style={{ width: '10%' }} />
                )}
              </tr>
            </thead>
            <tbody>
              {paginated.map(t => (
                <TemplateItemUserTemplates
                  key={t.id}
                  template={t}
                  isEditor={isEditor}
                  commentCount={commentCount}
                  onDelete={handleDelete}
                  onTagClick={tagSearchEvent}
                />
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
            <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
              Showing {sorted.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
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
        <div className="text-center py-5" style={{ color: '#6c757d' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.3 }}>📭</div>
          <p className="mb-1 fw-semibold">No templates found</p>
          <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>
            {search || activeCategory !== 'All'
              ? 'Try adjusting your search or filter.'
              : (emptyMessage ?? `${name} hasn't created any templates yet.`)}
          </p>
        </div>
      )}
    </>
  );
};

export default TemplateFilterUserTemplates;
