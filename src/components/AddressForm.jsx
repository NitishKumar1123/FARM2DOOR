import React, { useState, useEffect } from 'react';

export default function AddressForm({ open, initial = null, onSave, onCancel }) {
  const [addr, setAddr] = useState({ label: '', line: '', city: '', zip: '', country: '' });

  useEffect(() => {
    if (initial) setAddr(initial);
    else setAddr({ label: '', line: '', city: '', zip: '', country: '' });
  }, [initial, open]);

  if (!open) return null;

  function save() {
    const payload = { ...addr };
    // Do NOT create an id here for new addresses. AuthContext.addAddress will generate the id.
    onSave && onSave(payload);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal address-modal" role="dialog">
        <div style={{ flex: 1 }}>
          <h3 className="modal-title">{addr?.id ? 'Edit Address' : 'Add Address'}</h3>

          <div className="address-form" style={{ marginTop: 8 }}>
            <label>Label</label>
            <input value={addr.label || ''} onChange={(e) => setAddr((s) => ({ ...s, label: e.target.value }))} />

            <label>Address line</label>
            <input value={addr.line || ''} onChange={(e) => setAddr((s) => ({ ...s, line: e.target.value }))} />

            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label>City</label>
                <input value={addr.city || ''} onChange={(e) => setAddr((s) => ({ ...s, city: e.target.value }))} />
              </div>
              <div style={{ width: 120 }}>
                <label>Zip</label>
                <input value={addr.zip || ''} onChange={(e) => setAddr((s) => ({ ...s, zip: e.target.value }))} />
              </div>
            </div>

            <label>Country</label>
            <input value={addr.country || ''} onChange={(e) => setAddr((s) => ({ ...s, country: e.target.value }))} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 12 }}>
          <button className="btn-primary" onClick={save}>{addr?.id ? 'Save' : 'Add'}</button>
          <button className="btn-link" onClick={() => onCancel && onCancel()}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
