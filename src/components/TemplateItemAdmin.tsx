'use client';

import { Template } from '@prisma/client';
import { categoryLabels } from '@/lib/categoryLabels';

type Props = {
  template: Template;
  onDelete: (id: number, title: string) => Promise<void>;
};

/* Renders a single row in the admin template list. */
const TemplateItemAdmin = ({ template, onDelete }: Props) => (
  <tr
    className="align-middle"
    style={{ cursor: 'pointer', height: '64px' }}
    onClick={() => { window.location.href = `/viewadmin/${template.id}`; }}
  >
    <td style={{ maxWidth: '340px', overflow: 'hidden' }}>
      <div
        className="fw-semibold"
        style={{
          fontSize: '0.95rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {template.title}
      </div>
      {template.tags?.length > 0 && (
        <div
          className="mt-1 d-flex gap-1"
          style={{ flexWrap: 'nowrap', overflowX: 'auto', scrollbarWidth: 'none' }}
        >
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="badge fw-normal"
              style={{ backgroundColor: '#024731', fontSize: '0.7rem', flexShrink: 0 }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </td>
    <td>
      <span
        className="badge fw-normal"
        style={{
          backgroundColor: '#e8f0ec',
          color: '#024731',
          fontSize: '0.78rem',
          padding: '5px 10px',
        }}
      >
        {categoryLabels[template.category]}
      </span>
    </td>
    <td className="text-muted" style={{ fontSize: '0.85rem' }}>{template.author}</td>
    <td>
      <span className="text-muted" style={{ fontSize: '0.85rem' }}>
        {template.used ?? 0}×
      </span>
    </td>
    <td className="py-3 text-end" onClick={(e) => e.stopPropagation()}>
      <div className="d-flex justify-content-end gap-2">
        <a
          href={`/edit/${template.id}`}
          className="btn btn-sm btn-outline-primary"
          style={{ fontSize: '0.75rem' }}
          onClick={(e) => e.stopPropagation()}
        >
          Edit
        </a>
        <button
          className="btn btn-sm btn-outline-danger"
          style={{ fontSize: '0.75rem' }}
          onClick={async (e) => {
            e.stopPropagation();
            if (confirm(`Delete "${template.title}"?`)) {
              await onDelete(template.id, template.title);
            }
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default TemplateItemAdmin;
