import { useState, useEffect, useMemo } from 'react';
import { Box, Title, Text } from '@mantine/core';
import { DashboardItem } from '@/types/dashboard';
import { ChartRenderer } from '../../../visualizations/ChartRenderer';
import { executeCubeGraphQL } from '../../../../services/backendCube';
import { buildQueryFromTemplate } from '../../../../utils/graphql/builder/builders/buildQueryFromTemplate';
import { combineFilters } from '../../../../utils/filters/combineFilters';

interface GraphSlideProps {
  graph: DashboardItem;
  dashboardFilters: any[];
  dashboardName: string;
}

/**
 * Graph slide component for presentation mode
 * Displays a single graph with its title and the dashboard name
 * Handles data fetching and chart rendering
 */
export function GraphSlide({ graph, dashboardFilters, dashboardName }: GraphSlideProps) {
  const [queryResult, setQueryResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Combine graph filters with dashboard filters
  const effectiveFilters = useMemo(() => {
    const graphFilters = graph.filters || [];
    return combineFilters(graphFilters, dashboardFilters);
  }, [graph.filters, dashboardFilters]);

  // Build query from template
  const query = useMemo(() => {
    return buildQueryFromTemplate({
      ...graph,
      filters: effectiveFilters,
    });
  }, [
    graph.viewName,
    graph.measures,
    graph.dimensions,
    graph.dates,
    effectiveFilters,
    graph.orderByField,
    graph.orderByDirection,
  ]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await executeCubeGraphQL(query);
        setQueryResult(result);
      } catch (err) {
        setError('Failed to load graph data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <>
      {/* Graph Title */}
      <Box mb="md">
        <Text size="lg" c="dimmed">
          {dashboardName}
        </Text>
        <Title order={2} c="black" style={{ fontSize: '2.5rem' }} mt="xs">
          {graph.name}
        </Title>
      </Box>

      {/* Chart */}
      <Box
        style={{
          flex: 1,
          width: '100%',
          minHeight: 0,
          position: 'relative',
        }}
      >
        {loading && (
          <Box
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text size="xl" c="dimmed">
              Loading...
            </Text>
          </Box>
        )}

        {error && (
          <Box
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text size="xl" c="red">
              {error}
            </Text>
          </Box>
        )}

        {!loading && !error && queryResult && graph.chartType && (
          <ChartRenderer
            queryResult={queryResult}
            selectedChartType={graph.chartType}
            numberFormat={graph.numberFormat || 'number'}
            numberPrecision={graph.numberPrecision || 2}
            primaryColor={graph.primaryColor || '#3b82f6'}
            colorPalette={graph.colorPalette}
            sortOrder={graph.sortOrder}
            primaryDimension={graph.primaryDimension}
            secondaryDimension={graph.secondaryDimension}
            selectedMeasure={graph.selectedMeasure}
            xAxisLabel={graph.xAxisLabel}
            yAxisLabel={graph.yAxisLabel}
            showXAxisGridLines={graph.showXAxisGridLines}
            showYAxisGridLines={graph.showYAxisGridLines}
            showRegressionLine={graph.showRegressionLine}
            maxDataPoints={graph.maxDataPoints}
            legendPosition={graph.legendPosition}
            kpiValue={graph.kpiValue}
            kpiLabel={graph.kpiLabel}
            kpiSecondaryValue={graph.kpiSecondaryValue}
            kpiSecondaryLabel={graph.kpiSecondaryLabel}
            kpiShowTrend={graph.kpiShowTrend}
            kpiTrendPercentage={graph.kpiTrendPercentage}
          />
        )}
      </Box>
    </>
  );
}
