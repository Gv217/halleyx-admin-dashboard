import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  ScatterChart, Scatter, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS, STATUS_CLS, TABLE_COLS } from '../../utils/constants';

const TT = {
  contentStyle: {
    background: 'var(--bg3)', border: '1px solid var(--bd2)',
    borderRadius: 8, fontSize: 12, color: 'var(--t1)',
  },
  cursor: { fill: 'rgba(255,255,255,.03)' },
};

function agg(rows, xf, yf) {
  const m = {};
  rows.forEach(r => {
    const k = String(r[xf] || 'Unknown').slice(0, 20);
    if (!m[k]) m[k] = { name: k, value: 0 };
    m[k].value += parseFloat(r[yf]) || 0;
  });
  return Object.values(m).slice(0, 12);
}

/* ── KPI ─────────────────────────────────── */
export function KpiWidget({ config = {}, orders = [] }) {
  const { metric = 'total_amount', aggregation = 'Count', format = 'Number', decimal_precision = 0 } = config;
  const vals = orders.map(r => parseFloat(r[metric]) || 0).filter(v => !isNaN(v));
  let val = 0;
  if (aggregation === 'Sum')     val = vals.reduce((s, v) => s + v, 0);
  else if (aggregation === 'Average') val = vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
  else val = orders.length;

  const dp = parseInt(decimal_precision) || 0;
  const display = format === 'Currency'
    ? `$${val.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })}`
    : val.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
        {aggregation} · {orders.length} records
      </div>
      <div style={{ fontSize: 'clamp(22px,3.5vw,40px)', fontWeight: 800, color: 'var(--accent-hi)', lineHeight: 1, letterSpacing: -1 }}>
        {display}
      </div>
      <div style={{ fontSize: 11, color: 'var(--t2)' }}>
        {String(metric).replace(/_/g, ' ')}
      </div>
    </div>
  );
}

/* ── BAR ─────────────────────────────────── */
export function BarWidget({ config = {}, orders = [] }) {
  const { x_axis = 'product', y_axis = 'total_amount', color = '#4f8ef7', show_labels = false } = config;
  const data = agg(orders, x_axis, y_axis);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 6, right: 8, left: -10, bottom: 36 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="var(--bd1)" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--t3)' }} angle={-25} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: 'var(--t3)' }} axisLine={false} tickLine={false} />
        <Tooltip {...TT} />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]}
          label={show_labels ? { position: 'top', fontSize: 10, fill: 'var(--t2)' } : false} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── LINE ────────────────────────────────── */
export function LineWidget({ config = {}, orders = [] }) {
  const { x_axis = 'product', y_axis = 'total_amount', color = '#4f8ef7', show_labels = false } = config;
  const data = agg(orders, x_axis, y_axis);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 6, right: 8, left: -10, bottom: 36 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="var(--bd1)" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--t3)' }} angle={-25} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: 'var(--t3)' }} axisLine={false} tickLine={false} />
        <Tooltip {...TT} />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5}
          dot={{ fill: color, r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }}
          label={show_labels ? { fontSize: 10, fill: 'var(--t2)' } : false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ── AREA ────────────────────────────────── */
export function AreaWidget({ config = {}, orders = [] }) {
  const { x_axis = 'product', y_axis = 'total_amount', color = '#4f8ef7' } = config;
  const data = agg(orders, x_axis, y_axis);
  const gid = `ag${color.replace('#', '')}`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 6, right: 8, left: -10, bottom: 36 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 4" stroke="var(--bd1)" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--t3)' }} angle={-25} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: 'var(--t3)' }} axisLine={false} tickLine={false} />
        <Tooltip {...TT} />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill={`url(#${gid})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ── SCATTER ─────────────────────────────── */
export function ScatterWidget({ config = {}, orders = [] }) {
  const { x_axis = 'quantity', y_axis = 'total_amount', color = '#4f8ef7' } = config;
  const data = orders.map(r => ({ x: parseFloat(r[x_axis]) || 0, y: parseFloat(r[y_axis]) || 0 }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 6, right: 8, left: -10, bottom: 8 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="var(--bd1)" />
        <XAxis type="number" dataKey="x" tick={{ fontSize: 10, fill: 'var(--t3)' }} axisLine={false} tickLine={false}
          label={{ value: (x_axis || '').replace(/_/g, ' '), position: 'insideBottom', offset: -2, fontSize: 10, fill: 'var(--t3)' }} />
        <YAxis type="number" dataKey="y" tick={{ fontSize: 10, fill: 'var(--t3)' }} axisLine={false} tickLine={false} />
        <Tooltip {...TT} />
        <Scatter data={data} fill={color} opacity={0.75} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

/* ── PIE ─────────────────────────────────── */
export function PieWidget({ config = {}, orders = [] }) {
  const { data_field = 'status', show_legend = true } = config;
  const map = {};
  orders.forEach(r => { const k = r[data_field] || 'Unknown'; map[k] = (map[k] || 0) + 1; });
  const data = Object.entries(map).map(([name, value]) => ({ name, value }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius="28%" outerRadius="65%"
          dataKey="value" paddingAngle={2}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          labelLine={false} fontSize={11}>
          {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
        </Pie>
        <Tooltip {...TT} />
        {show_legend && <Legend wrapperStyle={{ fontSize: 11, color: 'var(--t2)' }} />}
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ── TABLE ───────────────────────────────── */
export function TableWidget({ config = {}, orders = [] }) {
  const {
    columns = ['customer_name', 'product', 'total_amount', 'status'],
    sort_by = '', pagination = 5,
    font_size = 14, header_color = '#54bd95',
  } = config;
  const [pg, setPg] = useState(1);
  const pp = parseInt(pagination) || 5;

  let rows = [...orders];
  if (sort_by === 'Ascending')  rows.sort((a, b) => new Date(a.order_date) - new Date(b.order_date));
  if (sort_by === 'Descending') rows.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

  const tp = Math.max(1, Math.ceil(rows.length / pp));
  const pr = rows.slice((pg - 1) * pp, pg * pp);
  const lbl = Object.fromEntries(TABLE_COLS.map(c => [c.v, c.l]));
  const fmt = v => `$${(parseFloat(v) || 0).toFixed(2)}`;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: font_size - 1 }}>
          <thead>
            <tr>
              {columns.map(c => (
                <th key={c} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#fff', background: header_color, whiteSpace: 'nowrap', position: 'sticky', top: 0 }}>
                  {lbl[c] || c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pr.map((r, i) => (
              <tr key={i} style={{ background: i % 2 ? 'var(--bg-hover)' : 'transparent' }}>
                {columns.map(c => (
                  <td key={c} style={{ padding: '6px 10px', borderBottom: '1px solid var(--bd1)', fontSize: font_size - 2, color: 'var(--t2)', whiteSpace: 'nowrap', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c === 'status'
                      ? <span className={`badge ${STATUS_CLS[r[c]] || ''}`}>{r[c]}</span>
                      : c === 'total_amount' || c === 'unit_price' ? fmt(r[c])
                      : r[c] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tp > 1 && (
        <div style={{ padding: '5px 10px', borderTop: '1px solid var(--bd1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'JetBrains Mono,monospace' }}>{pg}/{tp}</span>
          <div style={{ display: 'flex', gap: 3 }}>
            <button className="pager-btn" disabled={pg === 1}  onClick={() => setPg(p => p - 1)} style={{ width: 22, height: 22 }}>‹</button>
            <button className="pager-btn" disabled={pg === tp} onClick={() => setPg(p => p + 1)} style={{ width: 22, height: 22 }}>›</button>
          </div>
        </div>
      )}
    </div>
  );
}