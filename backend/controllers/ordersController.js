const db = require('../config/database');
const s = v => String(v ?? '').trim();
const n = v => parseFloat(v) || 0;
const i = v => parseInt(v, 10) || 0;

exports.list = async (req, res) => {
  try {
    let sql = 'SELECT * FROM customer_orders WHERE 1=1';
    const p = [];
    if (req.query.search) {
      const q = `%${req.query.search}%`;
      sql += ' AND (customer_name LIKE ? OR email LIKE ? OR product LIKE ? OR CAST(id AS CHAR) LIKE ?)';
      p.push(q, q, q, q);
    }
    if (req.query.status) { sql += ' AND status=?'; p.push(req.query.status); }
    if (req.query.date_filter && req.query.date_filter !== 'all') {
      const now = new Date(), days = {today:0,'7d':7,'30d':30,'90d':90}[req.query.date_filter];
      const from = new Date(now);
      if (days === 0) from.setHours(0,0,0,0); else from.setDate(now.getDate() - days);
      sql += ' AND order_date >= ?'; p.push(from);
    }
    sql += ' ORDER BY order_date DESC';
    const [rows] = await db.execute(sql, p);
    res.json(rows);
  } catch (e) { console.error('[list]', e); res.status(500).json({ message: e.message }); }
};

exports.analytics = async (req, res) => {
  try {
    const [[sum]] = await db.execute(`SELECT COUNT(*) total, COALESCE(SUM(total_amount),0) revenue,
      SUM(status='Pending') pending, SUM(status='In progress') in_progress, SUM(status='Completed') completed
      FROM customer_orders`);
    const [byProduct] = await db.execute(`SELECT product, COUNT(*) cnt, SUM(total_amount) revenue FROM customer_orders GROUP BY product ORDER BY cnt DESC`);
    const [byStatus]  = await db.execute(`SELECT status, COUNT(*) cnt FROM customer_orders GROUP BY status`);
    const [byAgent]   = await db.execute(`SELECT created_by, COUNT(*) cnt, SUM(total_amount) revenue FROM customer_orders GROUP BY created_by`);
    res.json({ summary: sum, byProduct, byStatus, byAgent });
  } catch (e) { console.error('[analytics]', e); res.status(500).json({ message: e.message }); }
};

exports.get = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM customer_orders WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const b = req.body || {};
    const first_name = s(b.first_name), last_name = s(b.last_name),
          email = s(b.email), phone = s(b.phone),
          street_address = s(b.street_address), city = s(b.city),
          state = s(b.state), postal_code = s(b.postal_code), country = s(b.country),
          product = s(b.product), status = s(b.status) || 'Pending',
          created_by = s(b.created_by);
    const qty = Math.max(1, i(b.quantity) || 1);
    const price = n(b.unit_price);
    const total = parseFloat((qty * price).toFixed(2));
    const cname = `${first_name} ${last_name}`;

    const bad = [];
    if (!first_name) bad.push('first_name'); if (!last_name) bad.push('last_name');
    if (!email) bad.push('email'); if (!phone) bad.push('phone');
    if (!street_address) bad.push('street_address'); if (!city) bad.push('city');
    if (!state) bad.push('state'); if (!postal_code) bad.push('postal_code');
    if (!country) bad.push('country'); if (!product) bad.push('product');
    if (!price) bad.push('unit_price'); if (!created_by) bad.push('created_by');
    if (bad.length) return res.status(400).json({ message: `Missing fields: ${bad.join(', ')}` });

    const [r] = await db.execute(
      `INSERT INTO customer_orders (first_name,last_name,customer_name,email,phone,street_address,city,state,postal_code,country,product,quantity,unit_price,total_amount,status,created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [first_name,last_name,cname,email,phone,street_address,city,state,postal_code,country,product,qty,price,total,status,created_by]
    );
    console.log(`✅ Created order id=${r.insertId}: ${cname} | ${product}`);
    const [[row]] = await db.execute('SELECT * FROM customer_orders WHERE id=?', [r.insertId]);
    res.status(201).json(row);
  } catch (e) { console.error('[create]', e); res.status(500).json({ message: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const b = req.body || {}, id = req.params.id;
    const [ex] = await db.execute('SELECT id FROM customer_orders WHERE id=?', [id]);
    if (!ex.length) return res.status(404).json({ message: 'Not found' });
    const first_name = s(b.first_name), last_name = s(b.last_name);
    const qty = Math.max(1, i(b.quantity) || 1), price = n(b.unit_price);
    const total = parseFloat((qty * price).toFixed(2));
    await db.execute(
      `UPDATE customer_orders SET first_name=?,last_name=?,customer_name=?,email=?,phone=?,street_address=?,city=?,state=?,postal_code=?,country=?,product=?,quantity=?,unit_price=?,total_amount=?,status=?,created_by=? WHERE id=?`,
      [first_name,last_name,`${first_name} ${last_name}`,s(b.email),s(b.phone),s(b.street_address),s(b.city),s(b.state),s(b.postal_code),s(b.country),s(b.product),qty,price,total,s(b.status),s(b.created_by),id]
    );
    const [[row]] = await db.execute('SELECT * FROM customer_orders WHERE id=?', [id]);
    res.json(row);
  } catch (e) { console.error('[update]', e); res.status(500).json({ message: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const [ex] = await db.execute('SELECT id FROM customer_orders WHERE id=?', [req.params.id]);
    if (!ex.length) return res.status(404).json({ message: 'Not found' });
    await db.execute('DELETE FROM customer_orders WHERE id=?', [req.params.id]);
    res.json({ message: 'Deleted', id: parseInt(req.params.id) });
  } catch (e) { console.error('[remove]', e); res.status(500).json({ message: e.message }); }
};