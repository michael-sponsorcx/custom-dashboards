import { GraphTemplate } from './graph';

export interface DashboardTemplate {
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
 * Dashboard item combines a graph template with its grid layout properties
 */
export interface DashboardItem extends GraphTemplate, GridLayout {}
