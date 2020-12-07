
interface GenObject extends Object {
  [key:string]: any
}
/**
 * Checks if the current object has set values
 * @param {Object} obj - Object to cycle
 * @returns {boolean} "True" if at least one property is set, "False" if none are set
 */
/*
export const isEmptyObj = (obj: GenObject): boolean => {
  const keys = Object.keys
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      const innerArr = obj[key] as unknown as Array<any>;
      if (innerArr.length > 0) {
        return false;
      }
    }
    if (obj[key] && typeof obj[key] === "string") {
      return false;
    }
  }
  return true;
};
*/
export const isEmptyObj = (obj: Object): boolean => {
  const keys = Object.keys(obj);
  return ((keys.length > 0) ? false : true);
}