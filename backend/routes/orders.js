const r = require('express').Router();
const c = require('../controllers/ordersController');

r.get('/analytics',    c.analytics);
r.get('/stats',        c.stats);
r.get('/export',       c.exportCSV);
r.get('/',             c.list);
r.get('/:id',          c.get);
r.post('/',            c.create);
r.put('/:id',          c.update);
r.patch('/bulk-status',c.bulkStatus);
r.delete('/:id',       c.remove);

module.exports = r;