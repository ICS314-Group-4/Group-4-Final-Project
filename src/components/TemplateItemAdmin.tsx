import { Template } from '@prisma/client';
import Link from 'next/link';

/* Renders a single row in the List Template table. See list/page.tsx. */
const TemplateItemAdmin = ({ id, title, template, author, category, tags, used }: Template) => (
  <tr>
    <td>{id}</td>
    <td>{title}</td>
    <td>{template}</td>
    <td>{author}</td>
    <td>{category}</td>
    <td>{tags.join(', ')}</td>
    <td>{used}</td>
    <td>
      <Link href={`/edit/${id}`}>Edit</Link>
      <Link href={`/view/${id}`}>View</Link>
    </td>
  </tr>
);

export default TemplateItemAdmin;
