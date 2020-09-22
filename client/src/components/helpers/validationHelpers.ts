export const checkSetValues = <T extends Object>(obj: T): boolean => {
  for (const key in obj) {
    if (obj[key]) {
      return true;
    }
  }
  return false;
};