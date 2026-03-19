const BASE = '/api';
async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}
export const api = {
  getOrders:        (p = {}) => req('/orders' + (Object.keys(p).length ? '?' + new URLSearchParams(p) : '')),
  createOrder:      (b)      => req('/orders',              { method: 'POST',  body: b }),
  updateOrder:      (id, b)  => req(`/orders/${id}`,        { method: 'PUT',   body: b }),
  deleteOrder:      (id)     => req(`/orders/${id}`,        { method: 'DELETE' }),
  getAnalytics:     ()       => req('/orders/analytics'),
  getStats:         ()       => req('/orders/stats'),
  bulkUpdateStatus: (ids, status) => req('/orders/bulk-status', { method: 'PATCH', body: { ids, status } }),
  exportOrders:     (p = {}) => {
    const qs = Object.keys(p).length ? '?' + new URLSearchParams(p) : '';
    return fetch(`${BASE}/orders/export${qs}`).then(r => r.blob());
  },
  getLayout:    () => req('/dashboard/layout'),
  saveLayout:   (b) => req('/dashboard/layout', { method: 'POST', body: b }),
};