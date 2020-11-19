import User from "../../../models/User";
import { UserData } from "../type_declarations/usersControllerTypes";

type ValidationResponse = {
  valid: boolean;
  errorMessages: string[];
}

export const validateNewUser = (data: UserData): ValidationResponse => {
  const validationRes: ValidationResponse = {
    valid: true,
    errorMessages: []
  }
  const { firstName, lastName, email, password, passwordConfirm }  = data;
  console.log(data)
  // validate first name //
  if (!firstName) {
    validationRes.valid = false;
    validationRes.errorMessages.push("A first name is required");
  }
  // validate last name //
  if (!lastName) {
    console.log(20)
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

export const checkDuplicateEmail = (email: string): Promise<ValidationResponse> => {
  return User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return {
          valid: false,
          errorMessages: [ "A user with this email already exists" ]
        };
      } else {
        return {
          valid: true,
          errorMessages: []
        };
      }
    })
    .catch((err: Error) => {
      throw err;
    });
}