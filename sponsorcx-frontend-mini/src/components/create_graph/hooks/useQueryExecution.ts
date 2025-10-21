/**
 * useQueryExecution Hook
 *
 * Manages query generation, validation, and execution:
 * - Generates GraphQL query from selections
 * - Validates query syntax
 * - Executes queries against Cube API
 * - Analyzes chart compatibility
 * - Auto-executes for editing mode
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { executeCubeGraphQL } from '../../../services/cube';
import { buildSimpleCubeQuery, validateCubeGraphQLQuery } from '../../../utils/graphql';
import { analyzeChartCompatibility, ChartType } from '../../../utils/chartDataAnalyzer';
import { ViewFields } from '../types';
import { FilterRule } from '../../../types/filters';
import { CubeMeasure, CubeDimension } from '../../../types/cube';

interface UseQueryExecutionOptions {
  selectedView: string | null;
  viewFields: ViewFields;
  selectedMeasures: Set<string>;
  selectedDimensions: Set<string>;
  selectedDates: Set<string>;
  filters: FilterRule[];
  isEditing: boolean;
  selectedChartType: ChartType | null;
  setSelectedChartType: (type: ChartType | null) => void;
  setPrimaryDimension: (dim: string | undefined) => void;
  setSecondaryDimension: (dim: string | undefined) => void;
  setSelectedMeasureField: (measure: string | undefined) => void;
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasureField?: string;
}

export function useQueryExecution(options: UseQueryExecutionOptions) {
  const {
    selectedView,
    viewFields,
    selectedMeasures,
    selectedDimensions,
    selectedDates,
    filters,
    isEditing,
    selectedChartType,
    setSelectedChartType,
    setPrimaryDimension,
    setSecondaryDimension,
    setSelectedMeasureField,
    primaryDimension,
    secondaryDimension,
    selectedMeasureField,
  } = options;

  const [queryResult, setQueryResult] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Generate GraphQL query based on selections
  const generatedQuery = useMemo(() => {
    if (!selectedView) return '';

    const selectedMeasuresList = viewFields.measures.filter((m: CubeMeasure) =>
      selectedMeasures.has(m.name)
    );
    const selectedDimensionsList = viewFields.dimensions.filter((d: CubeDimension) =>
      selectedDimensions.has(d.name)
    );
    const selectedDatesList = viewFields.dates.filter((d: CubeDimension) =>
      selectedDates.has(d.name)
    );

    // Only generate query if at least one field is selected
    if (
      selectedMeasuresList.length === 0 &&
      selectedDimensionsList.length === 0 &&
      selectedDatesList.length === 0
    ) {
      return '';
    }

    return buildSimpleCubeQuery({
      cubeName: selectedView,
      measures: selectedMeasuresList,
      dimensions: selectedDimensionsList,
      timeDimensions: selectedDatesList,
      filters,
    });
  }, [selectedView, selectedMeasures, selectedDimensions, selectedDates, viewFields, filters]);

  // Validate query automatically
  useEffect(() => {
    if (!generatedQuery) {
      setValidationResult(null);
      return;
    }

    validateCubeGraphQLQuery(generatedQuery).then(result => {
      setValidationResult(result);
    });
  }, [generatedQuery]);

  // Execute query
  const executeQuery = useCallback(async () => {
    if (!generatedQuery) {
      console.log('No query to execute');
      return;
    }

    console.log('Executing GraphQL Query:', generatedQuery);
    setIsExecuting(true);

    try {
      const result = await executeCubeGraphQL(generatedQuery);
      console.log('Query Result:', result);

      setQueryResult(result);

      // Analyze chart compatibility
      const compatibility = analyzeChartCompatibility(result);
      console.log('Chart Compatibility:', compatibility);

      // Auto-select recommended chart type ONLY if not editing or no chart type is set
      if (compatibility.compatibleCharts.length > 0 && !selectedChartType) {
        setSelectedChartType(compatibility.recommendation);
      }
    } catch (err) {
      console.error('Error executing query:', err);
      setQueryResult(null);
      setSelectedChartType(null);
    } finally {
      setIsExecuting(false);
    }
  }, [generatedQuery, selectedChartType, setSelectedChartType]);

  // Auto-execute query when editing (once view fields and query are ready)
  useEffect(() => {
    if (isEditing && generatedQuery && viewFields.measures.length > 0 && !queryResult) {
      executeQuery();
    }
  }, [isEditing, generatedQuery, viewFields.measures.length, queryResult, executeQuery]);

  // Analyze chart compatibility
  const chartCompatibility = useMemo(() => {
    if (!queryResult) {
      return {
        compatibleCharts: [],
        dataStructure: {
          measureCount: 0,
          dimensionCount: 0,
          rowCount: 0,
          measures: [],
          dimensions: [],
        },
        recommendation: 'kpi' as ChartType,
      };
    }
    return analyzeChartCompatibility(queryResult);
  }, [queryResult]);

  // Auto-set default primary/secondary dimensions and measure
  useEffect(() => {
    if (!queryResult || !chartCompatibility.dataStructure) return;

    const { dimensions, measures } = chartCompatibility.dataStructure;

    // Set primary dimension (first dimension by default)
    if (dimensions.length > 0 && !primaryDimension) {
      setPrimaryDimension(dimensions[0]);
    }

    // Set secondary dimension (second dimension if available)
    if (dimensions.length > 1 && !secondaryDimension) {
      setSecondaryDimension(dimensions[1]);
    }

    // Set selected measure (first measure by default)
    if (measures.length > 0 && !selectedMeasureField) {
      setSelectedMeasureField(measures[0]);
    }
  }, [
    queryResult,
    chartCompatibility,
    primaryDimension,
    secondaryDimension,
    selectedMeasureField,
    setPrimaryDimension,
    setSecondaryDimension,
    setSelectedMeasureField,
  ]);

  return {
    generatedQuery,
    validationResult,
    queryResult,
    chartCompatibility,
    executeQuery,
    isExecuting,
  };
}
