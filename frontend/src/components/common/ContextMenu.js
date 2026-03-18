import { useEffect, useRef } from 'react';

export default function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef();

  useEffect(() => {
    const h = e => { if (!ref.current?.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  // Keep menu inside viewport
  const menuW = 180, menuH = items.length * 38;
  const left = x + menuW > window.innerWidth  ? x - menuW : x;
  const top  = y + menuH > window.innerHeight ? y - menuH : y;

  return (
    <div ref={ref} className="ctx-menu" style={{ left, top }}>
      {items.map((it, i) =>
        it.divider
          ? <div key={i} className="ctx-div" />
          : <div key={i} className={`ctx-item${it.danger ? ' danger' : ''}`}
              onClick={() => { it.fn(); onClose(); }}>
              {it.icon && <span style={{ display: 'flex', alignItems: 'center' }}>{it.icon}</span>}
              {it.label}
            </div>
      )}
    </div>
  );
}