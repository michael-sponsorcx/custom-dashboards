/**
 * Stub for Stadium Zustand store compatibility.
 * Stadium components import useStore from '@/state' — this provides a minimal implementation.
 */

const state = {
  organization: { id: '', name: '' },
  sidebarCollapsed: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSidebarCollapsed: (_collapsed: boolean) => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setOrganization: (_org: { id: string; name: string }) => {},
};

const useStore = <T>(selector: (s: typeof state) => T): T => selector(state);

export default useStore;
