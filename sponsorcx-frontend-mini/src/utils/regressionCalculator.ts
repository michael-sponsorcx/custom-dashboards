/**
 * Linear Regression Calculator
 *
 * Calculates linear regression (y = mx + b) from data points
 */

export interface RegressionResult {
  slope: number;
  intercept: number;
  predict: (x: number) => number;
}

/**
 * Calculate linear regression from data points
 * @param data Array of data points with x and y values
 * @param xKey Key for x values in data
 * @param yKey Key for y values in data
 * @returns Regression result with slope, intercept, and predict function
 */
export function calculateLinearRegression(
  data: any[],
  xKey: string,
  yKey: string
): RegressionResult | null {
  if (!data || data.length < 2) {
    return null;
  }

  // Convert data to numeric arrays, filtering out non-numeric values
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i < data.length; i++) {
    const xVal = data[i][xKey];
    const yVal = data[i][yKey];

    // Convert to numbers - handle both numeric and string representations
    const x = typeof xVal === 'number' ? xVal : parseFloat(xVal);
    const y = typeof yVal === 'number' ? yVal : parseFloat(yVal);

    // Only include valid numeric points
    if (!isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y)) {
      points.push({ x, y });
    }
  }

  if (points.length < 2) {
    return null;
  }

  // Calculate means
  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;

  // Calculate slope and intercept using least squares method
  let numerator = 0;
  let denominator = 0;

  for (const point of points) {
    numerator += (point.x - meanX) * (point.y - meanY);
    denominator += (point.x - meanX) * (point.x - meanX);
  }

  // Handle case where all x values are the same (vertical line)
  if (denominator === 0) {
    return null;
  }

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  return {
    slope,
    intercept,
    predict: (x: number) => slope * x + intercept,
  };
}

/**
 * Generate regression line data points for charting
 * @param data Original data array
 * @param xKey Key for x values
 * @param yKey Key for y values
 * @param regressionKey Key to use for regression values in output
 * @returns Array with regression values added
 */
export function addRegressionLineToData(
  data: any[],
  xKey: string,
  yKey: string,
  regressionKey = 'regressionLine'
): any[] {
  const regression = calculateLinearRegression(data, xKey, yKey);

  if (!regression) {
    return data;
  }

  // Add regression line values to each data point
  return data.map((point) => {
    const xVal = typeof point[xKey] === 'number' ? point[xKey] : parseFloat(point[xKey]);

    if (isNaN(xVal) || !isFinite(xVal)) {
      return { ...point, [regressionKey]: null };
    }

    const regressionValue = regression.predict(xVal);

    return {
      ...point,
      [regressionKey]: regressionValue,
    };
  });
}
