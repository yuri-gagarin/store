/**
 * Checks if the current object has set values
 * @param {Object} obj - Object to cycle
 * @returns {boolean} "True" if at least one property is set, "False" if none are set
 */
export const checkSetValues = <T extends Object>(obj: T): boolean => {
  for (const key in obj) {
    if (obj[key]) {
      return true;
    }
  }
  return false;
};