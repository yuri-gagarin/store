export function validateBusinessAccount (businessAccountId: string) {
  if (!businessAccountId) {
    return false;
  }
  return true;
}