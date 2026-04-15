import { Template } from '@prisma/client';
import { ArrowRight } from 'react-bootstrap-icons';
import Link from 'next/link';

/* Renders a single row in the List Template table. See list/page.tsx. */
const TemplateItem = ({ template }: { template: Template }) => (
  <tr id='template-item' className="align-middle">
    {/*tagged parts to be styled later*/}
    <td>{template.id}</td>
    <td>
      <div className='fs-4 fw-bold template-title overflow-auto'>{template.title}</div>
      {template.tags?.length && (
        <div className="mt-1 d-flex flex-wrap gap-1 overflow-auto">
          {template.tags.map((tag) => (
            <span key={tag} className="badge text-bg-dark border fw-semibold template-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </td>
    <td>{template.category}</td>
    <td className="text-muted">{template.author}</td>
    <td>{template.used}</td>
    <td>
      <Link className='text-dark' href={`/view/${template.id}`}><ArrowRight /></Link>
    </td>
  </tr>
);

export default TemplateItem;
