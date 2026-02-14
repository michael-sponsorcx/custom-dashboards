/**
 * Organization Store
 *
 * Provides organization ID, dashboard ID, and user ID to all components
 * for multi-tenant support. For now, this uses default IDs in development,
 * but can be extended to support user authentication and dynamic selection.
 */

import { create } from 'zustand';

interface OrganizationStore {
  organizationId: string | undefined;
  dashboardId: string | undefined;
  userId: string | undefined;
  setOrganizationId: (id: string | undefined) => void;
  setDashboardId: (id: string | undefined) => void;
  setUserId: (id: string | undefined) => void;
}

// Default IDs for development/testing until auth is implemented
const DEFAULT_ORG_ID = '1';
const DEFAULT_USER_ID = '1196';

export const useOrganizationStore = create<OrganizationStore>((set) => ({
  organizationId: DEFAULT_ORG_ID,
  dashboardId: undefined,
  userId: DEFAULT_USER_ID,
  setOrganizationId: (id) => set({ organizationId: id }),
  setDashboardId: (id) => set({ dashboardId: id }),
  setUserId: (id) => set({ userId: id }),
}));
