export function isNullOrUndefinedOrEmpty(str: string) {
  return str === undefined || str === null || str.length === 0 || str.trim().length === 0;
}