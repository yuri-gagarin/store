import { StoreItemParams } from "../store_items_controller/StoreItemsController";
type ValidationResponse = {
  isValid: boolean;
  errors: string[];
}
export const validateStoreItems = (storeItemData: StoreItemParams): ValidationResponse => {
  const { storeId, name, price, description, details } = storeItemData;
  const response: ValidationResponse = {
    isValid: false,
    errors: []
  }
  if (!storeId) {
    response.errors.push("Unable to resolve Store for new Item");
  }
  if (!name) {
    response.errors.push("Item name is required");
  }
  if (!price) {
    response.errors.push("Item Price is required");
  }
  if (!description) {
    response.errors.push("Item description is required");
  }
  if (description && description.length < 5) {
    response.errors.push("Item description length should be at least 5 chars");
  }
  if (!details) {
    response.errors.push("Item details is required");
  }
  if (details && details.length < 5) {
    response.errors.push("Item details length should be at least 5 chars");
  }
  response.isValid = response.errors.length === 0 ? true : false;
  return response;
};
