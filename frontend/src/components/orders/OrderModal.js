import { useState, useEffect, useRef } from 'react';
import { COUNTRIES, PRODUCTS, STATUSES, AGENTS } from '../../utils/constants';
import { useToast } from '../../utils/toast';

const EMPTY = {
  first_name: '', last_name: '', email: '', phone: '',
  street_address: '', city: '', state: '', postal_code: '', country: 'United States',
  product: PRODUCTS[0], quantity: 1, unit_price: '89.99', status: 'Pending', created_by: AGENTS[0],
};

// ── Field wrapper (defined OUTSIDE the modal so React never remounts inputs) ──
function F({ k, label, req = true, errs, children }) {
  return (
    <div className="field">
      <label className="flabel">{label}{req && <span className="req"> *</span>}</label>
      {children}
      {errs[k] && <div className="ferr">⚠ {errs[k]}</div>}
    </div>
  );
}

export default function OrderModal({ order, onSave, onClose }) {
  const [form,      setForm]      = useState(EMPTY);
  const [errs,      setErrs]      = useState({});
  const [serverErr, setServerErr] = useState('');
  const [busy,      setBusy]      = useState(false);
  const toast = useToast();
  const bodyRef = useRef(null);
  const isEdit  = !!order;

  useEffect(() => {
    setErrs({}); setServerErr('');
    setForm(order ? {
      first_name:     order.first_name     || '',
      last_name:      order.last_name      || '',
      email:          order.email          || '',
      phone:          order.phone          || '',
      street_address: order.street_address || '',
      city:           order.city           || '',
      state:          order.state          || '',
      postal_code:    order.postal_code    || '',
      country:        order.country        || '',
      product:        order.product        || '',
      quantity:       order.quantity       || 1,
      unit_price:     order.unit_price     || '',
      status:         order.status         || 'Pending',
      created_by:     order.created_by     || '',
    } : EMPTY);
  }, [order]);

  const total = (parseFloat(form.quantity) || 0) * (parseFloat(form.unit_price) || 0);

  const upd = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrs(p  => ({ ...p, [k]: '' }));
    setServerErr('');
  };

  const validate = () => {
    const e = {};
    ['first_name','last_name','email','phone','street_address',
     'city','state','postal_code','country','product','status','created_by']
      .forEach(k => { if (!String(form[k] || '').trim()) e[k] = 'Please fill the field'; });
    if ((parseFloat(form.unit_price) || 0) <= 0) e.unit_price = 'Please fill the field';
    if ((parseInt(form.quantity)     || 0) <  1) e.quantity   = 'Minimum is 1';
    return e;
  };

  const submit = async () => {
    setServerErr('');
    const e = validate();
    if (Object.keys(e).length) {
      setErrs(e);
      const firstErr = Object.keys(e)[0];
      toast(`Please fill required fields: ${firstErr.replace('_',' ')}`, 'err');
      return;
    }
    setBusy(true);
    try {
      await onSave({
        first_name:     String(form.first_name).trim(),
        last_name:      String(form.last_name).trim(),
        email:          String(form.email).trim(),
        phone:          String(form.phone).trim(),
        street_address: String(form.street_address).trim(),
        city:           String(form.city).trim(),
        state:          String(form.state).trim(),
        postal_code:    String(form.postal_code).trim(),
        country:        String(form.country).trim(),
        product:        String(form.product).trim(),
        quantity:       parseInt(form.quantity)   || 1,
        unit_price:     parseFloat(form.unit_price) || 0,
        total_amount:   parseFloat(total.toFixed(2)),
        status:         String(form.status).trim(),
        created_by:     String(form.created_by).trim(),
      });
    } catch (err) {
      setServerErr(err.message || 'Failed to save. Is the backend running?');
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
    } finally {
      setBusy(false);
    }
  };



  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-hd">
          <div>
            <div className="modal-title">{isEdit ? 'Edit Order' : 'Create New Order'}</div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
              {isEdit ? `Order #${order.id}` : 'All fields marked * are required'}
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M2 2l11 11M13 2L2 13"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" ref={bodyRef}>

          {/* Server error */}
          {serverErr && (
            <div className="err-banner">
              <span style={{ flexShrink: 0 }}>⚠</span>
              <span>{serverErr}</span>
            </div>
          )}

          {/* Customer Information */}
          <div className="form-sec">
            <div className="sec-title">Customer Information</div>
            <div className="g2">
              <F k="first_name" label="First name" errs={errs}>
                <input className={`input${errs.first_name ? ' err' : ''}`} value={form.first_name}
                  onChange={e => upd('first_name', e.target.value)} placeholder="John" autoFocus />
              </F>
              <F k="last_name" label="Last name" errs={errs}>
                <input className={`input${errs.last_name ? ' err' : ''}`} value={form.last_name}
                  onChange={e => upd('last_name', e.target.value)} placeholder="Doe" />
              </F>
            </div>
            <div className="g2">
              <F k="email" label="Email id" errs={errs}>
                <input type="email" className={`input${errs.email ? ' err' : ''}`} value={form.email}
                  onChange={e => upd('email', e.target.value)} placeholder="john@example.com" />
              </F>
              <F k="phone" label="Phone number" errs={errs}>
                <input className={`input${errs.phone ? ' err' : ''}`} value={form.phone}
                  onChange={e => upd('phone', e.target.value)} placeholder="+1 555 000 0000" />
              </F>
            </div>
            <F k="street_address" label="Street address" errs={errs}>
              <input className={`input${errs.street_address ? ' err' : ''}`} value={form.street_address}
                onChange={e => upd('street_address', e.target.value)} placeholder="123 Main Street" />
            </F>
            <div className="g3">
              <F k="city" label="City" errs={errs}>
                <input className={`input${errs.city ? ' err' : ''}`} value={form.city}
                  onChange={e => upd('city', e.target.value)} placeholder="City" />
              </F>
              <F k="state" label="State / Province" errs={errs}>
                <input className={`input${errs.state ? ' err' : ''}`} value={form.state}
                  onChange={e => upd('state', e.target.value)} placeholder="State" />
              </F>
              <F k="postal_code" label="Postal code" errs={errs}>
                <input className={`input${errs.postal_code ? ' err' : ''}`} value={form.postal_code}
                  onChange={e => upd('postal_code', e.target.value)} placeholder="000000" />
              </F>
            </div>
            <F k="country" label="Country" errs={errs}>
              <select className={`select${errs.country ? ' err' : ''}`} value={form.country}
                onChange={e => upd('country', e.target.value)}>
                <option value="">Select country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </F>
          </div>

          {/* Order Information */}
          <div className="form-sec">
            <div className="sec-title">Order Information</div>
            <F k="product" label="Choose product" errs={errs}>
              <select className={`select${errs.product ? ' err' : ''}`} value={form.product}
                onChange={e => upd('product', e.target.value)}>
                <option value="">Select product</option>
                {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </F>
            <div className="g3">
              {/* Quantity */}
              <div className="field">
                <label className="flabel">Quantity <span className="req">*</span></label>
                <div className="stepper">
                  <button className="step-btn" type="button"
                    onClick={() => upd('quantity', Math.max(1, (parseInt(form.quantity) || 1) - 1))}>−</button>
                  <input className="input" type="number" min="1" value={form.quantity}
                    onChange={e => upd('quantity', Math.max(1, parseInt(e.target.value) || 1))} />
                  <button className="step-btn" type="button"
                    onClick={() => upd('quantity', (parseInt(form.quantity) || 1) + 1)}>+</button>
                </div>
                {errs.quantity && <div className="ferr">⚠ {errs.quantity}</div>}
              </div>
              {/* Unit price */}
              <F k="unit_price" label="Unit price" errs={errs}>
                <div className="pfx-wrap">
                  <span className="pfx">$</span>
                  <input type="number" step="0.01" min="0"
                    className={`input pfx-inp${errs.unit_price ? ' err' : ''}`}
                    value={form.unit_price}
                    onChange={e => upd('unit_price', e.target.value)}
                    placeholder="0.00" />
                </div>
              </F>
              {/* Total */}
              <div className="field">
                <label className="flabel">Total amount</label>
                <div className="pfx-wrap">
                  <span className="pfx" style={{ color: 'var(--accent-hi)' }}>$</span>
                  <input className="input pfx-inp" readOnly value={total.toFixed(2)}
                    style={{ color: 'var(--accent-hi)', fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, background: 'var(--bg0)', cursor: 'default' }} />
                </div>
              </div>
            </div>
            <div className="g2">
              <F k="status" label="Status" errs={errs}>
                <select className="select" value={form.status} onChange={e => upd('status', e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </F>
              <F k="created_by" label="Created by" errs={errs}>
                <select className={`select${errs.created_by ? ' err' : ''}`} value={form.created_by}
                  onChange={e => upd('created_by', e.target.value)}>
                  <option value="">Select agent</option>
                  {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </F>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-ft">
          <button className="btn btn-ghost" onClick={onClose} disabled={busy}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={busy} style={{ minWidth: 130 }}>
            {busy
              ? <><span className="spin" style={{ width: 14, height: 14 }} /> Saving…</>
              : isEdit ? 'Save changes' : 'Create order'
            }
          </button>
        </div>
      </div>
    </div>
  );
}