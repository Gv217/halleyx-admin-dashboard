import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { STATUS_CLS, STATUSES } from '../utils/constants';
import OrderModal from '../components/orders/OrderModal';
import ContextMenu from '../components/common/ContextMenu';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Topbar from '../components/common/Topbar';
import { useToast } from '../utils/toast';

const PER = 10;

export default function OrdersPage({ onMenuClick }) {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [search,  setSearch]  = useState('');
  const [sf,      setSf]      = useState('');
  const [page,    setPage]    = useState(1);
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [menu,    setMenu]    = useState(null);
  const toast = useToast();

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const p = {};
      if (search.trim()) p.search = search.trim();
      if (sf) p.status = sf;
      const d = await api.getOrders(p);
      setRows(Array.isArray(d) ? d : []);
    } catch (e) {
      setError(e.message);
      setRows([]);
    } finally { setLoading(false); }
  }, [search, sf]);

  useEffect(() => { load(); setPage(1); }, [load]);
  useEffect(() => {
    const h = () => setMenu(null);
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  const handleSave = async (data) => {
    if (modal !== 'new') {
      await api.updateOrder(modal.id, data);
      toast('Order updated', 'ok');
    } else {
      await api.createOrder(data);
      toast('Order created successfully', 'ok');
    }
    setModal(null);
    load();
  };

  const handleDelete = async () => {
    try {
      await api.deleteOrder(confirm.id);
      toast('Order deleted', 'ok');
      setConfirm(null); load();
    } catch (e) { toast(e.message, 'err'); }
  };

  const filtered = rows.filter(r => {
    const s = search.toLowerCase();
    const nm = (r.customer_name || `${r.first_name || ''} ${r.last_name || ''}`).toLowerCase();
    return (!s || nm.includes(s) || (r.email || '').toLowerCase().includes(s) || String(r.id).includes(s))
        && (!sf || r.status === sf);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER));
  const pageRows   = filtered.slice((page - 1) * PER, page * PER);

  const total   = rows.length;
  const pending = rows.filter(r => r.status === 'Pending').length;
  const inprog  = rows.filter(r => r.status === 'In progress').length;
  const done    = rows.filter(r => r.status === 'Completed').length;
  const revenue = rows.reduce((s, r) => s + (parseFloat(r.total_amount) || 0), 0);

  const fmt  = v  => `$${(parseFloat(v) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtd = dt => dt ? new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const name = r  => r.customer_name || `${r.first_name || ''} ${r.last_name || ''}`.trim();

  const KPIS = [
    { label: 'Total Orders', value: total,        color: 'var(--accent)',  bg: 'var(--accent-dim)',  icon: '📦' },
    { label: 'Revenue',      value: fmt(revenue),  color: 'var(--cyan)',    bg: 'var(--cyan-dim)',    icon: '💰', mono: true },
    { label: 'In Progress',  value: inprog,        color: 'var(--amber)',   bg: 'var(--amber-dim)',   icon: '⚙️' },
    { label: 'Completed',    value: done,          color: 'var(--green)',   bg: 'var(--green-dim)',   icon: '✅' },
  ];

  return (
    <div className="page">
      <Topbar
        title="Customer Orders"
        subtitle={loading ? 'Loading…' : `${filtered.length} record${filtered.length !== 1 ? 's' : ''}`}
        onMenuClick={onMenuClick}
        actions={
          <button className="btn btn-primary" onClick={() => setModal('new')}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 1v10M1 6h10"/></svg>
            Create Order
          </button>
        }
      />

      <div className="page-body">
        {/* KPI Cards */}
        <div className="kpi-row">
          {KPIS.map(k => (
            <div key={k.label} className="kpi-card">
              <div className="kpi-bar" style={{ background: k.color }} />
              <div className="kpi-ico" style={{ background: k.bg, color: k.color }}>{k.icon}</div>
              <div className="kpi-lbl">{k.label}</div>
              <div className="kpi-val" style={{ color: k.color, fontSize: k.mono ? 20 : 26, fontFamily: k.mono ? 'JetBrains Mono,monospace' : undefined }}>
                {k.value}
              </div>
              <div className="kpi-sub">{total} total</div>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: 'var(--red)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚠</span> <span>{error}</span>
            <button className="btn btn-xs btn-danger" style={{ marginLeft: 'auto' }} onClick={load}>Retry</button>
          </div>
        )}

        {/* Table card */}
        <div className="card" style={{ padding: 0 }}>
          {/* Toolbar */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--bd1)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-wrap" style={{ flex: 1, minWidth: 180 }}>
              <span className="s-icon">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="5.5" cy="5.5" r="4"/><path d="M9 9l3 3"/></svg>
              </span>
              <input className="input s-input" style={{ paddingTop: 8, paddingBottom: 8 }} placeholder="Search name, email, ID…"
                value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <select className="select" style={{ width: 150 }} value={sf} onChange={e => { setSf(e.target.value); setPage(1); }}>
              <option value="">All statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn btn-ghost btn-sm" onClick={load}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 6a4 4 0 11-1.4-3"/><path d="M10 2v3H7"/></svg>
              Refresh
            </button>
            <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'JetBrains Mono,monospace', marginLeft: 'auto' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ padding: '40px 20px' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                  {[80, 160, 180, 50, 80, 80, 90, 80].map((w, j) => (
                    <div key={j} className="skel" style={{ height: 13, width: w }} />
                  ))}
                </div>
              ))}
            </div>
          ) : pageRows.length === 0 ? (
            <div className="empty">
              <div className="empty-ico">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="var(--t3)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M4 4h18l2 6H2L4 4z"/><path d="M2 10v14h22V10"/><path d="M10 16h6"/>
                </svg>
              </div>
              <div className="empty-title">{search || sf ? 'No matching orders' : 'No orders yet'}</div>
              <div className="empty-desc">{search || sf ? 'Try adjusting your search or filter.' : 'Click "Create Order" to add your first order.'}</div>
              {!search && !sf && <button className="btn btn-primary" onClick={() => setModal('new')}>Create Order</button>}
            </div>
          ) : (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr><th>ID</th><th>Customer</th><th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th><th>Status</th><th>Date</th><th>Agent</th></tr>
                </thead>
                <tbody>
                  {pageRows.map(r => (
                    <tr key={r.id} onContextMenu={e => { e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY, row: r }); }}>
                      <td><span className="td-mono">#{r.id}</span></td>
                      <td>
                        <div className="td-hi">{name(r)}</div>
                        <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{r.email}</div>
                      </td>
                      <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.product}</td>
                      <td style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12 }}>{r.quantity}</td>
                      <td style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12 }}>{fmt(r.unit_price)}</td>
                      <td style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'var(--cyan)', fontWeight: 600 }}>{fmt(r.total_amount)}</td>
                      <td><span className={`badge ${STATUS_CLS[r.status] || ''}`}>{r.status}</span></td>
                      <td style={{ fontSize: 11, color: 'var(--t3)' }}>{fmtd(r.order_date)}</td>
                      <td style={{ fontSize: 11, color: 'var(--t2)', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.created_by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--bd1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'JetBrains Mono,monospace' }}>
                {(page-1)*PER+1}–{Math.min(page*PER, filtered.length)} of {filtered.length}
              </span>
              <div className="pager">
                <button className="pager-btn" disabled={page===1}          onClick={() => setPage(1)}>«</button>
                <button className="pager-btn" disabled={page===1}          onClick={() => setPage(p=>p-1)}>‹</button>
                {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>Math.abs(p-page)<=2).map(p=>(
                  <button key={p} className={`pager-btn${p===page?' on':''}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="pager-btn" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>›</button>
                <button className="pager-btn" disabled={page===totalPages} onClick={() => setPage(totalPages)}>»</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--t3)' }}>Tip: Right-click any row to edit or delete</div>
      </div>

      {modal && <OrderModal order={modal !== 'new' ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />}
      {confirm && <ConfirmDialog title="Delete Order" msg={`Permanently delete order #${confirm.id}? This cannot be undone.`} onOk={handleDelete} onCancel={() => setConfirm(null)} />}
      {menu && (
        <ContextMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)} items={[
          { label: 'Edit order',   icon: <EditIco />,  fn: () => setModal(menu.row) },
          { divider: true },
          { label: 'Delete order', icon: <TrashIco />, fn: () => setConfirm(menu.row), danger: true },
        ]} />
      )}
    </div>
  );
}

const EditIco  = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z"/></svg>;
const TrashIco = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 3.5h10M4.5 3.5V2h4v1.5M3.5 3.5v8h6v-8"/></svg>;