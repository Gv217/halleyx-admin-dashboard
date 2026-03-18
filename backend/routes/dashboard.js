const r = require('express').Router(), c = require('../controllers/dashboardController');
r.get('/layout', c.getLayout); r.post('/layout', c.saveLayout);
module.exports = r;