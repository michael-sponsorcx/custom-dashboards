/**
 * Context stubs for Stadium PageHeader compatibility.
 * PageHeader imports UserContext — this provides a minimal implementation.
 */

import { createContext } from 'react';

interface User {
  id: string;
  name?: string;
  email?: string;
}

interface UserContextType {
  user: User | null;
}

export const UserContext = createContext<UserContextType>({ user: null });
