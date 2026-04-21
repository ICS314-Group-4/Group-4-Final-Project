import { Template } from '@prisma/client';
import Link from 'next/link';
import { categoryLabels } from '@/lib/categoryLabels';

/* Renders a single row in the Browse Templates table. See list/page.tsx. */
const TemplateItem = ({ template, authorName }: { template: Template; authorName?: string }) => (
  <tr
    className="align-middle"
    style={{ cursor: 'pointer' }}
    onClick={() => { window.location.href = `/view/${template.id}`; }}
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
            <span
              key={tag}
              className="badge fw-normal"
              style={{ backgroundColor: '#024731', fontSize: '0.7rem' }}
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
    <td className="text-muted" style={{ fontSize: '0.85rem' }}>{authorName ?? template.author}</td>
    <td>
      <span className="text-muted" style={{ fontSize: '0.85rem' }}>
        {template.used ?? 0}×
      </span>
    </td>
  </tr>
);

export default TemplateItem;
