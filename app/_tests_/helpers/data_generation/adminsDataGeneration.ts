import faker from "faker";
import bcrypt from "bcrypt";
import Administrator, { IAdministrator } from "../../../models/Administrator";
// additional interfaces //
import { AdminData } from "../../../controllers/admins_controller/type_declarations/adminsControllerTypes";

/**
 * Generates mock data for an 'Administrator' model.
 * @returns - <AdminData> object.
 */
export const generateMockAdminData = (): AdminData => {
  const newAdmin: AdminData = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    handle: faker.internet.userName(),
    email: faker.internet.email(),
    password: "password",
    passwordConfirm: "password",
  };
  return newAdmin;
};

/**
 * Creates a specific number of 'Administartor' models in the database.
 * @param number - Number of 'Administrator' models to create.
 * @returns <Promise<IAdministartor[]>> a Promise resolving to an an array of 'IAdministrator' models.
 */
export const createAdmins = async (number: number): Promise<IAdministrator[]> => {
  const createdAdminPromises: Promise<IAdministrator>[] = [];
  for (let i = 0; i < number; i++) {
    const adminData: AdminData = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      handle: faker.internet.userName(),
      email: faker.internet.email(),
      password: "password",
      passwordConfirm: "password"
    }
    const passwordHash = await new Promise<string>((res, rej) => {
      bcrypt.hash(adminData.password, 10, (err, passHash) => {
        res(passHash)
      })
    })
    createdAdminPromises.push(
      Administrator.create({
        ...adminData,
        password: passwordHash
      })
    );
  }
  return Promise.all(createdAdminPromises);
};