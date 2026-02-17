// Minimal helpers required by stadiumDS
// Add more as needed from the source project

/**
 * Returns the date input format string for Mantine DateInput component.
 * Defaults to US format (MM/DD/YY).
 */
export const getDateInputFormat = (): string => {
  return 'MM/DD/YY';
};

/**
 * Deep equality check for two values.
 */
export const deepEqual = (a: unknown, b: unknown): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

/**
 * Adds an item to an array if not present, removes it if already present.
 */
export const deleteOrAdd = <T>(arr: T[], item: T): T[] => {
  const index = arr.indexOf(item);
  if (index >= 0) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }
  return [...arr, item];
};