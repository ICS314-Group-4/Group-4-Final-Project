'use client';

import { useRouter } from 'next/navigation';
import { Template } from '@prisma/client';
import { categoryLabels } from '@/lib/categoryLabels';

const ROW_HEIGHT = '64px';

type Props = {
  template: Template;
  isEditor: boolean;
  commentCount?: Record<number, number>;
  onDelete?: (id: number, title: string) => Promise<void>;
  onTagClick?: (tag: string) => void;
};

/* Renders a single row in the user templates / recently-used table. */
const TemplateItemUserTemplates = ({ template, isEditor, commentCount = {}, onDelete, onTagClick }: Props) => {
  const router = useRouter();

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    if (onTagClick) onTagClick(tag);
  };

  return (
    <tr
      className="align-middle"
      style={{ cursor: 'pointer', height: ROW_HEIGHT }}
      onClick={() => router.push(`/view/${template.id}`)}
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
              <button
                key={tag}
                className="badge fw-normal tag-badge"
                style={{ flexShrink: 0 }}
                onClick={(e) => handleTagClick(e, tag)}
              >
                {tag}
              </button>
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
      <td>
        <span style={{ display: 'inline-block', fontSize: '0.78rem', backgroundColor: '#e8f0ec', color: '#024731', padding: '3px 10px', borderRadius: '12px', fontWeight: 500 }}>
          {template.used ?? 0}×
        </span>
      </td>
      <td>
        <span style={{ display: 'inline-block', fontSize: '0.78rem', backgroundColor: '#e8f0ec', color: '#024731', padding: '3px 10px', borderRadius: '12px', fontWeight: 500 }}>
          {commentCount[template.id] ?? 0}
        </span>
      </td>
      <td className="py-3 text-end" onClick={(e) => e.stopPropagation()}>
        {isEditor && onDelete ? (
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
        ) : null}
      </td>
    </tr>
  );
};

export default TemplateItemUserTemplates;
