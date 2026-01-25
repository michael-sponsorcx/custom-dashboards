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

const isDevelopment = process.env.NODE_ENV === 'development';

export const useOrganizationStore = create<OrganizationStore>((set) => ({
  organizationId: isDevelopment ? '3' : undefined,
  dashboardId: isDevelopment ? '3' : undefined,
  userId: isDevelopment ? '3' : undefined,
  setOrganizationId: (id) => set({ organizationId: id }),
  setDashboardId: (id) => set({ dashboardId: id }),
  setUserId: (id) => set({ userId: id }),
}));
