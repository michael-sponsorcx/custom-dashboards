/**
 * Dashboard GraphQL Fragments
 */

export const DASHBOARD_FIELDS = `
  id
  organizationId
  name
  layout
  createdAt
  updatedAt
`;

export const DASHBOARD_GRID_ITEM_FIELDS = `
  id
  dashboardId
  graphId
  gridColumn
  gridRow
  gridWidth
  gridHeight
  displayOrder
`;

export const DASHBOARD_GRAPH_FIELDS = `
  id
  organizationId
  name
  viewName
  chartType
  chartTitle
  measures
  dimensions
  dates
  filters
  orderByField
  orderByDirection
  numberFormat
  numberPrecision
  colorPalette
  primaryColor
  sortOrder
  legendPosition
  kpiValue
  kpiLabel
  kpiSecondaryValue
  kpiSecondaryLabel
  kpiShowTrend
  kpiTrendPercentage
  showXAxisGridLines
  showYAxisGridLines
  showGridLines
  showRegressionLine
  xAxisLabel
  yAxisLabel
  maxDataPoints
  primaryDimension
  secondaryDimension
  selectedMeasure
  createdAt
  updatedAt
`;
