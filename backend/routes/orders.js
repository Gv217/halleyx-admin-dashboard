const r = require('express').Router(), c = require('../controllers/ordersController');
r.get('/analytics', c.analytics);
r.get('/',    c.list);   r.get('/:id',  c.get);
r.post('/',   c.create); r.put('/:id',  c.update);
r.delete('/:id', c.remove);
module.exports = r;