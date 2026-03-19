import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../utils/api';
import { STATUS_CLS, STATUSES, DATE_FILTERS } from '../utils/constants';
import OrderModal from '../components/orders/OrderModal';
import ContextMenu from '../components/common/ContextMenu';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Topbar from '../components/common/Topbar';
import { useToast } from '../utils/toast';

const PER = 10;

// ── Sort helpers ─────────────────────────────────────────────────────────────
const SORT_FIELDS = {
  id:           (a, b) => a.id - b.id,
  customer:     (a, b) => (a.customer_name || '').localeCompare(b.customer_name || ''),
  product:      (a, b) => (a.product || '').localeCompare(b.product || ''),
  qty:          (a, b) => a.quantity - b.quantity,
  unit_price:   (a, b) => a.unit_price - b.unit_price,
  total:        (a, b) => a.total_amount - b.total_amount,
  status:       (a, b) => (a.status || '').localeCompare(b.status || ''),
  order_date:   (a, b) => new Date(a.order_date) - new Date(b.order_date),
  created_by:   (a, b) => (a.created_by || '').localeCompare(b.created_by || ''),
};

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <span style={{ opacity: 0.25, marginLeft: 4 }}>⇅</span>;
  return <span style={{ marginLeft: 4, color: 'var(--accent)' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

// ── Order Detail Drawer ───────────────────────────────────────────────────────
function OrderDrawer({ order, onClose, onEdit, onDelete }) {
  const drawerRef = useRef(null);
  useEffect(() => {
    const h = (e) => { if (drawerRef.current && !drawerRef.current.contains(e.target)) onClose(); };
    setTimeout(() => document.addEventListener('mousedown', h), 50);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  if (!order) return null;
  const fmt  = v  => `$${(parseFloat(v) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtd = dt => dt ? new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
  const name = order.customer_name || `${order.first_name || ''} ${order.last_name || ''}`.trim();

  const Row = ({ label, value, mono }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--bd0)', gap: 12 }}>
      <span style={{ fontSize: 11, color: 'var(--t3)', whiteSpace: 'nowrap', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12, color: 'var(--t1)', textAlign: 'right', fontFamily: mono ? 'JetBrains Mono,monospace' : undefined }}>{value || '—'}</span>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, pointerEvents: 'none' }}>
      {/* backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', pointerEvents: 'all' }} onClick={onClose} />
      {/* panel */}
      <div ref={drawerRef} style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 380,
        background: 'var(--bg1)', borderLeft: '1px solid var(--bd1)',
        display: 'flex', flexDirection: 'column', overflowY: 'auto',
        pointerEvents: 'all',
        animation: 'slideInRight 0.22s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Drawer Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--bd1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg0)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--t1)' }}>Order #{order.id}</div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2, fontFamily: 'JetBrains Mono,monospace' }}>{fmtd(order.order_date)}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className={`badge ${STATUS_CLS[order.status] || ''}`}>{order.status}</span>
            <button className="btn btn-ghost btn-icon" onClick={onClose} title="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {/* Customer */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)', marginBottom: 4 }}>Customer</div>
            <Row label="Name"  value={name} />
            <Row label="Email" value={order.email} />
            <Row label="Phone" value={order.phone} />
          </div>
          {/* Shipping Address */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)', marginBottom: 4 }}>Shipping Address</div>
            <Row label="Street"  value={order.street_address} />
            <Row label="City"    value={order.city} />
            <Row label="State"   value={order.state} />
            <Row label="Postal"  value={order.postal_code} />
            <Row label="Country" value={order.country} />
          </div>
          {/* Order */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)', marginBottom: 4 }}>Order Details</div>
            <Row label="Product"    value={order.product} />
            <Row label="Quantity"   value={order.quantity} mono />
            <Row label="Unit Price" value={fmt(order.unit_price)} mono />
            <Row label="Agent"      value={order.created_by} />
          </div>
          {/* Pricing Summary */}
          <div style={{ margin: '20px 0', background: 'var(--bg0)', border: '1px solid var(--bd1)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t3)', marginBottom: 8 }}>
              <span>{order.quantity} × {fmt(order.unit_price)}</span>
              <span>Subtotal</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, fontSize: 20, color: 'var(--cyan)' }}>{fmt(order.total_amount)}</span>
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>Total</span>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--bd1)', display: 'flex', gap: 8, background: 'var(--bg0)' }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onEdit(order)}>
            <svg width="12" height="12" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z"/></svg>
            Edit Order
          </button>
          <button className="btn btn-ghost" style={{ flex: 1, color: 'var(--red)' }} onClick={() => onDelete(order)}>
            <svg width="12" height="12" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 3.5h10M4.5 3.5V2h4v1.5M3.5 3.5v8h6v-8"/></svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OrdersPage({ onMenuClick }) {
  const [rows,       setRows]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const [sf,         setSf]         = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [page,       setPage]       = useState(1);
  const [modal,      setModal]      = useState(null);
  const [confirm,    setConfirm]    = useState(null);
  const [menu,       setMenu]       = useState(null);
  const [selected,   setSelected]   = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState('');
  const [exporting,  setExporting]  = useState(false);
  const [sortCol,    setSortCol]    = useState('order_date');
  const [sortDir,    setSortDir]    = useState('desc');
  const [drawer,     setDrawer]     = useState(null);
  const toast = useToast();

  const load = useCallback(async () => {
    setLoading(true); setError(''); setSelected(new Set());
    try {
      const p = {};
      if (search.trim()) p.search = search.trim();
      if (sf) p.status = sf;
      if (dateFilter !== 'all') p.date_filter = dateFilter;
      const d = await api.getOrders(p);
      setRows(Array.isArray(d) ? d : []);
    } catch (e) {
      setError(e.message);
      setRows([]);
    } finally { setLoading(false); }
  }, [search, sf, dateFilter]);

  useEffect(() => { load(); setPage(1); }, [load]);
  useEffect(() => {
    const h = () => setMenu(null);
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  // Sort
  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
    setPage(1);
  };

  // Filter + sort
  const filtered = rows
    .filter(r => {
      const sv = search.toLowerCase();
      const nm = (r.customer_name || `${r.first_name || ''} ${r.last_name || ''}`).toLowerCase();
      return (!sv || nm.includes(sv) || (r.email || '').toLowerCase().includes(sv) || String(r.id).includes(sv))
          && (!sf || r.status === sf);
    })
    .sort((a, b) => {
      const fn = SORT_FIELDS[sortCol] || SORT_FIELDS.order_date;
      return sortDir === 'asc' ? fn(a, b) : fn(b, a);
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

  // ── Bulk select helpers ───────────────────────────────────────────────────
  const allPageSelected = pageRows.length > 0 && pageRows.every(r => selected.has(r.id));
  const someSelected    = selected.size > 0;

  const toggleRow = (id) => setSelected(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const togglePage = () => {
    if (allPageSelected) {
      setSelected(prev => { const n = new Set(prev); pageRows.forEach(r => n.delete(r.id)); return n; });
    } else {
      setSelected(prev => { const n = new Set(prev); pageRows.forEach(r => n.add(r.id)); return n; });
    }
  };

  // ── Bulk status update ────────────────────────────────────────────────────
  const handleBulkStatus = async () => {
    if (!bulkStatus || selected.size === 0) return;
    try {
      const res = await api.bulkUpdateStatus([...selected], bulkStatus);
      toast(`${res.affectedRows} orders updated to "${bulkStatus}"`, 'ok');
      setSelected(new Set()); setBulkStatus('');
      load();
    } catch (e) { toast(e.message, 'err'); }
  };

  // ── CSV Export ────────────────────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true);
    try {
      const p = {};
      if (search.trim()) p.search = search.trim();
      if (sf) p.status = sf;
      if (dateFilter !== 'all') p.date_filter = dateFilter;
      const blob = await api.exportOrders(p);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      const now  = new Date();
      a.href = url;
      a.download = `orders_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}.csv`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      toast('CSV exported successfully', 'ok');
    } catch (e) { toast(e.message, 'err'); }
    finally { setExporting(false); }
  };

  // ── Save / Delete ─────────────────────────────────────────────────────────
  const handleSave = async (data) => {
    try {
      if (modal !== 'new') {
        await api.updateOrder(modal.id, data);
        toast('Order updated', 'ok');
      } else {
        await api.createOrder(data);
        toast('Order created successfully', 'ok');
      }
      setModal(null); setDrawer(null); setPage(1);
      load();
    } catch (e) {
      toast(e.message, 'err');
      throw e; // Bubble up to OrderModal to keep it open and show server error
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteOrder(confirm.id);
      toast('Order deleted', 'ok');
      setConfirm(null); setDrawer(null); load();
    } catch (e) { toast(e.message, 'err'); }
  };

  // ── Sortable TH ──────────────────────────────────────────────────────────
  const TH = ({ col, children, style = {} }) => (
    <th onClick={() => col && toggleSort(col)}
        style={{ cursor: col ? 'pointer' : 'default', userSelect: 'none', ...style }}>
      {children}
      {col && <SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />}
    </th>
  );

  return (
    <div className="page">
      <Topbar
        title="Customer Orders"
        subtitle={loading ? 'Loading…' : `${filtered.length} record${filtered.length !== 1 ? 's' : ''}`}
        onMenuClick={onMenuClick}
        actions={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn btn-ghost btn-sm" onClick={handleExport} disabled={exporting} title="Export filtered orders as CSV">
              {exporting
                ? <><span className="spin" style={{ width: 12, height: 12 }}/> Exporting…</>
                : <><svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M7 1v8M4 6l3 3 3-3M2 10.5v1A1.5 1.5 0 003.5 13h7a1.5 1.5 0 001.5-1.5v-1"/></svg> Export CSV</>
              }
            </button>
            <button className="btn btn-primary" onClick={() => setModal('new')}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 1v10M1 6h10"/></svg>
              Create Order
            </button>
          </div>
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

        {/* Bulk Action Toolbar */}
        {someSelected && (
          <div style={{
            background: 'var(--accent-dim)', border: '1px solid var(--accent)',
            borderRadius: 8, padding: '8px 14px', marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            animation: 'fadeIn 0.15s ease',
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', minWidth: 0 }}>
              {selected.size} selected
            </span>
            <select className="select" style={{ width: 160, fontSize: 12, padding: '4px 8px' }}
              value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}>
              <option value="">Change status…</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" disabled={!bulkStatus} onClick={handleBulkStatus}>Apply</button>
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => { setSelected(new Set()); setBulkStatus(''); }}>
              ✕ Clear selection
            </button>
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
            <select className="select" style={{ width: 140 }} value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }}>
              {DATE_FILTERS.map(f => <option key={f.v} value={f.v}>{f.l}</option>)}
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
                  {[24, 80, 160, 180, 50, 80, 80, 90, 80].map((w, j) => (
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
              <div className="empty-title">{search || sf || dateFilter !== 'all' ? 'No matching orders' : 'No orders yet'}</div>
              <div className="empty-desc">{search || sf || dateFilter !== 'all' ? 'Try adjusting your search or filter.' : 'Click "Create Order" to add your first order.'}</div>
              {!search && !sf && dateFilter === 'all' && <button className="btn btn-primary" onClick={() => setModal('new')}>Create Order</button>}
            </div>
          ) : (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: 36, paddingRight: 4 }}>
                      <input type="checkbox" checked={allPageSelected}
                        onChange={togglePage}
                        onClick={e => e.stopPropagation()}
                        style={{ cursor: 'pointer', accentColor: 'var(--accent)' }} />
                    </th>
                    <TH col="id">ID</TH>
                    <TH col="customer">Customer</TH>
                    <TH col="product">Product</TH>
                    <TH col="qty">Qty</TH>
                    <TH col="unit_price">Unit Price</TH>
                    <TH col="total">Total</TH>
                    <TH col="status">Status</TH>
                    <TH col="order_date">Date</TH>
                    <TH col="created_by">Agent</TH>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map(r => (
                    <tr key={r.id}
                      className={selected.has(r.id) ? 'row-selected' : ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setDrawer(r)}
                      onContextMenu={e => { e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY, row: r }); }}>
                      <td style={{ paddingRight: 4 }} onClick={e => { e.stopPropagation(); toggleRow(r.id); }}>
                        <input type="checkbox" checked={selected.has(r.id)} onChange={() => {}} onClick={e => e.stopPropagation()}
                          style={{ cursor: 'pointer', accentColor: 'var(--accent)' }} />
                      </td>
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

        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--t3)' }}>
          Tip: Click any row to view details · Right-click to edit or delete · Use checkboxes for bulk actions
        </div>
      </div>

      {/* Modals / Overlays */}
      {modal && <OrderModal order={modal !== 'new' ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />}
      {confirm && <ConfirmDialog title="Delete Order" msg={`Permanently delete order #${confirm.id}? This cannot be undone.`} onOk={handleDelete} onCancel={() => setConfirm(null)} />}
      {menu && (
        <ContextMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)} items={[
          { label: 'View details', icon: <EyeIco />,  fn: () => setDrawer(menu.row) },
          { label: 'Edit order',   icon: <EditIco />, fn: () => setModal(menu.row) },
          { divider: true },
          { label: 'Delete order', icon: <TrashIco />, fn: () => setConfirm(menu.row), danger: true },
        ]} />
      )}
      {drawer && (
        <OrderDrawer
          order={drawer}
          onClose={() => setDrawer(null)}
          onEdit={o => { setDrawer(null); setModal(o); }}
          onDelete={o => { setDrawer(null); setConfirm(o); }}
        />
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        tr.row-selected td { background: var(--accent-dim) !important; }
        tr.row-selected:hover td { filter: brightness(1.05); }
      `}</style>
    </div>
  );
}

const EyeIco   = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 6.5S3 2.5 6.5 2.5 12 6.5 12 6.5 10 10.5 6.5 10.5 1 6.5 1 6.5z"/><circle cx="6.5" cy="6.5" r="1.5"/></svg>;
const EditIco  = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z"/></svg>;
const TrashIco = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 3.5h10M4.5 3.5V2h4v1.5M3.5 3.5v8h6v-8"/></svg>;