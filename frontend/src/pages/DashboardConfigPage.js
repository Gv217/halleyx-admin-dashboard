import { useState, useEffect, useRef } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { WIDGET_TYPES } from '../utils/constants';
import WidgetConfigPanel from '../components/dashboard/WidgetConfigPanel';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Topbar from '../components/common/Topbar';
import { useToast } from '../utils/toast';
import { KpiWidget, BarWidget, LineWidget, AreaWidget, ScatterWidget, PieWidget, TableWidget } from '../components/widgets/WidgetRenderers';

const RENDER = { kpi: KpiWidget, bar: BarWidget, line: LineWidget, area: AreaWidget, scatter: ScatterWidget, pie: PieWidget, table: TableWidget };
let uid = 1000;
const nid = () => `w${uid++}`;

export default function DashboardConfigPage({ onMenuClick }) {
  const [widgets, setWidgets] = useState([]);
  const [layout,  setLayout]  = useState([]);
  const [orders,  setOrders]  = useState([]);
  const [panel,   setPanel]   = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [cw,      setCw]      = useState(900);
  const canvasRef = useRef();
  const toast = useToast();
  const nav = useNavigate();

  useEffect(() => {
    const obs = new ResizeObserver(([e]) => setCw(Math.max(400, e.contentRect.width - 32)));
    if (canvasRef.current) obs.observe(canvasRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    api.getOrders().then(d => setOrders(Array.isArray(d) ? d : [])).catch(() => {});
    api.getLayout().then(data => {
      if (data?.widgets?.length) {
        setWidgets(data.widgets);
        setLayout(data.layout || data.widgets.map(w => ({ i: w.id, x: w.x || 0, y: w.y || 0, w: w.w || 4, h: w.h || 4 })));
      }
    }).catch(() => {});
  }, []);

  const addWidget = type => {
    const def = WIDGET_TYPES.find(t => t.type === type);
    const id  = nid();
    setWidgets(p => [...p, { id, type, config: { title: def?.label || type, columns: ['customer_name', 'product', 'total_amount', 'status'] } }]);
    setLayout(p  => [...p, { i: id, x: (p.length * 3) % 12, y: Infinity, w: def?.dw || 4, h: def?.dh || 4, minW: 1, minH: 2 }]);
    toast(`${def?.label} added`, 'info');
  };

  const removeWidget = id => {
    setWidgets(p => p.filter(w => w.id !== id));
    setLayout(p  => p.filter(l => l.i !== id));
    setConfirm(null);
    toast('Widget removed', 'ok');
  };

  const updateWidget = updated => {
    setWidgets(p => p.map(w => w.id === updated.id ? updated : w));
    setLayout(p  => p.map(l => l.i === updated.id ? { ...l, w: updated.config.width || l.w, h: updated.config.height || l.h } : l));
    setPanel(null);
    toast('Widget updated', 'ok');
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.saveLayout({ widgets, layout });
      setSaved(true); toast('Configuration saved!', 'ok');
      setTimeout(() => setSaved(false), 3000);
    } catch { toast('Save failed — is the backend running?', 'err'); }
    finally { setSaving(false); }
  };

  const groups = WIDGET_TYPES.reduce((a, t) => { (a[t.group] = a[t.group] || []).push(t); return a; }, {});

  return (
    <div className="page">
      <Topbar title="Configure Dashboard" subtitle={`${widgets.length} widget${widgets.length !== 1 ? 's' : ''} on canvas`} onMenuClick={onMenuClick}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => nav('/')}>← View Dashboard</button>
            {widgets.length > 0 && <button className="btn btn-ghost btn-sm" onClick={() => { setWidgets([]); setLayout([]); }}>Clear all</button>}
            <button className="btn btn-primary" onClick={save} disabled={saving || widgets.length === 0} style={{ minWidth: 150 }}>
              {saving ? <><span className="spin" style={{ width: 13, height: 13 }} /> Saving…</>
                : saved ? '✓ Saved!' : 'Save Configuration'}
            </button>
          </div>
        }
      />

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>
        {/* Palette */}
        <div className="palette">
          <div className="pal-hd">
            <div className="pal-title">Widgets</div>
            <div className="pal-sub">Click to add to canvas</div>
          </div>
          <div className="pal-body">
            {Object.entries(groups).map(([group, items]) => (
              <div key={group}>
                <div className="pal-group">{group}</div>
                {items.map(item => (
                  <div key={item.type} className="pal-item" onClick={() => addWidget(item.type)}>
                    <span className="pal-ico">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div ref={canvasRef} style={{
          flex: 1, padding: '20px 16px', overflowY: 'auto',
          backgroundImage: 'radial-gradient(circle, var(--accent-dim) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}>
          {widgets.length === 0 ? (
            <div className="empty" style={{ minHeight: '60vh' }}>
              <div className="empty-ico" style={{ width: 64, height: 64 }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="var(--t3)" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="2" y="2" width="10" height="10" rx="2.5"/><rect x="16" y="2" width="10" height="10" rx="2.5"/>
                  <rect x="2" y="16" width="10" height="10" rx="2.5"/><rect x="16" y="16" width="10" height="10" rx="2.5"/>
                </svg>
              </div>
              <div className="empty-title">Canvas is empty</div>
              <div className="empty-desc">Click any widget in the left panel to add it to your dashboard.</div>
            </div>
          ) : (
            <>
              <style>{`.react-grid-item.react-grid-placeholder{background:var(--accent-dim)!important;border:1.5px dashed var(--accent)!important;border-radius:14px!important;opacity:.7!important}`}</style>
              <GridLayout layout={layout} cols={12} rowHeight={56} width={cw} onLayoutChange={setLayout}
                draggableHandle=".wcard-hd" margin={[10, 10]} containerPadding={[0, 0]}>
                {widgets.map(w => {
                  const R = RENDER[w.type];
                  return (
                    <div key={w.id}>
                      <div className="wcard">
                        <div className="wcard-hd">
                          <div>
                            <div className="wcard-title">{w.config?.title || w.type}</div>
                            <div className="wcard-type">{w.type}</div>
                          </div>
                          <div className="wactions">
                            <button className="btn btn-ghost btn-icon" style={{ padding: 5, width: 24, height: 24 }} onClick={() => setPanel(w)} title="Settings">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6" cy="6" r="2"/><path d="M6 1v1M6 10v1M1 6h1M10 6h1M2.64 2.64l.71.71M8.65 8.65l.71.71M2.64 9.36l.71-.71M8.65 3.35l.71-.71"/></svg>
                            </button>
                            <button className="btn btn-danger btn-icon" style={{ padding: 5, width: 24, height: 24 }} onClick={() => setConfirm(w)} title="Delete">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 3h9M4 3V2h4v1M3.5 3v7h5V3"/></svg>
                            </button>
                          </div>
                        </div>
                        <div className="wcard-body">
                          {R && <R config={w.config || {}} orders={orders} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </GridLayout>
            </>
          )}
        </div>
      </div>

      {panel   && <WidgetConfigPanel widget={panel}   onSave={updateWidget} onClose={() => setPanel(null)} />}
      {confirm && <ConfirmDialog title="Remove Widget" msg={`Remove "${confirm.config?.title || confirm.type}" from the canvas?`} onOk={() => removeWidget(confirm.id)} onCancel={() => setConfirm(null)} />}
    </div>
  );
}