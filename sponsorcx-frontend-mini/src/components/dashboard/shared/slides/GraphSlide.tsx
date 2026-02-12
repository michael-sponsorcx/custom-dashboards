import { useState, useEffect, useMemo } from 'react';
import { Box, Title, Text } from '@mantine/core';
import { GridItem } from '@/types/dashboard';
import { ChartRenderer } from '../../../visualizations/ChartRenderer';
import { executeCubeGraphQL } from '../../../../api';
import { buildQueryFromTemplate } from '../../../../utils/graphql/builder/builders/buildQueryFromTemplate';
import { combineFilters } from '../../../../utils/filters/combineFilters';

interface GraphSlideProps {
  graph: GridItem;
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
    return combineFilters(graph.filters, dashboardFilters);
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
    if (!query) {
      setLoading(false);
      setError('Empty query');
      return;
    }

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
            numberFormat={graph.numberFormat}
            numberPrecision={graph.numberPrecision}
            primaryColor={graph.primaryColor}
            colorPalette={graph.colorPalette}
            sortOrder={graph.sortOrder}
            primaryDimension={graph.primaryDimension}
            secondaryDimension={graph.secondaryDimension ?? undefined}
            selectedMeasure={graph.selectedMeasure}
            xAxisLabel={graph.xAxisLabel ?? undefined}
            yAxisLabel={graph.yAxisLabel ?? undefined}
            showXAxisGridLines={graph.showXAxisGridLines}
            showYAxisGridLines={graph.showYAxisGridLines}
            showRegressionLine={graph.showRegressionLine}
            maxDataPoints={graph.maxDataPoints}
            legendPosition={graph.legendPosition}
            kpiValue={graph.kpiValue ?? undefined}
            kpiLabel={graph.kpiLabel ?? undefined}
            kpiSecondaryValue={graph.kpiSecondaryValue ?? undefined}
            kpiSecondaryLabel={graph.kpiSecondaryLabel ?? undefined}
            kpiShowTrend={graph.kpiShowTrend}
            kpiTrendPercentage={graph.kpiTrendPercentage ?? undefined}
          />
        )}
      </Box>
    </>
  );
}
