import { useState, useEffect, useMemo } from 'react';
import { fetchCubeMetadata } from '../../api';
import { CubeView, CubeMeasureMeta, CubeDimensionMeta } from '../../types/cube';
import { ModelSelectionSearchBar } from './ModelSelectionSearchBar';

interface ViewFields {
  measures: CubeMeasureMeta[];
  dimensions: CubeDimensionMeta[];
  dates: CubeDimensionMeta[];
}

interface ModelSelectorProps {
  initialViewName?: string;
  onViewSelect: (viewName: string | null) => void;
  onViewFieldsChange: (fields: ViewFields) => void;
  onClearSelections?: () => void;
}

/**
 * ModelSelector - Handles model/view search, selection, and field extraction
 * Encapsulates all metadata loading and view-related logic
 * Contains the ModelSelectionSearchBar UI component
 */
export function ModelSelector({
  initialViewName,
  onViewSelect,
  onViewFieldsChange,
  onClearSelections,
}: ModelSelectorProps) {
  const [searchQuery, setSearchQuery] = useState(initialViewName || '');
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<string | null>(initialViewName || null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch metadata on component mount
  useEffect(() => {
    const loadMetadata = async () => {
      setLoading(true);
      try {
        const data = await fetchCubeMetadata();
        setMetadata(data);
      } catch (err) {
        setError('Failed to load metadata');
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, []);

  // Extract views from metadata
  const views = useMemo(() => {
    if (!metadata?.cubes) return [];

    return metadata.cubes
      .filter((cube: any) => cube.type === 'view')
      .map((cube: any) => ({
        name: cube.name,
        title: cube.title || cube.name,
      }));
  }, [metadata]);

  // Filter views based on search query (case-insensitive substring match on name only)
  const filteredViews = useMemo(() => {
    if (!searchQuery.trim()) return views;

    const query = searchQuery.toLowerCase();
    return views.filter((view: CubeView) => view.name.toLowerCase().includes(query));
  }, [views, searchQuery]);

  // Limit to top 5 results
  const displayedViews = filteredViews.slice(0, 5);

  // Extract measures, dimensions, and dates from the selected view
  const viewFields = useMemo(() => {
    if (!selectedView || !metadata?.cubes) {
      return { measures: [], dimensions: [], dates: [] };
    }

    const view = metadata.cubes.find((cube: any) => cube.name === selectedView);
    if (!view) {
      return { measures: [], dimensions: [], dates: [] };
    }

    const measures =
      view.measures?.map((m: any) => ({
        name: m.name,
        title: m.shortTitle || m.title || m.name,
        type: m.type,
      })) || [];

    const allDimensions =
      view.dimensions?.map((d: any) => ({
        name: d.name,
        title: d.shortTitle || d.title || d.name,
        type: d.type,
      })) || [];

    // Separate date dimensions from regular dimensions
    const dates = allDimensions.filter((d: any) => d.type === 'time');
    const dimensions = allDimensions.filter((d: any) => d.type !== 'time');

    return { measures, dimensions, dates };
  }, [selectedView, metadata]);

  // Notify parent when view fields change
  useEffect(() => {
    onViewFieldsChange(viewFields);
  }, [viewFields, onViewFieldsChange]);

  const handleViewSelect = (viewName: string) => {
    setSelectedView(viewName);
    setSearchQuery(viewName);
    setDropdownOpen(false);
    onViewSelect(viewName);

    // Clear selections in parent component
    if (onClearSelections) {
      onClearSelections();
    }
  };

  const handleClearSelection = () => {
    setSelectedView(null);
    setSearchQuery('');
    onViewSelect(null);

    // Clear selections in parent component
    if (onClearSelections) {
      onClearSelections();
    }
  };

  return (
    <>
      <ModelSelectionSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedView={selectedView}
        onViewSelect={handleViewSelect}
        onClearSelection={handleClearSelection}
        displayedViews={displayedViews}
        loading={loading}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
      />
      {loading && <div>Loading metadata...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </>
  );
}
