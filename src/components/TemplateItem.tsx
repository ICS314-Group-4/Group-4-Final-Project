'use client';

import { useRouter } from 'next/navigation';
import { Template } from '@prisma/client';
import { categoryLabels } from '@/lib/categoryLabels';

/* Renders a single row in the Browse Templates table. See list/page.tsx. */
const TemplateItem = ({ template, authorName, commentCount = 0, onTagClick }: { template: Template; authorName?: string; commentCount?: number; onTagClick?: (tag: string) => void }) => {
  const router = useRouter();


  const tagSearchEvent = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    if (onTagClick) onTagClick(tag);
  };

  return (
    <tr
      className="align-middle"
      style={{ cursor: 'pointer' }}
      onClick={() => router.push(`/view/${template.id}`)}
    >
      <td style={{ maxWidth: '340px' }}>
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
          <div className="mt-1 d-flex flex-wrap gap-1">
            {template.tags.map((tag) => (
              <button
                key={tag}
                className="badge fw-normal tag-badge"
                onClick={(e) => tagSearchEvent(e, tag)}
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
      <td className="text-muted" style={{ fontSize: '0.85rem' }}>{authorName ?? template.author}</td>
      <td>
        <span
          style={{
            display: 'inline-block',
            fontSize: '0.78rem',
            backgroundColor: '#f0f4f2',
            color: '#024731',
            padding: '3px 10px',
            borderRadius: '12px',
            fontWeight: 500,
          }}
        >
          {template.used ?? 0}×
        </span>
      </td>
      <td>
        <span
          style={{
            display: 'inline-block',
            fontSize: '0.78rem',
            backgroundColor: '#f0f4f2',
            color: '#024731',
            padding: '3px 10px',
            borderRadius: '12px',
            fontWeight: 500,
          }}
        >
          {commentCount}
        </span>
      </td>
    </tr>
  );
};

export default TemplateItem;
