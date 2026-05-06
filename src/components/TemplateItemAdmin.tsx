import { Template } from '@prisma/client';
import { categoryLabels } from '@/lib/categoryLabels';
import { deleteTemplate } from '@/lib/dbActions';
import { useRouter } from 'next/navigation';

/* Renders a single row in the List Template table. See list/page.tsx. */
const TemplateItemAdmin = ({ template, onTagClick }: { template: Template; onTagClick?: (tag: string) => void }) => {
  const router = useRouter();

  const tagSearchEvent = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    if (onTagClick) onTagClick(tag);
  };
  
  return (
  <tr
      className="align-middle"
      style={{ cursor: 'pointer' }}
      onClick={() => router.push(`/viewadmin/${template.id}`)}
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
              await deleteTemplate(template.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </td>
    </tr>
  );
};

export default TemplateItemAdmin;
