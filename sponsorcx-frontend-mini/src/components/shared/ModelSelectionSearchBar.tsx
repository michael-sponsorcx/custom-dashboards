import { TextInput, Paper, Stack, Text, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useRef, useEffect } from 'react';
import { CubeView } from '../../types/cube';

interface ModelSelectionSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedView: string | null;
  onViewSelect: (viewName: string) => void;
  onClearSelection: () => void;
  displayedViews: CubeView[];
  loading: boolean;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
}

export function ModelSelectionSearchBar({
  searchQuery,
  setSearchQuery,
  selectedView,
  onViewSelect,
  onClearSelection,
  displayedViews,
  loading,
  dropdownOpen,
  setDropdownOpen,
}: ModelSelectionSearchBarProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, setDropdownOpen]);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <TextInput
        placeholder="Search for views..."
        value={searchQuery}
        onChange={(event) => {
          setSearchQuery(event.currentTarget.value);
          setDropdownOpen(true);
        }}
        onFocus={() => setDropdownOpen(true)}
        disabled={loading}
        rightSection={
          selectedView && (
            <ActionIcon
              variant="subtle"
              onClick={onClearSelection}
              aria-label="Clear selection"
            >
              <IconX size={16} />
            </ActionIcon>
          )
        }
      />

      {dropdownOpen && !loading && displayedViews.length > 0 && (
        <Paper
          shadow="md"
          p="xs"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            marginTop: '4px'
          }}
        >
          <Stack gap="xs">
            {displayedViews.map((view: CubeView) => (
              <div
                key={view.name}
                onClick={() => onViewSelect(view.name)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  backgroundColor: selectedView === view.name ? '#f0f0f0' : 'transparent',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    selectedView === view.name ? '#f0f0f0' : 'transparent';
                }}
              >
                <Text size="sm">{view.name}</Text>
                <Text size="xs" c="dimmed">{view.title}</Text>
              </div>
            ))}
          </Stack>
        </Paper>
      )}
    </div>
  );
}
