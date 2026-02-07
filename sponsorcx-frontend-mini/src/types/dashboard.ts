import { GraphUI } from './graph';

/**
 * Frontend dashboard configuration with UI-specific fields.
 * Distinct from the backend `Dashboard` type in backend-graphql.ts which represents the API contract.
 */
export interface DashboardUI {
  id: string;
  name: string;
  layout: 'grid' | 'list';
  graphIds: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Grid layout properties for positioning items in the dashboard grid
 */
export interface GridLayout {
  gridColumn?: number; // Starting column (1-6)
  gridRow?: number; // Starting row (1-based)
  gridWidth?: number; // Width in columns (1-6)
  gridHeight?: number; // Height in rows (1+)
}

/**
 * A graph positioned within a dashboard grid.
 * Combines GraphUI configuration with grid layout positioning.
 */
export interface GridItem extends GraphUI, GridLayout {}
