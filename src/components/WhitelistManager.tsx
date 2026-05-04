'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, Table } from 'react-bootstrap';
import { addWhitelistEntry, removeWhitelistEntry } from '@/lib/dbActions';

type Entry = { id: number; username: string; name: string };

export default function WhitelistManager({ entries, registeredCount = 0 }: { entries: Entry[]; registeredCount?: number }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!username.trim()) { setError('Username is required.'); return; }
    if (!name.trim()) { setError('Display name is required.'); return; }
    setAdding(true);
    setError('');
    try {
      await addWhitelistEntry(username.trim(), name.trim());
      setUsername('');
      setName('');
      router.refresh();
    } catch {
      setError('Username already exists in the whitelist.');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: number) => {
    await removeWhitelistEntry(id);
    router.refresh();
  };

  return (
    <div>
      {/* Existing entries */}
      {registeredCount > 0 && (
        <div style={{
          fontSize: '0.8rem', color: '#5a6b64',
          backgroundColor: '#e8f0ec', border: '1px solid #c8d8d0',
          borderRadius: '0.375rem', padding: '8px 12px', marginBottom: '1rem',
        }}>
          {registeredCount} user{registeredCount !== 1 ? 's' : ''} on the whitelist {registeredCount !== 1 ? 'have' : 'has'} already registered and {registeredCount !== 1 ? 'are' : 'is'} not shown here.
        </div>
      )}
      {entries.length > 0 ? (
        <Table hover responsive style={{ tableLayout: 'fixed' }} className="mb-4">
          <thead>
            <tr style={{ borderBottom: '2px solid #e4ebe7', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6c757d' }}>
              <th className="py-2 fw-semibold" style={{ width: '35%' }}>UH Username</th>
              <th className="py-2 fw-semibold" style={{ width: '50%' }}>Display Name</th>
              <th className="py-2 fw-semibold" style={{ width: '15%' }} />
            </tr>
          </thead>
          <tbody>
            {entries.map(e => (
              <tr key={e.id} className="align-middle">
                <td style={{ fontSize: '0.9rem' }}>
                  <code style={{ backgroundColor: '#f4f7f5', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>
                    {e.username}
                  </code>
                </td>
                <td style={{ fontSize: '0.9rem' }}>{e.name}</td>
                <td>
                  <button
                    onClick={() => handleRemove(e.id)}
                    style={{
                      background: 'none', border: 'none', color: '#adb5bd',
                      fontSize: '0.8rem', cursor: 'pointer', padding: 0,
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p style={{ fontSize: '0.9rem', color: '#6c757d' }} className="mb-4">
          No entries yet. Add a UH username below to allow registration.
        </p>
      )}

      {/* Add entry form */}
      <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '6px', fontWeight: 500 }}>
        Add to whitelist
      </div>
      <div className="d-flex gap-2 flex-wrap">
        <Form.Control
          type="text"
          placeholder="UH username (e.g. john123)"
          value={username}
          onChange={e => { setUsername(e.target.value); setError(''); }}
          style={{ maxWidth: '200px', fontSize: '0.9rem', borderColor: '#e4ebe7' }}
        />
        <Form.Control
          type="text"
          placeholder="Display name (e.g. John Smith)"
          value={name}
          onChange={e => { setName(e.target.value); setError(''); }}
          style={{ maxWidth: '240px', fontSize: '0.9rem', borderColor: '#e4ebe7' }}
        />
        <Button
          onClick={handleAdd}
          disabled={adding}
          style={{ backgroundColor: '#024731', border: 'none' }}
        >
          {adding ? 'Adding...' : '+ Add'}
        </Button>
      </div>
      {error && <div style={{ fontSize: '0.8rem', color: '#dc3545', marginTop: '6px' }}>{error}</div>}
    </div>
  );
}
