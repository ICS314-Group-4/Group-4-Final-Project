import { deleteUser } from '@/lib/dbActions';

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: string;
}

type Props = {
  user: UserSummary;
};

/* Renders a single row in the List User table. See list/page.tsx. */
const UserItemAdmin = ({ user }: Props) => (
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
      <td className="text-muted" style={{ fontSize: '0.85rem' }}>{user.email}</td>
      <td className="text-muted" style={{ fontSize: '0.85rem' }}>{user.role}</td>
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
