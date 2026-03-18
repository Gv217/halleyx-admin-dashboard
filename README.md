# Halleyx Custom Dashboard Builder
### Full Stack Engineer — Challenge II (2026)

A full-stack web application for building personalized dashboards connected to live Customer Order data.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, React Grid Layout, Recharts |
| Backend | Node.js, Express.js |
| Database | MySQL 8+ |
| Styling | Custom CSS Design System (dark theme) |

---

## Project Structure

```
halleyx-dashboard/
├── backend/
│   ├── config/
│   │   ├── db.js              # MySQL connection pool
│   │   └── init.sql           # Schema + seed data
│   ├── controllers/
│   │   ├── ordersController.js
│   │   └── dashboardController.js
│   ├── routes/
│   │   ├── orders.js
│   │   └── dashboard.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Sidebar.js
    │   │   │   ├── ConfirmDialog.js
    │   │   │   └── ContextMenu.js
    │   │   ├── dashboard/
    │   │   │   └── WidgetConfigPanel.js
    │   │   ├── orders/
    │   │   │   └── OrderModal.js
    │   │   └── widgets/
    │   │       └── WidgetRenderers.js
    │   ├── pages/
    │   │   ├── DashboardPage.js
    │   │   ├── DashboardConfigPage.js
    │   │   └── OrdersPage.js
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── constants.js
    │   ├── styles/
    │   │   └── global.css
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## Setup Instructions

### 1. Database Setup

Make sure MySQL 8+ is running, then:

```bash
mysql -u root -p < backend/config/init.sql
```

This creates:
- `halleyx_dashboard` database
- `customer_orders` table with indexes
- `dashboard_layouts` table
- 8 seed orders for testing

---

### 2. Backend Setup

```bash
cd backend
npm install

# Create your .env file
cp .env.example .env
# Edit .env with your MySQL credentials

npm run dev      # development with nodemon
# or
npm start        # production
```

Backend runs at: `http://localhost:5000`

**API Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/orders | List orders (supports ?search, ?start_date, ?end_date) |
| GET | /api/orders/:id | Get single order |
| POST | /api/orders | Create order |
| PUT | /api/orders/:id | Update order |
| DELETE | /api/orders/:id | Delete order |
| GET | /api/orders/analytics | Aggregated analytics data |
| GET | /api/dashboard/layout | Get saved dashboard layout |
| POST | /api/dashboard/layout | Save dashboard layout |
| GET | /api/health | Health check |

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

The `proxy` in `package.json` forwards `/api/*` to the backend automatically.

---

## Features

### Dashboard Page
- View configured widgets in a read-only grid layout
- Date range filter affects all widgets in real time
- Empty state with "Configure Dashboard" CTA

### Dashboard Configuration Page
- Drag widgets from the left palette onto the canvas
- Hover any widget to reveal Settings and Delete icons
- Settings panel for full widget configuration:
  - **KPI Card**: metric, aggregation (Sum/Avg/Count), format, decimal precision
  - **Bar/Line/Area/Scatter Chart**: X/Y axis, color picker, data labels
  - **Pie Chart**: data field, legend toggle
  - **Table**: column multiselect, sorting, pagination, filters, font size, header color
- Resize widgets via drag handles
- Save Configuration persists layout to MySQL

### Customer Orders Page
- Full data table with pagination (10/page)
- Real-time search across name, email, order ID
- Right-click context menu: Edit / Delete
- Create/Edit modal with full validation:
  - All mandatory fields show "Please fill the field" error
  - Quantity minimum: 1
  - Total amount auto-calculated (read-only)
- Confirmation dialog before deletion

### Widget System
- **KPI Card**: computes Sum/Average/Count from live order data
- **Bar Chart**: groups by X axis field, sums Y axis
- **Line Chart**: trend visualization
- **Area Chart**: filled trend with gradient
- **Scatter Plot**: numeric field correlation
- **Pie Chart**: categorical distribution with percentages
- **Table**: filterable, sortable, paginated table widget

### Responsive Grid
- Desktop: 12-column grid
- Tablet (≤768px): 8-column equivalent (widgets reflow)
- Mobile (≤480px): 4-column stacking

---

## Environment Variables

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=halleyx_dashboard
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

---

## Design System

- **Font**: Syne (display/headings) + Instrument Sans (body) + DM Mono (code/labels)
- **Theme**: Dark industrial — deep navy backgrounds, sharp blue accent (#4f8ef7)
- **Color tokens**: CSS variables throughout, fully consistent
