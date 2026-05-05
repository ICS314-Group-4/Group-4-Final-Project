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
const UserItemAdmin = ({ user }: Props) => {
  const isAdmin = user.role?.toUpperCase() === 'ADMIN';

  return (
  <tr
      className="align-middle"
      style={{ cursor: 'pointer' }}
      onClick={() => { window.location.href = `/user-templates/?id=${user.id}`; }}
    >
      <td style={{ maxWidth: '340px', height: '56px' }}>
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
      <td className="text-muted" style={{ fontSize: '0.85rem', height: '56px' }}>{user.email}</td>
      <td className="text-muted" style={{ fontSize: '0.85rem', height: '56px' }}>{user.role}</td>
      <td className="text-end" style={{ fontSize: '0.85rem', height: '56px' }} onClick={(e) => e.stopPropagation()}>
      <div className="d-flex justify-content-end gap-2">
        <button
            className="btn btn-sm btn-outline-primary"
            style={{ fontSize: '0.75rem' }}
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/auth/edit-profile?id=${user.id}`;
            }}
          >
            Edit
          </button>
          {!isAdmin && (
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
          )}
      </div>
    </td>
    </tr>
)};

export default UserItemAdmin;
