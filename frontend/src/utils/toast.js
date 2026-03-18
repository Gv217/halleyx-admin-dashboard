import { createContext, useContext, useState, useCallback } from 'react';
const noop = () => {};
const Ctx  = createContext(noop);
export function ToastProvider({ children }) {
  const [list, setList] = useState([]);
  const show = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setList(p => [...p, { id, msg, type }]);
    setTimeout(() => setList(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  const col = { ok:'var(--green)', err:'var(--red)', info:'var(--accent)' };
  const ico = { ok:'✓', err:'✕', info:'ℹ' };
  return (
    <Ctx.Provider value={show}>
      {children}
      <div style={{position:'fixed',top:14,right:14,zIndex:9999,display:'flex',flexDirection:'column',gap:8,pointerEvents:'none'}}>
        {list.map(t => (
          <div key={t.id} style={{
            background:'var(--bg3)',border:'1px solid var(--bd2)',
            borderLeft:`3px solid ${col[t.type]||col.info}`,
            borderRadius:8,padding:'11px 16px',display:'flex',alignItems:'center',gap:10,
            minWidth:260,maxWidth:360,fontSize:13,color:'var(--t1)',
            boxShadow:'var(--shadow-lg)',animation:'fadeIn .2s ease',pointerEvents:'all',
          }}>
            <span style={{color:col[t.type]||col.info,fontWeight:700,flexShrink:0}}>{ico[t.type]||'ℹ'}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
export function useToast() { const c = useContext(Ctx); return typeof c === 'function' ? c : noop; }