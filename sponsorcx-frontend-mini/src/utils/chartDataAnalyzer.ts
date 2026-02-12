import { ChartType } from '../types/backend-graphql';

export { ChartType };

export interface ChartCompatibility {
  compatibleCharts: ChartType[];
  dataStructure: {
    measureCount: number;
    dimensionCount: number;
    rowCount: number;
    measures: string[];
    dimensions: string[];
  };
  recommendation: ChartType;
}

/**
 * Analyzes Cube GraphQL response data to determine compatible chart types
 * @param data - The GraphQL response data object
 * @returns ChartCompatibility object with compatible charts and recommendations
 */
export function analyzeChartCompatibility(data: any): ChartCompatibility {
  // Handle empty or invalid data
  if (!data?.data?.cube || !Array.isArray(data.data.cube) || data.data.cube.length === 0) {
    return {
      compatibleCharts: [],
      dataStructure: {
        measureCount: 0,
        dimensionCount: 0,
        rowCount: 0,
        measures: [],
        dimensions: [],
      },
      recommendation: ChartType.Kpi,
    };
  }

  const cubeData = data.data.cube;
  const rowCount = cubeData.length;

  // Analyze first row to understand structure
  const firstRow = cubeData[0];
  const viewName = Object.keys(firstRow)[0]; // e.g., "revenue"
  const rowData = firstRow[viewName];

  // Extract field names
  const fields = Object.keys(rowData);

  // Identify measures (numeric values) and dimensions (string values typically)
  const measures: string[] = [];
  const dimensions: string[] = [];

  fields.forEach((field) => {
    const value = rowData[field];
    // Dimensions typically have names like "dim_" or contain "label", "name", "date"
    // Measures are numeric values
    if (typeof value === 'number') {
      measures.push(field);
    } else if (typeof value === 'string') {
      dimensions.push(field);
    }
  });

  const measureCount = measures.length;
  const dimensionCount = dimensions.length;

  // Determine compatible chart types based on data structure
  const compatibleCharts: ChartType[] = [];

  // Rule 0: Table is always available (can display any data structure)
  compatibleCharts.push(ChartType.Table);

  // Rule 1: KPI is always available if there's at least one measure
  if (measureCount >= 1) {
    compatibleCharts.push(ChartType.Kpi);
  }

  // Rule 2: Multiple rows with at least 1 measure and 1 dimension → Line and all Bar variants + Pie
  if (rowCount > 1 && measureCount >= 1 && dimensionCount >= 1) {
    compatibleCharts.push(ChartType.Line, ChartType.Bar, ChartType.HorizontalBar, ChartType.Pie);

    // Stacked variants available if multiple measures OR multiple dimensions
    // Multiple dimensions allow stacking by category (e.g., revenue by year AND region)
    if (measureCount > 1 || dimensionCount > 1) {
      compatibleCharts.push(ChartType.StackedBar, ChartType.HorizontalStackedBar);
    }
  }
  // Rule 3: Multiple rows with measures but no dimensions → Bar chart variants
  else if (rowCount > 1 && measureCount >= 1 && dimensionCount === 0) {
    compatibleCharts.push(ChartType.Bar, ChartType.HorizontalBar);
    if (measureCount > 1) {
      compatibleCharts.push(ChartType.StackedBar, ChartType.HorizontalStackedBar);
    }
  }

  // Default recommendation logic
  let recommendation: ChartType = ChartType.Kpi;
  if (compatibleCharts.includes(ChartType.Line)) {
    recommendation = ChartType.Line; // Prefer line for time series
  } else if (compatibleCharts.includes(ChartType.Bar)) {
    recommendation = ChartType.Bar;
  } else if (compatibleCharts.includes(ChartType.Kpi)) {
    recommendation = ChartType.Kpi;
  }

  return {
    compatibleCharts,
    dataStructure: {
      measureCount,
      dimensionCount,
      rowCount,
      measures,
      dimensions,
    },
    recommendation,
  };
}
