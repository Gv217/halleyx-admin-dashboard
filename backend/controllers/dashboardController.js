const db = require('../config/database');

exports.getLayout = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM dashboard_layouts WHERE layout_key='default' LIMIT 1");
    if (!rows.length) return res.json({ widgets: [], layout: [] });
    res.json({ widgets: JSON.parse(rows[0].widgets), layout: JSON.parse(rows[0].layout_data) });
  } catch (e) { console.error('[getLayout]', e); res.status(500).json({ message: e.message }); }
};

exports.saveLayout = async (req, res) => {
  try {
    const { widgets = [], layout = [] } = req.body;
    await db.execute(
      `INSERT INTO dashboard_layouts (layout_key,widgets,layout_data) VALUES ('default',?,?)
       ON DUPLICATE KEY UPDATE widgets=VALUES(widgets),layout_data=VALUES(layout_data),updated_at=NOW()`,
      [JSON.stringify(widgets), JSON.stringify(layout)]
    );
    res.json({ message: 'Saved', count: widgets.length });
  } catch (e) { console.error('[saveLayout]', e); res.status(500).json({ message: e.message }); }
};