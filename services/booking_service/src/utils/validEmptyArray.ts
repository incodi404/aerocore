export const validEmptyArray = (arr: any[]): boolean => {
  return !Array.isArray(arr) || arr.length === 0;
};
