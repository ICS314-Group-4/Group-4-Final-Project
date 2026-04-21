import { User } from '@prisma/client';
import { categoryLabels } from '@/lib/categoryLabels';
import { deleteUser } from '@/lib/dbActions';

/* Renders a single row in the List User table. See list/page.tsx. */
const UserItemAdmin = ({ user }: { user: User }) => (
  <tr
      className="align-middle"
      style={{ cursor: 'pointer' }}
      onClick={() => { window.location.href = `/viewadmin/${user.id}`; }}
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
          {user.name}
        </div>
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
          {categoryLabels[user.role as keyof typeof categoryLabels]}
        </span>
      </td>
      <td className="text-muted" style={{ fontSize: '0.85rem' }}>{user.email}</td>
      <td>
        <span className="text-muted" style={{ fontSize: '0.85rem' }}>
          {user.role ?? 'N/A'}
        </span>
      </td>
      <td className="py-3 text-end" onClick={(e) => e.stopPropagation()}>
      <div className="d-flex justify-content-end gap-2">
        <button
          className="btn btn-sm btn-outline-danger"
          style={{ fontSize: '0.75rem' }}
          onClick={async (e) => {
            e.stopPropagation();
            if (confirm(`Delete "${user.name}"?`)) {
              await deleteUser(user.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </td>
    </tr>
);

export default UserItemAdmin;
