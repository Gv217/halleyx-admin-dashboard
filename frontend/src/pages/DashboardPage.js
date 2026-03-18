import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { api } from '../utils/api';
import { DATE_FILTERS } from '../utils/constants';
import Topbar from '../components/common/Topbar';
import { KpiWidget, BarWidget, LineWidget, AreaWidget, ScatterWidget, PieWidget, TableWidget } from '../components/widgets/WidgetRenderers';

const RENDER = { kpi: KpiWidget, bar: BarWidget, line: LineWidget, area: AreaWidget, scatter: ScatterWidget, pie: PieWidget, table: TableWidget };

function filterDate(orders, f) {
  if (f === 'all') return orders;
  const now = new Date(), days = { today: 0, '7d': 7, '30d': 30, '90d': 90 }[f];
  const cut = new Date(now);
  if (days === 0) cut.setHours(0,0,0,0); else cut.setDate(now.getDate() - days);
  return orders.filter(r => new Date(r.order_date || r.created_at) >= cut);
}

export default function DashboardPage({ onMenuClick }) {
  const [widgets, setWidgets] = useState([]);
  const [layout,  setLayout]  = useState([]);
  const [orders,  setOrders]  = useState([]);
  const [df,      setDf]      = useState('all');
  const [loading, setLoading] = useState(true);
  const [cw,      setCw]      = useState(900);
  const canvasRef = useRef();
  const nav = useNavigate();

  useEffect(() => {
    const obs = new ResizeObserver(([e]) => setCw(Math.max(400, e.contentRect.width - 32)));
    if (canvasRef.current) obs.observe(canvasRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getLayout().catch(() => null),
      api.getOrders().catch(() => null),
    ]).then(([ld, od]) => {
      if (ld?.widgets?.length) {
        setWidgets(ld.widgets);
        setLayout(ld.layout || ld.widgets.map(w => ({ i: w.id, x: w.x || 0, y: w.y || 0, w: w.w || 4, h: w.h || 4 })));
      }
      setOrders(od && Array.isArray(od) ? od : []);
    }).finally(() => setLoading(false));
  }, []);

  const visible = filterDate(orders, df);
  const rev  = visible.reduce((s, r) => s + (parseFloat(r.total_amount) || 0), 0);
  const done = visible.filter(r => r.status === 'Completed').length;
  const pend = visible.filter(r => r.status === 'Pending').length;

  const KPIS = [
    { label: 'Orders',    value: visible.length,                                           color: 'var(--accent)', bg: 'var(--accent-dim)', icon: '📊' },
    { label: 'Revenue',   value: `$${rev.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`, color: 'var(--cyan)', bg: 'var(--cyan-dim)', icon: '💰', mono: true },
    { label: 'Pending',   value: pend,                                                     color: 'var(--amber)', bg: 'var(--amber-dim)', icon: '⏳' },
    { label: 'Completed', value: done,                                                     color: 'var(--green)', bg: 'var(--green-dim)', icon: '✅' },
  ];

  if (loading) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spin" style={{ width: 26, height: 26, margin: '0 auto 12px' }} />
        <div style={{ color: 'var(--t2)', fontSize: 13 }}>Loading dashboard…</div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <Topbar
        title="Dashboard"
        subtitle={widgets.length > 0 ? `${widgets.length} widgets · ${visible.length} orders` : 'No widgets configured'}
        onMenuClick={onMenuClick}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--t3)', whiteSpace: 'nowrap' }}>Show data for</span>
            <select className="select" style={{ width: 130 }} value={df} onChange={e => setDf(e.target.value)}>
              {DATE_FILTERS.map(f => <option key={f.v} value={f.v}>{f.l}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" onClick={() => nav('/configure')}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="6" cy="6" r="2"/><path d="M6 1v1M6 10v1M1 6h1M10 6h1"/></svg>
              Configure
            </button>
          </div>
        }
      />

      <div className="page-body">
        {/* Always-visible KPI strip */}
        <div className="kpi-row">
          {KPIS.map(k => (
            <div key={k.label} className="kpi-card">
              <div className="kpi-bar" style={{ background: k.color }} />
              <div className="kpi-ico" style={{ background: k.bg, color: k.color }}>{k.icon}</div>
              <div className="kpi-lbl">{k.label}</div>
              <div className="kpi-val" style={{ color: k.color, fontSize: k.mono ? 20 : 26, fontFamily: k.mono ? 'JetBrains Mono,monospace' : undefined }}>
                {k.value}
              </div>
              <div className="kpi-sub">{DATE_FILTERS.find(f => f.v === df)?.l}</div>
            </div>
          ))}
        </div>

        {/* Widgets or empty state */}
        {widgets.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--bd1)', borderRadius: 14, padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: 14, background: 'var(--accent-dim)', border: '1px solid var(--accent-bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="var(--accent-hi)" strokeWidth="1.5" strokeLinecap="round">
                <rect x="2" y="2" width="10" height="10" rx="2.5"/><rect x="14" y="2" width="10" height="10" rx="2.5"/>
                <rect x="2" y="14" width="10" height="10" rx="2.5"/><rect x="14" y="14" width="10" height="10" rx="2.5"/>
              </svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--t1)' }}>Build your dashboard</div>
            <div style={{ fontSize: 13, color: 'var(--t2)', maxWidth: 360, margin: '0 auto 22px', lineHeight: 1.7 }}>
              Add widgets like KPI cards, charts, and tables — all powered by live Customer Order data.
            </div>
            <button className="btn btn-primary" style={{ fontSize: 14, padding: '10px 24px' }} onClick={() => nav('/configure')}>
              Configure Dashboard
            </button>
          </div>
        ) : (
          <div ref={canvasRef}>
            <GridLayout layout={layout} cols={12} rowHeight={56} width={cw} isDraggable={false} isResizable={false} margin={[10, 10]} containerPadding={[0, 0]}>
              {widgets.map(w => {
                const R = RENDER[w.type];
                return (
                  <div key={w.id}>
                    <div className="wcard">
                      <div className="wcard-hd" style={{ cursor: 'default' }}>
                        <div>
                          <div className="wcard-title">{w.config?.title || w.type}</div>
                          {w.config?.description && <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 1 }}>{w.config.description}</div>}
                        </div>
                        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--t4)', textTransform: 'uppercase' }}>{w.type}</span>
                      </div>
                      <div className="wcard-body">
                        {R && <R config={w.config || {}} orders={visible} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </GridLayout>
          </div>
        )}
      </div>
    </div>
  );
}