'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button } from 'react-bootstrap';
import { setMasterCode } from '@/lib/dbActions';

export default function MasterCodeManager({ current }: { current: string }) {
  const router = useRouter();
  const isSet = current !== '';
  const [newCode, setNewCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!newCode.trim()) { setError('Master code cannot be empty.'); return; }
    setSaving(true);
    setError('');
    await setMasterCode(newCode.trim());
    setNewCode('');
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    router.refresh();
  };

  return (
    <div style={{ maxWidth: '480px' }}>
      {/* Status indicator */}
      <div className="mb-3">
        <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '4px' }}>Current status</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '6px 14px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 500,
          backgroundColor: isSet ? '#e8f0ec' : '#fff3cd',
          color: isSet ? '#024731' : '#856404',
          border: `1px solid ${isSet ? '#c8d8d0' : '#ffc107'}`,
        }}>
          <span>{isSet ? '✓ Master code is set' : '⚠ No master code set'}</span>
        </div>
        {isSet && (
          <p style={{ fontSize: '0.78rem', color: '#adb5bd', marginTop: '6px', marginBottom: 0 }}>
            The code is stored as a secure hash and cannot be retrieved. Set a new one below to replace it.
          </p>
        )}
      </div>

      {/* Update form */}
      <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '4px' }}>
        {isSet ? 'Replace master code' : 'Set master code'}
      </div>
      <div className="d-flex gap-2">
        <Form.Control
          type="password"
          placeholder="Enter new master code..."
          value={newCode}
          onChange={e => { setNewCode(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          style={{ fontSize: '0.9rem', borderColor: error ? '#dc3545' : '#e4ebe7' }}
        />
        <Button
          onClick={handleSave}
          disabled={saving}
          style={{ backgroundColor: '#024731', border: 'none', whiteSpace: 'nowrap' }}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      {error && <div style={{ fontSize: '0.8rem', color: '#dc3545', marginTop: '4px' }}>{error}</div>}
      {saved && (
        <div style={{ fontSize: '0.8rem', color: '#024731', marginTop: '4px', fontWeight: 500 }}>
          Master code updated.
        </div>
      )}
    </div>
  );
}
