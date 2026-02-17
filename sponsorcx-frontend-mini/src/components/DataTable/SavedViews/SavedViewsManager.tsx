/**
 * SavedViewsManager — horizontal button group for switching between saved views.
 * Renders inside Stadium PageHeader (row 1, left side) when hideSavedViews is false.
 *
 * Matches the production pattern:
 *   - List icon menu button (left) for viewing all saved views
 *   - Horizontal scrollable Button.Group with pinned views
 *   - Save button when active view has unsaved changes (non-default views)
 *   - Create button when any view has unsaved changes
 */

import { SavedView } from '@/gql/savedViewsGql';
import colors from '@/stadiumDS/foundations/colors';
import List from '@/stadiumDS/foundations/icons/Layout/List';
import Save from '@/stadiumDS/foundations/icons/General/Save';
import MagicWand from '@/stadiumDS/foundations/icons/Editor/MagicWand';
import Plus from '@/stadiumDS/foundations/icons/General/Plus';
import {
  Button,
  Flex,
  Menu,
  ScrollArea,
  Tooltip,
} from '@mantine/core';
import { useRef, useEffect, useMemo } from 'react';
import classes from './SavedViewButtons.module.css';

interface SavedViewsManagerProps {
  savedViews: SavedView[];
  activeView?: SavedView;
  onViewSelect: (view: SavedView) => void;
  setActiveViewId: (viewId: string) => void;
  savedViewsLoading?: boolean;
  filtersAreApplied?: boolean;
  disableScrollActiveButton?: boolean;
  // PageHeader passes these — unused for now
  currentFilters?: Record<string, unknown>;
  currentColumnOrder?: string[];
  currentSorting?: unknown[];
  currentColumnPinning?: Record<string, unknown> | { left?: string[]; right?: string[] };
  currentColumnVisibility?: Record<string, boolean>;
  currentColumnWidths?: Record<string, number>;
  currentGroupBy?: string;
  currentExpanded?: unknown;
  userId?: string;
  organizationId?: string;
  tableName?: string;
  entityId?: string;
  entityIdLoading?: boolean;
  refetchSavedViews?: () => void;
}

export const SavedViewsManager = ({
  savedViews,
  activeView,
  onViewSelect,
  setActiveViewId,
  filtersAreApplied = false,
  disableScrollActiveButton = false,
}: SavedViewsManagerProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Scroll active button into view
  useEffect(() => {
    setTimeout(() => {
      if (activeView?.id && buttonRefs.current[activeView.id] && !disableScrollActiveButton) {
        buttonRefs.current[activeView.id]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 50);
  }, [activeView?.id, disableScrollActiveButton]);

  const displayedViews = useMemo(
    () => savedViews.filter((view) => view.pinned_view !== false),
    [savedViews]
  );

  const nonDefaultViews = useMemo(
    () => savedViews.filter((view) => !view.default_view_tag),
    [savedViews]
  );

  const handleViewSelect = (view: SavedView) => {
    if (view.id === activeView?.id) return;
    setActiveViewId(view.id);
    onViewSelect(view);
  };

  const viewHasUnsavedChanges = filtersAreApplied;

  return (
    <Flex
      justify="flex-start"
      wrap="nowrap"
      align="flex-start"
      className={classes.flexRoot}
    >
      {/* List icon menu for all saved views */}
      <Menu shadow="md" width={216} position="bottom-start">
        <Menu.Target>
          <Button
            variant="default"
            className={classes.savedViewMenuTargetButton}
            aria-label="Open Saved Views Menu"
          >
            <List size="18" color={colors.Gray[400]} />
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Saved Views</Menu.Label>
          <Menu.Divider />
          {nonDefaultViews.map((view) => (
            <Menu.Item key={view.id} onClick={() => handleViewSelect(view)}>
              {view.name}
            </Menu.Item>
          ))}
          {nonDefaultViews.length > 0 && <Menu.Divider />}
          <Menu.Item
            leftSection={<Plus color={colors.Gray[500]} size="16" />}
            disabled
          >
            Create
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      {/* Horizontal scrollable pinned views */}
      <ScrollArea
        scrollbars="x"
        type="hover"
        viewportRef={viewportRef}
        offsetScrollbars="x"
        classNames={{ scrollbar: classes.scrollbar }}
      >
        <Button.Group>
          {displayedViews.map((view, index) => (
            <Button
              key={view.id}
              ref={(el) => { buttonRefs.current[view.id] = el; }}
              variant="default"
              classNames={{
                root: classes.root,
                label: classes.savedViewButtonLabel,
                section: classes.savedViewButtonSection,
              }}
              styles={{
                root: {
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  ...(index < displayedViews.length - 1 && {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderRight: 'none',
                  }),
                  width: '120px',
                },
              }}
              data-active={view.id === activeView?.id}
              onClick={() => handleViewSelect(view)}
              fullWidth
              justify="flex-start"
            >
              <Tooltip
                multiline
                label={view.name}
                withinPortal
                disabled={view.name.length <= 9}
              >
                <span>{view.name}</span>
              </Tooltip>
            </Button>
          ))}
        </Button.Group>
      </ScrollArea>

      {/* Save button — only for non-default views with changes */}
      {viewHasUnsavedChanges && activeView && !activeView.default_view_tag && (
        <Button
          variant="subtle"
          className={classes.saveSavedViewButton}
          leftSection={
            <Save variant="2" color={colors.Gray[400]} size="18px" />
          }
          disabled
        >
          Save
        </Button>
      )}

      {/* Create button — when any view has unsaved changes */}
      {activeView && viewHasUnsavedChanges && (
        <Button
          variant="subtle"
          className={classes.saveSavedViewButton}
          leftSection={
            <MagicWand variant="2" color={colors.Gray[400]} size="18px" />
          }
          disabled
        >
          Create
        </Button>
      )}
    </Flex>
  );
};
