import { useTheme } from '../../utils/ThemeContext';

export default function Topbar({ title, subtitle, actions, onMenuClick }) {
  const { dark, toggle } = useTheme();
  return (
    <div className="topbar">
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        {/* mobile menu */}
        <button className="sb-open-btn" onClick={onMenuClick} aria-label="Menu">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M2 4h12M2 8h12M2 12h12"/>
          </svg>
        </button>
        <div className="tb-left">
          <span className="tb-title">{title}</span>
          {subtitle && <span className="tb-sub">{subtitle}</span>}
        </div>
      </div>
      <div className="tb-right">
        {actions}
        {/* theme toggle button in topbar */}
        <button className="theme-toggle" onClick={toggle} title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {dark
            ? <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="7.5" cy="7.5" r="3"/><path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.2 3.2l1.1 1.1M10.7 10.7l1.1 1.1M3.2 11.8l1.1-1.1M10.7 4.3l1.1-1.1"/></svg>
            : <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M13 7.5a5.5 5.5 0 01-7-7 5.5 5.5 0 100 14 5.5 5.5 0 007-7z"/></svg>
          }
        </button>
      </div>
    </div>
  );
}