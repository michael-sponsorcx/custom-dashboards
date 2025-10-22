import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { Stack, Tabs, TextInput, Group, Button, Text, Checkbox, Loader, Alert, Center } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface DimensionFilterContentProps {
  dimensionValues: string[];
  loadingValues: boolean;
  loadError: string | null;
  dimensionMode: 'include' | 'exclude';
  selectedValues: Set<string>;
  onModeChange: (mode: 'include' | 'exclude') => void;
  onToggleValue: (value: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

// Memoized row component for performance
const DimensionValueRow = memo(({
  value,
  checked,
  onToggle
}: {
  value: string;
  checked: boolean;
  onToggle: (value: string) => void;
}) => (
  <Group key={value} gap="sm">
    <Checkbox checked={checked} onChange={() => onToggle(value)} />
    <Text size="sm">{value}</Text>
  </Group>
));

DimensionValueRow.displayName = 'DimensionValueRow';

export function DimensionFilterContent({
  dimensionValues,
  loadingValues,
  loadError,
  dimensionMode,
  selectedValues,
  onModeChange,
  onToggleValue,
  onSelectAll,
  onDeselectAll
}: DimensionFilterContentProps) {
  // Lazy loading state - only render a subset at a time
  const [displayLimit, setDisplayLimit] = useState(50); // Show 50 initially
  const LOAD_INCREMENT = 50; // Load 50 more at a time

  // Search/filter state for dimension values
  const [searchQuery, setSearchQuery] = useState('');

  // Refs for scroll containers (separate for each tab)
  const includeScrollRef = useRef<HTMLDivElement>(null);
  const excludeScrollRef = useRef<HTMLDivElement>(null);

  // Filter dimension values based on search
  const filteredDimensionValues = useMemo(() => {
    if (!searchQuery.trim()) return dimensionValues;
    const lowerQuery = searchQuery.toLowerCase();
    return dimensionValues.filter(value =>
      value.toLowerCase().includes(lowerQuery)
    );
  }, [dimensionValues, searchQuery]);

  // Reset display limit when search changes or dimension values change
  useEffect(() => {
    setDisplayLimit(50);
  }, [searchQuery, dimensionValues]);

  // Check if there are more items to load
  const hasMore = displayLimit < filteredDimensionValues.length;

  // Handle scroll event to load more items
  const handleScroll = useCallback((e: Event) => {
    const container = e.target as HTMLDivElement;
    if (!container || !hasMore) {

      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px threshold

    console.log('Scroll event:', { scrollTop, scrollHeight, clientHeight, scrolledToBottom, hasMore });

    if (scrolledToBottom) {

      setDisplayLimit(prev => Math.min(prev + LOAD_INCREMENT, filteredDimensionValues.length));
    }
  }, [hasMore, displayLimit, filteredDimensionValues.length, LOAD_INCREMENT]);

  // Attach scroll listener to both containers
  useEffect(() => {
    const includeContainer = includeScrollRef.current;
    const excludeContainer = excludeScrollRef.current;

    if (includeContainer) {
      includeContainer.addEventListener('scroll', handleScroll, { passive: true });
    }

    if (excludeContainer) {
      excludeContainer.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (includeContainer) {
        includeContainer.removeEventListener('scroll', handleScroll);
      }
      if (excludeContainer) {
        excludeContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  // Memoized handlers
  const handleToggleValue = useCallback((value: string) => {
    onToggleValue(value);
  }, [onToggleValue]);

  // Memoized list rendering
  const dimensionValuesList = useMemo(() => {
    const valuesToDisplay = filteredDimensionValues.slice(0, displayLimit);
    console.log('Rendering dimension values list:', {
      valuesToDisplayCount: valuesToDisplay.length,
      firstFew: valuesToDisplay.slice(0, 3)
    });
    return valuesToDisplay.map((value) => (
      <DimensionValueRow
        key={value}
        value={value}
        checked={selectedValues.has(value)}
        onToggle={handleToggleValue}
      />
    ));
  }, [filteredDimensionValues, selectedValues, handleToggleValue, displayLimit]);

  if (loadingValues) {
    return (
      <Stack align="center" gap="md" py="xl">
        <Loader size="md" />
        <Text size="sm" c="dimmed">Loading filter options...</Text>
      </Stack>
    );
  }

  if (loadError) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
        {loadError}
      </Alert>
    );
  }

  return (
    <Tabs value={dimensionMode} onChange={(value) => value && onModeChange(value as 'include' | 'exclude')}>
      <Tabs.List grow>
        <Tabs.Tab value="include">Include</Tabs.Tab>
        <Tabs.Tab value="exclude">Exclude</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="include" pt="md">
        <Stack gap="md">
          <TextInput
            placeholder="Search values..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            size="xs"
          />
          <Group gap="sm">
            <Button size="xs" variant="light" onClick={onSelectAll}>
              Select All
            </Button>
            <Button size="xs" variant="light" onClick={onDeselectAll}>
              Deselect All
            </Button>
            <Text size="xs" c="dimmed">
              Showing {Math.min(displayLimit, filteredDimensionValues.length)} of {filteredDimensionValues.length}
            </Text>
          </Group>
          <div
            ref={includeScrollRef}
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '4px'
            }}
          >
            {dimensionValuesList}
            {hasMore && (
              <Center py="md">
                <Loader size="sm" />
              </Center>
            )}
            {!hasMore && filteredDimensionValues.length > 50 && (
              <Center py="xs">
                <Text size="xs" c="dimmed">All values loaded</Text>
              </Center>
            )}
          </div>
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="exclude" pt="md">
        <Stack gap="md">
          <TextInput
            placeholder="Search values..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            size="xs"
          />
          <Group gap="sm">
            <Button size="xs" variant="light" onClick={onSelectAll}>
              Select All
            </Button>
            <Button size="xs" variant="light" onClick={onDeselectAll}>
              Deselect All
            </Button>
            <Text size="xs" c="dimmed">
              Showing {Math.min(displayLimit, filteredDimensionValues.length)} of {filteredDimensionValues.length}
            </Text>
          </Group>
          <div
            ref={excludeScrollRef}
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '4px'
            }}
          >
            {dimensionValuesList}
            {hasMore && (
              <Center py="md">
                <Loader size="sm" />
              </Center>
            )}
            {!hasMore && filteredDimensionValues.length > 50 && (
              <Center py="xs">
                <Text size="xs" c="dimmed">All values loaded</Text>
              </Center>
            )}
          </div>
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );
}
