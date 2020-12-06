import { ProductData } from "../type_declarations/productsControllerTypes";
import { ValidationResponse } from "../../types/generalControllerTypes";

export const validateProductData = ({ name, price, description, details } : ProductData): ValidationResponse => {
  let response: ValidationResponse = {
    valid: true,
    errorMessages: []
  }
  // validate name //
  if (!name) {
    response.valid = false;
    response.errorMessages.push("A new Product name is required");
  }
  // validate price //
  if (!price) {
    response.valid = false;
    response.errorMessages.push("A new Product price is required");
  }
  // validate description //
  if (description) {
    if(description.length < 5) {
      response.valid = false;
      response.errorMessages.push("A new Product description is too short, please type in at least 5 letters");
    }
  } else {
    response.valid = false;
    response.errorMessages.push("A new Product description field is required");
  }
  // validate details //
  if(details) {
    if (details.length) {
      response.valid = false;
      response.errorMessages.push("Please type in at least 5 letters into details field");
    } 
  } else {
    response.valid = false;
    response.errorMessages.push("A new Product details field is required");
  }

  return response;
};