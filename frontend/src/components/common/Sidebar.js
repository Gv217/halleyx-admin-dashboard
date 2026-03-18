import { NavLink } from 'react-router-dom';
import { useTheme } from '../../utils/ThemeContext';

export default function Sidebar({ open, onClose }) {
  const { dark, toggle } = useTheme();
  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sb-brand">
        <div className="sb-logo">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" opacity=".9"/>
            <rect x="10" y="1" width="7" height="7" rx="1.5" fill="white" opacity=".5"/>
            <rect x="1" y="10" width="7" height="7" rx="1.5" fill="white" opacity=".5"/>
            <rect x="10" y="10" width="7" height="7" rx="1.5" fill="white" opacity=".9"/>
          </svg>
        </div>
        <div style={{flex:1}}>
          <div className="sb-name">Halleyx</div>
          <div className="sb-sub">Dashboard v2</div>
        </div>
        {/* close on mobile */}
        <button onClick={onClose} style={{background:'none',border:'none',color:'var(--t3)',cursor:'pointer',display:'none',padding:4}} className="sb-close-btn">✕</button>
      </div>

      <nav className="sb-nav">
        <div className="sb-label">Navigation</div>
        {[
          {to:'/', label:'Dashboard', end:true, icon:<GridIco/>},
          {to:'/configure', label:'Configure', icon:<CfgIco/>},
          {to:'/orders',    label:'Orders',    icon:<OrdIco/>},
        ].map(n => (
          <NavLink key={n.to} to={n.to} end={n.end}
            className={({isActive}) => `nav-link${isActive?' active':''}`}
            onClick={onClose}>
            <span style={{display:'flex',alignItems:'center',flexShrink:0}}>{n.icon}</span>
            {n.label}
          </NavLink>
        ))}

        <div style={{height:1,background:'var(--bd1)',margin:'12px 0 8px'}}/>
        <div className="sb-label">Appearance</div>

        {/* Theme toggle in sidebar */}
        <div onClick={toggle} style={{
          display:'flex',alignItems:'center',gap:9,padding:'9px 10px',
          borderRadius:6,cursor:'pointer',border:'1px solid var(--bd1)',
          background:'var(--bg3)',transition:'all .14s',marginBottom:3,
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor='var(--bd3)'}
          onMouseLeave={e => e.currentTarget.style.borderColor='var(--bd1)'}
        >
          <span style={{fontSize:15,width:22,textAlign:'center'}}>{dark ? '☀️' : '🌙'}</span>
          <span style={{fontSize:12,fontWeight:500,color:'var(--t2)'}}>{dark ? 'Light mode' : 'Dark mode'}</span>
          {/* pill toggle */}
          <div style={{
            marginLeft:'auto',width:36,height:20,borderRadius:99,
            background: dark ? 'var(--accent)' : 'var(--bd3)',
            position:'relative',transition:'background .2s',flexShrink:0,
          }}>
            <div style={{
              position:'absolute',top:2,
              left: dark ? 18 : 2,
              width:16,height:16,borderRadius:'50%',
              background:'#fff',transition:'left .2s',
              boxShadow:'0 1px 3px rgba(0,0,0,.3)',
            }}/>
          </div>
        </div>
      </nav>

      <div className="sb-footer">
        <div className="sb-user">
          <div className="sb-ava">MH</div>
          <div>
            <div className="sb-uname">Michael Harris</div>
            <div className="sb-urole">Admin</div>
          </div>
          <div className="sb-dot"/>
        </div>
      </div>

      <style>{`.sb-close-btn{display:none!important}@media(max-width:900px){.sb-close-btn{display:block!important}}`}</style>
    </aside>
  );
}

const GridIco = () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="1" width="5.5" height="5.5" rx="1.5"/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1.5"/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1.5"/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.5"/></svg>;
const CfgIco  = () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="7.5" cy="7.5" r="2.2"/><path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.2 3.2l1.05 1.05M10.75 10.75l1.05 1.05M3.2 11.8l1.05-1.05M10.75 4.25l1.05-1.05"/></svg>;
const OrdIco  = () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2.5 2h10l1.5 4H1L2.5 2z"/><path d="M1 6v8h13V6"/><path d="M5.5 10h4"/></svg>;