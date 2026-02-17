/**
 * SavedView type for Stadium PageHeader compatibility.
 * Mirrors the production SavedView shape used by SavedViewsManager.
 */

export interface SavedView {
  id: string;
  name: string;
  pinned_view?: boolean;
  default_view_tag?: string;
  filters?: Record<string, unknown>;
  columnOrder?: string[];
  sorting?: unknown[];
  columnPinning?: Record<string, unknown>;
  columnVisibility?: Record<string, boolean>;
  columnWidths?: Record<string, number>;
  groupBy?: string;
  expanded?: unknown;
}
