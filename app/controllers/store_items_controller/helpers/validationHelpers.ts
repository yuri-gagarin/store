import { StoreItemData } from "../type_declarations/storeItemsControllerTypes";
import { ValidationResponse } from "../../_types/generalControllerTypes";

export const validateStoreItems = (storeItemData: StoreItemData): ValidationResponse => {
  const { name, price, description, details, categories } = storeItemData;
  const response: ValidationResponse = {
    valid: false,
    errorMessages: []
  }
  // validate name field //
  if (name) {
    if (name.length < 3) {
      response.errorMessages.push("Store Item name field should be at least 3 characters");
    }
  } else {
    response.errorMessages.push("Store Item name field is required");
  }
  // validate price field
  if (!price) {
    response.errorMessages.push("Store Item price field is required");
  }
  // validate description field //
  if (description) {
    if (description.length <  10) {
      response.errorMessages.push("Store Item description field should be at least 10 characters");
    }
  } else {
    response.errorMessages.push("Store Item description field is required");
  }
  // validate details field //
  if (details) {
    if (details.length < 10) {
      response.errorMessages.push("Store Item details field should be at least 10 characters");
    }
  } else {
    response.errorMessages.push("Store Item details field is required");
  }
  // validate categories field //
  if (categories?.length === 0) {
    response.errorMessages.push("Please add at least one category for the Store Item");
  }
  response.valid = response.errorMessages.length === 0 ? true : false;
  return response;
};
