'use client';

import { useState } from 'react';
import { Table } from 'react-bootstrap';
import { Category } from '@prisma/client';
import UserItemAdmin from './TemplateItemAdmin';
import { categoryLabels } from '@/lib/categoryLabels';
import { User } from 'next-auth';

type Props = {
  users: User[];
  roles: string[];
};

const UserFilterAdmin = ({ users, roles }: Props) => {
  const [activeRole, setActiveRole] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => {
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
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '420px', fontSize: '0.9rem' }}
        />
        <div className="d-flex flex-wrap gap-2">
          {['All', ...roles].map(name => (
            <button
              key={name}
              onClick={() => setActiveRole(name)}
              className="btn btn-sm"
              style={{
                fontSize: '0.8rem',
                backgroundColor: activeRole === name ? '#024731' : '#f0f0f0',
                color: activeRole === name ? '#fff' : '#333',
                border: 'none',
                borderRadius: '20px',
                padding: '5px 14px',
              }}
            >
              {name === 'All' ? 'All' : categoryLabels[name as Category] ?? name}
            </button>
          ))}
        </div>
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
              <th className="py-3 fw-semibold" style={{ width: '35%' }}>Email</th>
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
            {search || activeName !== 'All'
              ? 'Try adjusting your search or filter.'
              : 'Be the first to add one!'}
          </p>
        </div>
      )}
    </>
  );
};

export default UserFilterAdmin;
