import React from 'react';

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true">
        <div style={{ flex: 1 }}>
          <h3 className="modal-title">{title || 'Confirm'}</h3>
          <div style={{ marginTop: 8 }}>{message}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 12 }}>
          <button className="btn-primary" onClick={() => onConfirm && onConfirm()}>Confirm</button>
          <button className="btn-link" onClick={() => onCancel && onCancel()}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
