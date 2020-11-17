interface GenData {
  
}
/**
 * Checks if the current object has set values
 * @param {Object} obj - Object to cycle
 * @returns {boolean} "True" if at least one property is set, "False" if none are set
 */
export const checkSetValues = <T extends GenData>(obj: T): boolean => {
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      const innerArr = obj[key] as unknown as Array<any>;
      if (innerArr.length > 0) {
        return true;
      }
    }
    if (obj[key] && typeof obj[key] === "string") {
      return true;
    }
  }
  return false;
};