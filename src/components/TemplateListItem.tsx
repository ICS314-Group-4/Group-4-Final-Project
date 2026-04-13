
interface Template {
    title: string;
    body: string;
    tags?: string[];
    owner: string;
    category: string;
}

const TemplateListItem = ({ template }: { template: Template }) => (
  <tr>
    <td className="px-4 py-3 fw-semibold">
      <div>{template.title}</div>
      {template.tags && template.tags.length > 0 ? (
        <div className="mt-1 d-flex flex-wrap gap-1">
          {template.tags.map((tag) => (
            <span key={tag} className="badge text-bg-dark border fw-normal">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </td>
    <td className="px-4 py-3">{template.category}</td>
    <td className="px-4 py-3 text-muted">{template.owner}</td>
  </tr>
);

export default TemplateListItem;