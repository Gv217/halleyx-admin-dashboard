require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => {
  if (req.method !== 'GET') console.log(`→ ${req.method} ${req.path}`, req.body);
  next();
});

app.use('/api/orders',    require('./routes/orders'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.get('/api/health', (_q, r) => r.json({ status: 'ok', time: new Date() }));
app.use((_q, r) => r.status(404).json({ message: 'Not found' }));
app.use((e, _q, r, _n) => { console.error(e); r.status(500).json({ message: e.message }); });

app.listen(PORT, () => console.log(`\n🚀 Backend → http://localhost:${PORT}\n`));