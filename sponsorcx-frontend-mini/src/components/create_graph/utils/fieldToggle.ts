/**
 * Field Toggle Utilities
 *
 * Generic utilities for toggling Set-based field selections.
 * Eliminates repetitive toggle handler code.
 */

/**
 * Creates a toggle function for a Set-based state
 *
 * @param setter - State setter function
 * @returns Toggle function that adds/removes items from the set
 */
export function createSetToggler<T>(
  setter: React.Dispatch<React.SetStateAction<Set<T>>>
): (item: T) => void {
  return (item: T) => {
    setter(prev => {
      const newSet = new Set(prev);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      return newSet;
    });
  };
}

/**
 * Creates a clear function for a Set-based state
 *
 * @param setter - State setter function
 * @returns Clear function that empties the set
 */
export function createSetClearer<T>(
  setter: React.Dispatch<React.SetStateAction<Set<T>>>
): () => void {
  return () => setter(new Set());
}
