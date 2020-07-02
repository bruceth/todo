// 在js里面，这是不需要的
// if (s), s 基本上就跟下面的判断等同
export function isNullOrUndefinedOrEmpty(str: string) {
  return str === undefined || str === null || str.length === 0 || str.trim().length === 0;
}