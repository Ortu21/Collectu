/**
 * Utility functions to handle circular references in JSON responses from .NET backend
 */

/**
 * Safely extracts an array from a potentially circular reference structure
 * @param data The data that might contain a $values property or already be an array
 * @param defaultValue Default value to return if data cannot be extracted
 * @returns The extracted array or the default value
 */
export const extractArray = <T>(data: any, defaultValue: T[] = []): T[] => {
  if (!data) {
    return defaultValue;
  }
  
  // If data is already an array, return it
  if (Array.isArray(data)) {
    return data;
  }
  
  // If data has $values property and it's an array, return it
  if (data.$values && Array.isArray(data.$values)) {
    return data.$values;
  }
  
  // Return default value if we couldn't extract an array
  console.warn('Could not extract array from data:', data);
  return defaultValue;
};

/**
 * Safely extracts a single object from a potentially circular reference structure
 * @param data The data that might be wrapped in a $values array or have circular references
 * @param defaultValue Default value to return if data cannot be extracted
 * @returns The extracted object or the default value
 */
export const extractObject = <T>(data: any, defaultValue: T | null = null): T | null => {
  if (!data) {
    return defaultValue;
  }
  
  // If data has $values property and it's an array with at least one element
  if (data.$values && Array.isArray(data.$values) && data.$values.length > 0) {
    return data.$values[0];
  }
  
  // If data has $ref property, it's a circular reference, return default
  if (data.$ref) {
    console.warn('Circular reference detected:', data);
    return defaultValue;
  }
  
  // Otherwise, return the data itself
  return data;
};

/**
 * Safely accesses a property that might be undefined or null
 * @param obj The object to access a property from
 * @param key The property key to access
 * @param defaultValue Default value to return if property doesn't exist
 * @returns The property value or the default value
 */
export const safeAccess = <T, K extends keyof T>(obj: T | null | undefined, key: K, defaultValue: T[K] | null = null): T[K] | null => {
  if (!obj) {
    return defaultValue;
  }
  
  return obj[key] !== undefined ? obj[key] : defaultValue;
};

/**
 * Maps an array of objects, handling potential circular references
 * @param data The data that might contain a $values property or already be an array
 * @param mapFn The mapping function to apply to each item
 * @param defaultValue Default value to return if data cannot be mapped
 * @returns The mapped array or the default value
 */
export const mapArray = <T, R>(data: any, mapFn: (item: any) => R, defaultValue: R[] = []): R[] => {
  const array = extractArray(data, []);
  if (array.length === 0) {
    return defaultValue;
  }
  
  try {
    return array.map(mapFn);
  } catch (error) {
    console.error('Error mapping array:', error);
    return defaultValue;
  }
};