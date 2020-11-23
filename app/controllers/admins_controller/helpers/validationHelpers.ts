import { AdminData } from "../type_declarations/adminsControllerTypes";

type ValidationResponse = {
  valid: boolean;
  errorMessages: string[]
}
export const validateAdminModel = (data: AdminData): ValidationResponse => {
  const validationRes: ValidationResponse = {
    valid: true,
    errorMessages: []
  }
  const { firstName, lastName, email, password, passwordConfirm }  = data;
  // validate first name //
  if (!firstName) {
    validationRes.valid = false;
    validationRes.errorMessages.push("A first name is required");
  }
  // validate last name //
  if (!lastName) {
    validationRes.valid = false;
    validationRes.errorMessages.push("A last name is required");
  }
  // validate email //
  if (!email) {
    validationRes.valid = false;
    validationRes.errorMessages.push("An email is required");
  }
  if(!password) {
    validationRes.valid = false;
    validationRes.errorMessages.push("A password is required");
  }
  if(!passwordConfirm) {
    validationRes.valid = false;
    validationRes.errorMessages.push("A password confirmation is required");
  }
  if (password && passwordConfirm) {
    if (password !== passwordConfirm) {
      validationRes.valid = false;
      validationRes.errorMessages.push("Your passwords do not match");
    }
  }
  return validationRes;
};