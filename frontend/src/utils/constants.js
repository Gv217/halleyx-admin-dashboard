export const COUNTRIES = ['United States','Canada','Australia','Singapore','Hong Kong'];
export const PRODUCTS  = ['Fiber Internet 300 Mbps','5G Unlimited Mobile Plan','Fiber Internet 1 Gbps','Business Internet 500 Mbps','VoIP Corporate Package'];
export const STATUSES  = ['Pending','In progress','Completed'];
export const AGENTS    = ['Mr. Michael Harris','Mr. Ryan Cooper','Ms. Olivia Carter','Mr. Lucas Martin'];
export const DATE_FILTERS = [{v:'all',l:'All time'},{v:'today',l:'Today'},{v:'7d',l:'Last 7 days'},{v:'30d',l:'Last 30 days'},{v:'90d',l:'Last 90 days'}];
export const WIDGET_TYPES = [
  {type:'kpi',    label:'KPI Value',   icon:'◈',group:'KPIs',   dw:3,dh:3},
  {type:'bar',    label:'Bar Chart',   icon:'▮',group:'Charts', dw:5,dh:5},
  {type:'line',   label:'Line Chart',  icon:'∿',group:'Charts', dw:5,dh:5},
  {type:'area',   label:'Area Chart',  icon:'◬',group:'Charts', dw:5,dh:5},
  {type:'scatter',label:'Scatter Plot',icon:'⋰',group:'Charts', dw:5,dh:5},
  {type:'pie',    label:'Pie Chart',   icon:'◔',group:'Charts', dw:4,dh:5},
  {type:'table',  label:'Table',       icon:'▦',group:'Tables', dw:6,dh:5},
];
export const METRIC_FIELDS = [
  {v:'total_amount',l:'Total amount',num:true},{v:'unit_price',l:'Unit price',num:true},
  {v:'quantity',l:'Quantity',num:true},{v:'product',l:'Product',num:false},
  {v:'status',l:'Status',num:false},{v:'created_by',l:'Created by',num:false},
  {v:'customer_name',l:'Customer',num:false},{v:'country',l:'Country',num:false},
];
export const AXIS_FIELDS = [
  {v:'product',l:'Product'},{v:'quantity',l:'Quantity'},{v:'unit_price',l:'Unit price'},
  {v:'total_amount',l:'Total amount'},{v:'status',l:'Status'},
  {v:'created_by',l:'Created by'},{v:'country',l:'Country'},
];
export const TABLE_COLS = [
  {v:'id',l:'ID'},{v:'customer_name',l:'Customer'},{v:'email',l:'Email'},
  {v:'product',l:'Product'},{v:'quantity',l:'Qty'},{v:'unit_price',l:'Unit $'},
  {v:'total_amount',l:'Total'},{v:'status',l:'Status'},
  {v:'created_by',l:'Agent'},{v:'order_date',l:'Date'},{v:'country',l:'Country'},
];
export const STATUS_CLS = {'Pending':'badge-pending','In progress':'badge-progress','Completed':'badge-complete'};
export const CHART_COLORS = ['#4f8ef7','#a78bfa','#22c55e','#f59e0b','#ef4444','#22d3ee','#f43f5e','#84cc16'];