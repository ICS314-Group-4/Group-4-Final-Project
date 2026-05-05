'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table } from 'react-bootstrap';
import UserItemAdmin, { UserSummary } from './UserItemAdmin';
import { deleteUser } from '@/lib/dbActions';

type Props = {
  user: UserSummary[];
  roles: string[];
};

const UserFilterAdmin = ({ user }: Props) => {
  const router = useRouter();
  const [activeRole] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null);

  const showToast = (message: string, error = false) => {
    setToast({ message, error });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: number, name: string) => {
    const result = await deleteUser(id);
    if ('error' in result) { showToast(result.error, true); return; }
    router.refresh();
    showToast(`"${name}" deleted`);
  };

  const filtered = user.filter(u => {
    const matchesRole = activeRole === 'All' || u.role === activeRole;
    const q = search.toLowerCase();
    const matchesSearch = !q
      || u.name?.toLowerCase().includes(q)
      || u.email?.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          backgroundColor: toast.error ? '#842029' : '#024731', color: '#fff',
          padding: '12px 20px', borderRadius: '0.5rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          fontSize: '0.9rem', fontWeight: 500,
        }}>
          {toast.message}
        </div>
      )}

      {/* Search */}
      <div className="mb-4 d-flex flex-column gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or username..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '420px', fontSize: '0.9rem' }}
        />
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <Table hover responsive className="w-100" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr
              className="text-muted"
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                borderBottom: '2px solid #dee2e6',
              }}
            >
              <th className="py-3 fw-semibold" style={{ width: '35%' }}>Name</th>
              <th className="py-3 fw-semibold" style={{ width: '35%' }}>Username</th>
              <th className="py-3 fw-semibold" style={{ width: '20%' }}>Role</th>
              <th className="py-3 fw-semibold text-end" style={{ width: '10%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <UserItemAdmin key={u.id} user={u} onDelete={handleDelete} />
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center py-5 text-muted">
          <p className="mb-1">No users found.</p>
          <p style={{ fontSize: '0.9rem' }}>
            {search || activeRole !== 'All'
              ? 'Try adjusting your search or filter.'
              : 'User does not exist!'}
          </p>
        </div>
      )}
    </>
  );
};

export default UserFilterAdmin;
