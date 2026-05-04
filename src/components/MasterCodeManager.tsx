'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button } from 'react-bootstrap';
import { setMasterCode } from '@/lib/dbActions';

export default function MasterCodeManager({ current }: { current: string }) {
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);
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
      {/* Current code display */}
      <div className="mb-3">
        <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '4px' }}>Current master code</div>
        <div className="d-flex align-items-center gap-2">
          <code style={{
            backgroundColor: '#f4f7f5', border: '1px solid #e4ebe7',
            borderRadius: '0.375rem', padding: '6px 12px', fontSize: '0.95rem',
            letterSpacing: revealed ? '0.05em' : '0.15em',
            color: '#212529', flexGrow: 1,
          }}>
            {current === '' ? (
              <span style={{ color: '#adb5bd', letterSpacing: 'normal' }}>Not set</span>
            ) : revealed ? current : '•'.repeat(Math.min(current.length, 16))}
          </code>
          <button
            onClick={() => setRevealed(r => !r)}
            style={{
              background: 'none', border: '1px solid #e4ebe7', borderRadius: '0.375rem',
              padding: '6px 10px', cursor: 'pointer', fontSize: '0.8rem', color: '#6c757d',
            }}
          >
            {revealed ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {/* Update form */}
      <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '4px' }}>Set new master code</div>
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
