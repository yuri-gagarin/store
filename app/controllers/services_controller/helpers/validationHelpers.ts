import { ValidationResponse } from "../../types/generalControllerTypes";
import { ServiceData } from "../type_declarations/servicesControllerTypes";

export const validateServiceData = (data : ServiceData): ValidationResponse => {
  const { name, price, description } = data;
  let response: ValidationResponse = {
    valid: true,
    errorMessages: []
  };

  // validate service name //
  if (name) {
    if (name.length < 3) {
      response.valid = false;
      response.errorMessages.push("Service name field should be at least 3 characters");
    }
  } else {
    response.valid = false;
    response.errorMessages.push("Service name field is required to create or edit a Service");
  }

  // validate service price //
  if (!price) {
    response.valid = false;
    response.errorMessages.push("Service price field is required to create or edit a Service");
  }

  // validate description //
  if (description) {
    if (description.length < 10) {
      response.valid = false;
      response.errorMessages.push("Service description field should be at leat 10 characters");
    }
  } else {
    response.valid = false;
    response.errorMessages.push("Service description field is required to create or edit a Service");
  }

  return response;
};