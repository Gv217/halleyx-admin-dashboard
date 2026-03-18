export default function ConfirmDialog({ title, msg, onOk, onCancel }) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <div>
            <div className="modal-title">{title}</div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onCancel}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>
          </button>
        </div>
        <div className="modal-body">
          <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.65 }}>{msg}</div>
        </div>
        <div className="modal-ft">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onOk}>Delete</button>
        </div>
      </div>
    </div>
  );
}