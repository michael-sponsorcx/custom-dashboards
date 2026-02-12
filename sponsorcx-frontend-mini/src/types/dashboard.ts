import type { Dashboard } from './backend-graphql';
import type { GraphUI } from './graph';

/**
 * Frontend dashboard configuration.
 * Extends the generated backend Dashboard type with UI-specific fields.
 */
export interface DashboardUI extends Omit<Dashboard, '__typename' | 'organizationId'> {
  graphIds: string[];
}

/**
 * Grid layout properties for positioning items in the dashboard grid
 */
export interface GridLayout {
  gridColumn: number; // Starting column (1-6)
  gridRow: number; // Starting row (1-based)
  gridWidth: number; // Width in columns (1-6)
  gridHeight: number; // Height in rows (1+)
}

/**
 * A graph positioned within a dashboard grid.
 * Combines GraphUI configuration with grid layout positioning.
 */
export interface GridItem extends GraphUI, GridLayout {}
