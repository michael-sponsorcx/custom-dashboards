/**
 * Organization Store
 *
 * Provides organization ID to all components for multi-tenant support.
 * For now, this uses a default organization ID, but can be extended
 * to support user authentication and dynamic organization selection.
 */

import { create } from 'zustand';

interface OrganizationStore {
  organizationId: string | undefined;
  dashboardId: string | undefined;
  setOrganizationId: (id: string | undefined) => void;
  setDashboardId: (id: string | undefined) => void;
}

export const useOrganizationStore = create<OrganizationStore>((set) => ({
  organizationId: undefined,
  dashboardId: undefined,
  setOrganizationId: (id) => set({ organizationId: id }),
  setDashboardId: (id) => set({ dashboardId: id }),
}));
