'use client';

import { useState } from 'react';
import { Table } from 'react-bootstrap';
import UserItemAdmin, { UserSummary } from './UserItemAdmin';

type Props = {
  user: UserSummary[];
  roles: string[];
};

const UserFilterAdmin = ({ user }: Props) => {
  const [activeRole] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filtered = user.filter(u => {
    const matchesRole = activeRole === 'All' || u.role === activeRole;
    
    const q = search.toLowerCase();
    const matchesSearch = !q
      || u.name?.toLowerCase().includes(q)
      || u.email?.toLowerCase().includes(q)
    return matchesRole && matchesSearch;
  });

  return (
    <>
      {/* Search + filters */}
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
        <Table
          hover
          responsive
          className="w-100"
          style={{ tableLayout: 'fixed' }}
        >
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
              <UserItemAdmin key={u.id} user={u} />
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
