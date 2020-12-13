import { StoreData } from "../type_declarations/storesControllerTypes";
import { ValidationResponse } from "../../_types/generalControllerTypes";

export const storeDataValidator = ({ title, description }: StoreData): ValidationResponse => {
  let response: ValidationResponse = {
    valid: true,
    errorMessages: []
  };

  // validate store title //
  if (title) {
    if (title.length < 3) {
      response.valid = false;
      response.errorMessages.push("Store title must be at least 3 characters");
    }
  } else {
    response.valid = false;
    response.errorMessages.push("Store title is a required field");
  }
  // validate store description //
  if (description) {
    if (description.length < 10) {
      response.valid = false;
      response.errorMessages.push("Store desicription must be at least 10 characters");
    }
  } else {
    response.valid = false;
    response.errorMessages.push("Store description is a required field");
  }
  return response;
};