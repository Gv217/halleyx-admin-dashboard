import { useState, useEffect } from 'react';
import { METRIC_FIELDS, AXIS_FIELDS, TABLE_COLS, CHART_COLORS } from '../../utils/constants';

export default function WidgetConfigPanel({ widget, onSave, onClose }) {
  const [cfg, setCfg] = useState({});
  useEffect(() => { if (widget) setCfg({ ...widget.config }); }, [widget]);
  if (!widget) return null;
  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));
  const t = widget.type;
  const isNumeric = METRIC_FIELDS.find(f => f.v === cfg.metric)?.num;

  const S = ({ title, children }) => (
    <div className="cfg-sec">
      <div className="cfg-sec-title">{title}</div>
      {children}
    </div>
  );
  const F = ({ label, opt, children }) => (
    <div className="field">
      <label className="flabel">{label}{!opt && <span className="req"> *</span>}</label>
      {children}
    </div>
  );
  const Num = ({ value, min = 1, max, onChange }) => (
    <div className="stepper">
      <button className="step-btn" type="button" onClick={() => onChange(Math.max(min, (parseInt(value) || min) - 1))}>−</button>
      <input className="input" type="number" value={value} min={min} max={max}
        onChange={e => onChange(Math.max(min, max ? Math.min(max, parseInt(e.target.value) || min) : parseInt(e.target.value) || min))} />
      <button className="step-btn" type="button" onClick={() => onChange(max ? Math.min(max, (parseInt(value) || min) + 1) : (parseInt(value) || min) + 1)}>+</button>
    </div>
  );

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(2px)' }} />
      <div className="cfg-panel">
        <div className="cfg-hd">
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>Widget Settings</div>
            <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 3, fontFamily: 'JetBrains Mono,monospace', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t}</div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>
          </button>
        </div>

        <div className="cfg-body">
          <S title="General">
            <F label="Widget title">
              <input className="input" value={cfg.title || ''} onChange={e => set('title', e.target.value)} placeholder="Untitled" />
            </F>
            <F label="Type"><input className="input" value={t} readOnly style={{ color: 'var(--t3)' }} /></F>
            <F label="Description" opt>
              <textarea className="textarea" value={cfg.description || ''} onChange={e => set('description', e.target.value)} placeholder="Optional" style={{ minHeight: 56 }} />
            </F>
          </S>

          <S title="Widget size">
            <div className="g2">
              <F label="Width (cols)"><Num value={cfg.width || 4}  min={1} max={12} onChange={v => set('width', v)} /></F>
              <F label="Height (rows)"><Num value={cfg.height || 4} min={1}        onChange={v => set('height', v)} /></F>
            </div>
          </S>

          {t === 'kpi' && (
            <S title="Data settings">
              <F label="Select metric">
                <select className="select" value={cfg.metric || ''} onChange={e => set('metric', e.target.value)}>
                  <option value="">Choose field</option>
                  {METRIC_FIELDS.map(f => <option key={f.v} value={f.v}>{f.l}</option>)}
                </select>
              </F>
              <F label="Aggregation">
                <select className="select" value={cfg.aggregation || 'Count'} onChange={e => set('aggregation', e.target.value)} disabled={!isNumeric}>
                  <option>Sum</option><option>Average</option><option>Count</option>
                </select>
                {cfg.metric && !isNumeric && <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 4 }}>Sum/Avg only for numeric fields</div>}
              </F>
              <div className="g2">
                <F label="Data format">
                  <select className="select" value={cfg.format || 'Number'} onChange={e => set('format', e.target.value)}>
                    <option>Number</option><option>Currency</option>
                  </select>
                </F>
                <F label="Decimal precision"><Num value={cfg.decimal_precision || 0} min={0} max={6} onChange={v => set('decimal_precision', v)} /></F>
              </div>
            </S>
          )}

          {['bar', 'line', 'area', 'scatter'].includes(t) && (
            <>
              <S title="Data settings">
                <F label="X-axis">
                  <select className="select" value={cfg.x_axis || ''} onChange={e => set('x_axis', e.target.value)}>
                    <option value="">Choose field</option>
                    {AXIS_FIELDS.map(f => <option key={f.v} value={f.v}>{f.l}</option>)}
                  </select>
                </F>
                <F label="Y-axis">
                  <select className="select" value={cfg.y_axis || ''} onChange={e => set('y_axis', e.target.value)}>
                    <option value="">Choose field</option>
                    {AXIS_FIELDS.map(f => <option key={f.v} value={f.v}>{f.l}</option>)}
                  </select>
                </F>
              </S>
              <S title="Styling">
                <F label="Chart color" opt>
                  <div className="color-row">
                    <div className="color-sw">
                      <div className="color-prev" style={{ background: cfg.color || '#4f8ef7' }} />
                      <input type="color" value={cfg.color || '#4f8ef7'} onChange={e => set('color', e.target.value)} />
                    </div>
                    <input className="input" value={cfg.color || '#4f8ef7'} onChange={e => set('color', e.target.value)} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                    {CHART_COLORS.map(c => (
                      <div key={c} onClick={() => set('color', c)} style={{ width: 20, height: 20, borderRadius: 4, background: c, cursor: 'pointer', border: cfg.color === c ? '2px solid var(--t1)' : '2px solid transparent', transition: 'border .1s' }} />
                    ))}
                  </div>
                </F>
                <label className="chk-row">
                  <input type="checkbox" checked={!!cfg.show_labels} onChange={e => set('show_labels', e.target.checked)} />
                  <span className="chk-lbl">Show data labels</span>
                </label>
              </S>
            </>
          )}

          {t === 'pie' && (
            <S title="Data settings">
              <F label="Chart data">
                <select className="select" value={cfg.data_field || ''} onChange={e => set('data_field', e.target.value)}>
                  <option value="">Choose field</option>
                  {AXIS_FIELDS.map(f => <option key={f.v} value={f.v}>{f.l}</option>)}
                </select>
              </F>
              <label className="chk-row">
                <input type="checkbox" checked={!!cfg.show_legend} onChange={e => set('show_legend', e.target.checked)} />
                <span className="chk-lbl">Show legend</span>
              </label>
            </S>
          )}

          {t === 'table' && (
            <>
              <S title="Data settings">
                <F label="Choose columns">
                  <div style={{ background: 'var(--input-bg)', border: '1px solid var(--bd2)', borderRadius: 6, padding: 10, display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 200, overflowY: 'auto' }}>
                    {TABLE_COLS.map(c => (
                      <label key={c.v} className="chk-row">
                        <input type="checkbox" checked={(cfg.columns || []).includes(c.v)}
                          onChange={e => {
                            const cur = cfg.columns || [];
                            set('columns', e.target.checked ? [...cur, c.v] : cur.filter(x => x !== c.v));
                          }} />
                        <span className="chk-lbl">{c.l}</span>
                      </label>
                    ))}
                  </div>
                </F>
                <div className="g2">
                  <F label="Sort by" opt>
                    <select className="select" value={cfg.sort_by || ''} onChange={e => set('sort_by', e.target.value)}>
                      <option value="">None</option><option>Ascending</option><option>Descending</option>
                    </select>
                  </F>
                  <F label="Rows/page" opt>
                    <select className="select" value={cfg.pagination || 5} onChange={e => set('pagination', e.target.value)}>
                      <option value={5}>5</option><option value={10}>10</option><option value={15}>15</option>
                    </select>
                  </F>
                </div>
              </S>
              <S title="Styling">
                <div className="g2">
                  <F label="Font size" opt><Num value={cfg.font_size || 14} min={12} max={18} onChange={v => set('font_size', v)} /></F>
                  <F label="Header color" opt>
                    <div className="color-row">
                      <div className="color-sw">
                        <div className="color-prev" style={{ background: cfg.header_color || '#54bd95' }} />
                        <input type="color" value={cfg.header_color || '#54bd95'} onChange={e => set('header_color', e.target.value)} />
                      </div>
                      <input className="input" value={cfg.header_color || '#54bd95'} onChange={e => set('header_color', e.target.value)} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }} />
                    </div>
                  </F>
                </div>
              </S>
            </>
          )}
        </div>

        <div className="cfg-ft">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave({ ...widget, config: cfg })}>Apply changes</button>
        </div>
      </div>
    </>
  );
}