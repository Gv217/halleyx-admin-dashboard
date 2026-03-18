const fs   = require('fs');
const path = require('path');

const DATA_DIR    = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const LAYOUT_FILE = path.join(DATA_DIR, 'layout.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── helpers ──────────────────────────────
function readJSON(file, fallback) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (_) {}
  return fallback;
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// ── default seed orders ───────────────────
const SEED_ORDERS = [
  { id:1,  first_name:'Alice',   last_name:'Johnson',  customer_name:'Alice Johnson',  email:'alice.j@example.com',    phone:'+1 512-555-0101', street_address:'123 Oak Street',       city:'Austin',        state:'TX',  postal_code:'78701',   country:'United States', product:'Fiber Internet 1 Gbps',       quantity:1, unit_price:89.99,  total_amount:89.99,  status:'Completed',   created_by:'Mr. Michael Harris', order_date:'2025-08-10T09:00:00.000Z' },
  { id:2,  first_name:'Bob',     last_name:'Smith',    customer_name:'Bob Smith',      email:'bob.smith@example.com',   phone:'+1 206-555-0102', street_address:'456 Pine Avenue',      city:'Seattle',       state:'WA',  postal_code:'98101',   country:'United States', product:'5G Unlimited Mobile Plan',    quantity:2, unit_price:49.99,  total_amount:99.98,  status:'Pending',     created_by:'Mr. Ryan Cooper',    order_date:'2025-08-15T11:30:00.000Z' },
  { id:3,  first_name:'Carol',   last_name:'White',    customer_name:'Carol White',    email:'carol.w@example.com',     phone:'+1 416-555-0103', street_address:'789 Elm Road',         city:'Toronto',       state:'ON',  postal_code:'M5V 2T6', country:'Canada',        product:'Business Internet 500 Mbps',  quantity:1, unit_price:149.99, total_amount:149.99, status:'In progress', created_by:'Ms. Olivia Carter',  order_date:'2025-09-01T14:00:00.000Z' },
  { id:4,  first_name:'David',   last_name:'Lee',      customer_name:'David Lee',      email:'david.lee@example.com',   phone:'+65 9123-4567',   street_address:'21 Orchard Road',      city:'Singapore',     state:'SG',  postal_code:'238820',  country:'Singapore',     product:'VoIP Corporate Package',      quantity:3, unit_price:79.99,  total_amount:239.97, status:'Completed',   created_by:'Mr. Lucas Martin',   order_date:'2025-09-05T08:45:00.000Z' },
  { id:5,  first_name:'Eva',     last_name:'Chen',     customer_name:'Eva Chen',       email:'eva.chen@example.com',    phone:'+61 2-5550-0105', street_address:'654 Cedar Lane',       city:'Sydney',        state:'NSW', postal_code:'2000',    country:'Australia',     product:'Fiber Internet 300 Mbps',     quantity:1, unit_price:59.99,  total_amount:59.99,  status:'Pending',     created_by:'Mr. Michael Harris', order_date:'2025-09-12T16:20:00.000Z' },
  { id:6,  first_name:'Frank',   last_name:'Brown',    customer_name:'Frank Brown',    email:'frank.b@example.com',     phone:'+1 604-555-0106', street_address:'321 Maple Drive',      city:'Vancouver',     state:'BC',  postal_code:'V6B 1A1', country:'Canada',        product:'Fiber Internet 1 Gbps',       quantity:2, unit_price:89.99,  total_amount:179.98, status:'Completed',   created_by:'Mr. Ryan Cooper',    order_date:'2025-09-20T10:00:00.000Z' },
  { id:7,  first_name:'Grace',   last_name:'Kim',      customer_name:'Grace Kim',      email:'grace.kim@example.com',   phone:'+852 9876-5432',  street_address:'88 Queen Road',        city:'Hong Kong',     state:'HK',  postal_code:'000000',  country:'Hong Kong',     product:'5G Unlimited Mobile Plan',    quantity:4, unit_price:49.99,  total_amount:199.96, status:'In progress', created_by:'Ms. Olivia Carter',  order_date:'2025-10-01T13:00:00.000Z' },
  { id:8,  first_name:'Henry',   last_name:'Davis',    customer_name:'Henry Davis',    email:'henry.d@example.com',     phone:'+1 303-555-0108', street_address:'99 Broadway',          city:'Denver',        state:'CO',  postal_code:'80203',   country:'United States', product:'Business Internet 500 Mbps',  quantity:1, unit_price:149.99, total_amount:149.99, status:'Pending',     created_by:'Mr. Lucas Martin',   order_date:'2025-10-10T09:30:00.000Z' },
  { id:9,  first_name:'Isla',    last_name:'Wilson',   customer_name:'Isla Wilson',    email:'isla.w@example.com',      phone:'+1 512-555-0109', street_address:'11 Sunset Blvd',       city:'Austin',        state:'TX',  postal_code:'78702',   country:'United States', product:'VoIP Corporate Package',      quantity:2, unit_price:79.99,  total_amount:159.98, status:'Completed',   created_by:'Mr. Michael Harris', order_date:'2025-10-18T11:00:00.000Z' },
  { id:10, first_name:'James',   last_name:'Taylor',   customer_name:'James Taylor',   email:'james.t@example.com',     phone:'+1 415-555-0110', street_address:'55 Market Street',     city:'San Francisco', state:'CA',  postal_code:'94105',   country:'United States', product:'Fiber Internet 300 Mbps',     quantity:1, unit_price:59.99,  total_amount:59.99,  status:'Pending',     created_by:'Mr. Ryan Cooper',    order_date:'2025-10-25T14:45:00.000Z' },
  { id:11, first_name:'Karen',   last_name:'Martinez', customer_name:'Karen Martinez', email:'karen.m@example.com',     phone:'+1 212-555-0111', street_address:'200 Park Avenue',      city:'New York',      state:'NY',  postal_code:'10166',   country:'United States', product:'Fiber Internet 1 Gbps',       quantity:3, unit_price:89.99,  total_amount:269.97, status:'In progress', created_by:'Ms. Olivia Carter',  order_date:'2025-11-02T08:00:00.000Z' },
  { id:12, first_name:'Liam',    last_name:'Anderson', customer_name:'Liam Anderson',  email:'liam.a@example.com',      phone:'+61 3-5550-0112', street_address:'77 Collins Street',    city:'Melbourne',     state:'VIC', postal_code:'3000',    country:'Australia',     product:'5G Unlimited Mobile Plan',    quantity:2, unit_price:49.99,  total_amount:99.98,  status:'Completed',   created_by:'Mr. Lucas Martin',   order_date:'2025-11-10T12:30:00.000Z' },
  { id:13, first_name:'Mia',     last_name:'Thompson', customer_name:'Mia Thompson',   email:'mia.t@example.com',       phone:'+65 8123-9999',   street_address:'14 Marina Bay',        city:'Singapore',     state:'SG',  postal_code:'018983',  country:'Singapore',     product:'Business Internet 500 Mbps',  quantity:2, unit_price:149.99, total_amount:299.98, status:'Pending',     created_by:'Mr. Michael Harris', order_date:'2025-11-18T10:15:00.000Z' },
  { id:14, first_name:'Noah',    last_name:'Garcia',   customer_name:'Noah Garcia',    email:'noah.g@example.com',      phone:'+1 713-555-0114', street_address:'500 Texas Ave',        city:'Houston',       state:'TX',  postal_code:'77002',   country:'United States', product:'VoIP Corporate Package',      quantity:1, unit_price:79.99,  total_amount:79.99,  status:'Completed',   created_by:'Mr. Ryan Cooper',    order_date:'2025-11-25T15:00:00.000Z' },
  { id:15, first_name:'Olivia',  last_name:'Robinson', customer_name:'Olivia Robinson',email:'olivia.r@example.com',    phone:'+852 6543-2109',  street_address:'30 Harbour Road',      city:'Hong Kong',     state:'HK',  postal_code:'000000',  country:'Hong Kong',     product:'Fiber Internet 1 Gbps',       quantity:1, unit_price:89.99,  total_amount:89.99,  status:'In progress', created_by:'Ms. Olivia Carter',  order_date:'2025-12-03T09:00:00.000Z' },
  { id:16, first_name:'Peter',   last_name:'Clark',    customer_name:'Peter Clark',    email:'peter.c@example.com',     phone:'+1 604-555-0116', street_address:'88 Robson Street',     city:'Vancouver',     state:'BC',  postal_code:'V6B 2B3', country:'Canada',        product:'Fiber Internet 300 Mbps',     quantity:3, unit_price:59.99,  total_amount:179.97, status:'Pending',     created_by:'Mr. Lucas Martin',   order_date:'2025-12-10T11:30:00.000Z' },
  { id:17, first_name:'Quinn',   last_name:'Lewis',    customer_name:'Quinn Lewis',    email:'quinn.l@example.com',     phone:'+1 312-555-0117', street_address:'233 Michigan Ave',     city:'Chicago',       state:'IL',  postal_code:'60601',   country:'United States', product:'5G Unlimited Mobile Plan',    quantity:5, unit_price:49.99,  total_amount:249.95, status:'Completed',   created_by:'Mr. Michael Harris', order_date:'2025-12-18T14:00:00.000Z' },
  { id:18, first_name:'Rachel',  last_name:'Walker',   customer_name:'Rachel Walker',  email:'rachel.w@example.com',    phone:'+61 7-5550-0118', street_address:'42 Queen Street',      city:'Brisbane',      state:'QLD', postal_code:'4000',    country:'Australia',     product:'Business Internet 500 Mbps',  quantity:1, unit_price:149.99, total_amount:149.99, status:'Pending',     created_by:'Mr. Ryan Cooper',    order_date:'2026-01-05T09:00:00.000Z' },
  { id:19, first_name:'Samuel',  last_name:'Hall',     customer_name:'Samuel Hall',    email:'samuel.h@example.com',    phone:'+1 604-555-0119', street_address:'900 Burrard Street',   city:'Vancouver',     state:'BC',  postal_code:'V6Z 2J8', country:'Canada',        product:'VoIP Corporate Package',      quantity:4, unit_price:79.99,  total_amount:319.96, status:'In progress', created_by:'Ms. Olivia Carter',  order_date:'2026-01-15T13:45:00.000Z' },
  { id:20, first_name:'Tina',    last_name:'Young',    customer_name:'Tina Young',     email:'tina.y@example.com',      phone:'+65 9876-1234',   street_address:'7 Raffles Quay',       city:'Singapore',     state:'SG',  postal_code:'048580',  country:'Singapore',     product:'Fiber Internet 1 Gbps',       quantity:2, unit_price:89.99,  total_amount:179.98, status:'Completed',   created_by:'Mr. Lucas Martin',   order_date:'2026-01-28T10:30:00.000Z' },
  { id:21, first_name:'Umar',    last_name:'Allen',    customer_name:'Umar Allen',     email:'umar.a@example.com',      phone:'+1 416-555-0121', street_address:'150 King Street West', city:'Toronto',       state:'ON',  postal_code:'M5H 1J9', country:'Canada',        product:'5G Unlimited Mobile Plan',    quantity:3, unit_price:49.99,  total_amount:149.97, status:'Pending',     created_by:'Mr. Michael Harris', order_date:'2026-02-05T08:30:00.000Z' },
  { id:22, first_name:'Vera',    last_name:'Scott',    customer_name:'Vera Scott',     email:'vera.s@example.com',      phone:'+1 212-555-0122', street_address:'350 Fifth Avenue',     city:'New York',      state:'NY',  postal_code:'10118',   country:'United States', product:'Business Internet 500 Mbps',  quantity:1, unit_price:149.99, total_amount:149.99, status:'Completed',   created_by:'Mr. Ryan Cooper',    order_date:'2026-02-12T11:00:00.000Z' },
  { id:23, first_name:'Will',    last_name:'Adams',    customer_name:'Will Adams',     email:'will.a@example.com',      phone:'+61 2-5550-0123', street_address:'10 Bridge Street',     city:'Sydney',        state:'NSW', postal_code:'2000',    country:'Australia',     product:'Fiber Internet 300 Mbps',     quantity:2, unit_price:59.99,  total_amount:119.98, status:'In progress', created_by:'Ms. Olivia Carter',  order_date:'2026-02-20T15:30:00.000Z' },
  { id:24, first_name:'Xena',    last_name:'Baker',    customer_name:'Xena Baker',     email:'xena.b@example.com',      phone:'+852 5555-7890',  street_address:'22 Pedder Street',     city:'Hong Kong',     state:'HK',  postal_code:'000000',  country:'Hong Kong',     product:'VoIP Corporate Package',      quantity:2, unit_price:79.99,  total_amount:159.98, status:'Pending',     created_by:'Mr. Lucas Martin',   order_date:'2026-03-01T09:15:00.000Z' },
  { id:25, first_name:'Yusuf',   last_name:'Carter',   customer_name:'Yusuf Carter',   email:'yusuf.c@example.com',     phone:'+1 512-555-0125', street_address:'750 Lamar Blvd',       city:'Austin',        state:'TX',  postal_code:'78703',   country:'United States', product:'Fiber Internet 1 Gbps',       quantity:1, unit_price:89.99,  total_amount:89.99,  status:'Completed',   created_by:'Mr. Michael Harris', order_date:'2026-03-08T10:00:00.000Z' },
  { id:26, first_name:'Zoe',     last_name:'Mitchell', customer_name:'Zoe Mitchell',   email:'zoe.m@example.com',       phone:'+1 604-555-0126', street_address:'1055 Dunsmuir Street', city:'Vancouver',     state:'BC',  postal_code:'V7X 1K8', country:'Canada',        product:'Business Internet 500 Mbps',  quantity:3, unit_price:149.99, total_amount:449.97, status:'In progress', created_by:'Mr. Ryan Cooper',    order_date:'2026-03-12T14:00:00.000Z' },
];

// ── In-memory state (loaded from file on start) ───────────
let orders  = readJSON(ORDERS_FILE, SEED_ORDERS);
let layout  = readJSON(LAYOUT_FILE, { widgets: [], layout: [] });
let nextId  = orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1;

function saveOrders()  { writeJSON(ORDERS_FILE, orders); }
function saveLayout()  { writeJSON(LAYOUT_FILE, layout); }

console.log(`✅ Store ready — ${orders.length} orders loaded`);

// ── Orders API ────────────────────────────
module.exports = {
  // LIST
  listOrders({ search, status, date_filter }) {
    let rows = [...orders];

    if (search) {
      const s = search.toLowerCase();
      rows = rows.filter(r =>
        (r.customer_name || '').toLowerCase().includes(s) ||
        (r.email         || '').toLowerCase().includes(s) ||
        (r.product       || '').toLowerCase().includes(s) ||
        String(r.id).includes(s)
      );
    }
    if (status) rows = rows.filter(r => r.status === status);
    if (date_filter && date_filter !== 'all') {
      const now  = new Date();
      const days = { today: 0, '7d': 7, '30d': 30, '90d': 90 }[date_filter];
      const cut  = new Date(now);
      if (days === 0) cut.setHours(0, 0, 0, 0);
      else cut.setDate(now.getDate() - days);
      rows = rows.filter(r => new Date(r.order_date) >= cut);
    }

    return rows.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
  },

  // GET ONE
  getOrder(id) {
    return orders.find(o => o.id === parseInt(id)) || null;
  },

  // CREATE
  createOrder(data) {
    const qty   = Math.max(1, parseInt(data.quantity) || 1);
    const price = parseFloat(data.unit_price) || 0;
    const order = {
      id:             nextId++,
      first_name:     String(data.first_name     || '').trim(),
      last_name:      String(data.last_name      || '').trim(),
      customer_name:  `${String(data.first_name || '').trim()} ${String(data.last_name || '').trim()}`.trim(),
      email:          String(data.email          || '').trim(),
      phone:          String(data.phone          || '').trim(),
      street_address: String(data.street_address || '').trim(),
      city:           String(data.city           || '').trim(),
      state:          String(data.state          || '').trim(),
      postal_code:    String(data.postal_code    || '').trim(),
      country:        String(data.country        || '').trim(),
      product:        String(data.product        || '').trim(),
      quantity:       qty,
      unit_price:     price,
      total_amount:   parseFloat((qty * price).toFixed(2)),
      status:         String(data.status         || 'Pending').trim(),
      created_by:     String(data.created_by     || '').trim(),
      order_date:     new Date().toISOString(),
    };
    orders.push(order);
    saveOrders();
    console.log(`Created order #${order.id}: ${order.customer_name}`);
    return order;
  },

  // UPDATE
  updateOrder(id, data) {
    const idx = orders.findIndex(o => o.id === parseInt(id));
    if (idx === -1) return null;
    const qty   = Math.max(1, parseInt(data.quantity) || 1);
    const price = parseFloat(data.unit_price) || 0;
    orders[idx] = {
      ...orders[idx],
      first_name:     String(data.first_name     || '').trim(),
      last_name:      String(data.last_name      || '').trim(),
      customer_name:  `${String(data.first_name || '').trim()} ${String(data.last_name || '').trim()}`.trim(),
      email:          String(data.email          || '').trim(),
      phone:          String(data.phone          || '').trim(),
      street_address: String(data.street_address || '').trim(),
      city:           String(data.city           || '').trim(),
      state:          String(data.state          || '').trim(),
      postal_code:    String(data.postal_code    || '').trim(),
      country:        String(data.country        || '').trim(),
      product:        String(data.product        || '').trim(),
      quantity:       qty,
      unit_price:     price,
      total_amount:   parseFloat((qty * price).toFixed(2)),
      status:         String(data.status         || 'Pending').trim(),
      created_by:     String(data.created_by     || '').trim(),
    };
    saveOrders();
    return orders[idx];
  },

  // DELETE
  deleteOrder(id) {
    const idx = orders.findIndex(o => o.id === parseInt(id));
    if (idx === -1) return false;
    orders.splice(idx, 1);
    saveOrders();
    return true;
  },

  // ANALYTICS
  getAnalytics() {
    const total    = orders.length;
    const revenue  = orders.reduce((s, o) => s + (o.total_amount || 0), 0);
    const pending  = orders.filter(o => o.status === 'Pending').length;
    const inprog   = orders.filter(o => o.status === 'In progress').length;
    const done     = orders.filter(o => o.status === 'Completed').length;

    const byProduct = {};
    orders.forEach(o => {
      if (!byProduct[o.product]) byProduct[o.product] = { product: o.product, cnt: 0, revenue: 0 };
      byProduct[o.product].cnt++;
      byProduct[o.product].revenue += o.total_amount || 0;
    });

    const byStatus = {};
    orders.forEach(o => {
      if (!byStatus[o.status]) byStatus[o.status] = { status: o.status, cnt: 0 };
      byStatus[o.status].cnt++;
    });

    return {
      summary: { total, revenue: parseFloat(revenue.toFixed(2)), pending, in_progress: inprog, completed: done },
      byProduct: Object.values(byProduct),
      byStatus:  Object.values(byStatus),
    };
  },

  // LAYOUT
  getLayout()       { return layout; },
  saveLayout(data)  { layout = data; saveLayout(); return layout; },
};
