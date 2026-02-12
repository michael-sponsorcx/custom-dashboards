import { BaseTable } from './BaseTable';
import { useMemo } from 'react';
import { transformChartData } from '../../../utils/chartDataTransformations';
import { ChartType } from '../../../types/backend-graphql';

export interface ReportTableProps {
  queryResult: unknown;
  isLoading?: boolean;
  height?: number;
  minWidth?: number;
  numberFormat?: 'currency' | 'percentage' | 'number' | 'abbreviated';
  numberPrecision?: number;
  columnConfig?: Array<{
    key: string;
    label: string;
    format?: 'currency' | 'percentage' | 'number' | 'abbreviated';
    precision?: number;
  }>;
}

/**
 * ReportTable Component
 *
 * A table visualization component for dashboards that displays
 * formatted data from Cube.js queries.
 *
 * This component extends BaseTable and provides:
 * - Number formatting (currency, percentage, abbreviated, plain numbers)
 * - Custom column configuration
 * - Dashboard-compatible data visualization
 *
 * Uses the centralized transformChartData utility to parse Cube responses.
 *
 * @example
 * <ReportTable
 *   queryResult={cubeResult}
 *   isLoading={false}
 *   numberFormat="currency"
 *   numberPrecision={2}
 * />
 */
export function ReportTable({
  queryResult,
  isLoading = false,
  height = 600,
  minWidth = 500
}: ReportTableProps) {
  // Use centralized transformation utility to parse Cube data
  const parsedData = useMemo(() => {
    const result = transformChartData({
      chartType: ChartType.Table,
      cubeData: queryResult,
    });
    return result.data;
  }, [queryResult]);

  return (
    <BaseTable
      parsedData={parsedData}
      queryResult={queryResult}
      isLoading={isLoading}
      height={height}
      minWidth={minWidth}
      striped
      highlightOnHover
      withTableBorder
      withColumnBorders
      stickyHeader
      enableLazyLoading
    />
  );
}