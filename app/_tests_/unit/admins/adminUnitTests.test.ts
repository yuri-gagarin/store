import { expect } from "chai";
import { Error as MongooseErrors } from "mongoose";
import faker from "faker";
import { AdminData } from "../../../controllers/admins_controller/type_declarations/adminsControllerTypes";
import Admin, { IAdministrator, EAdminLevel } from "../../../models/Administrator";
import { setupDB, clearDB } from "../../helpers/dbHelpers";

const { ValidationError } = MongooseErrors

const generateMockAdmin = (): AdminData => {
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

describe("'Administrator' model unit tests", () => {

  before((done) => {
    setupDB().then(() => done()).catch((err) => done(err));
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });

  describe("Valid 'Admin' model", () => {
    let mockAdmin: AdminData;
    let createdAdmin: IAdministrator;

    before(() => {
      mockAdmin = generateMockAdmin();
    })
    it("Should successfully create a new 'Admin' model", (done) => {
      Admin.create(mockAdmin)
        .then((user) => {
          createdAdmin = user;
          expect(createdAdmin instanceof Admin).to.eq(true);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it("Should correctly set the created and default valus on a new 'Admin' model", () =>{
      expect(createdAdmin._id).to.not.be.undefined;
      expect(createdAdmin.firstName).to.eql(mockAdmin.firstName);
      expect(createdAdmin.lastName).to.eql(mockAdmin.lastName);
      expect(createdAdmin.password).to.eql(mockAdmin.password);
      expect(createdAdmin.adminLevel).to.eql(EAdminLevel.Administrator);
      expect(createdAdmin.approved).to.eql(false);
      expect(createdAdmin.createdAt instanceof Date).to.eq(true);
      expect(createdAdmin.editedAt instanceof Date).to.eq(true);
    });
  });

  describe("Invalid 'Admin' model", () => {
    let mockAdmin: AdminData;
    let secondMockAdmin: AdminData;

    before(() => {
      mockAdmin = generateMockAdmin();
    });

    it("Should NOT create a new 'Admin' model without a 'firstName' property", (done) => {
      Admin.create({ ...mockAdmin, firstName: "" })
        .then(() => {})
        .catch((err) => {
          expect(err).to.not.be.undefined;
          expect(err instanceof ValidationError).to.eq(true);
          expect(err.errors).to.haveOwnProperty("firstName");
          expect(err.errors.firstName.message).to.be.a("string");
          done();
        });
    });
    it("Should NOT create a new 'Admin' model without a 'lastName' property", (done) => {
      Admin.create({ ...mockAdmin, lastName: "" })
        .then(() => {})
        .catch((err) => {
          expect(err).to.not.be.undefined;
          expect(err instanceof ValidationError).to.eq(true);
          expect(err.errors).to.haveOwnProperty("lastName");
          expect(err.errors.lastName.message).to.be.a("string");
          done();
        });
    });
    it("Should NOT create a new 'Admin' model without a 'password' property", (done) => {
      Admin.create({ ...mockAdmin, password: "" })
        .then(() => {})
        .catch((err) => {
          expect(err).to.not.be.undefined;
          expect(err instanceof ValidationError).to.eq(true);
          expect(err.errors).to.haveOwnProperty("password");
          expect(err.errors.password.message).to.be.a("string");
          done();
        });
    });
    it("Should NOT create a new 'Admin' model if an email already exists in the DB", (done) => {
      mockAdmin.email = "email";
      secondMockAdmin = generateMockAdmin();
      secondMockAdmin.email = "email";

      Admin.create(mockAdmin)
        .then((_) => Admin.create(secondMockAdmin))
        .catch((err) => {
          expect(err).to.not.be.undefined;
          expect(err instanceof ValidationError).to.eq(true);
          expect(err.errors).to.haveOwnProperty("email");
          expect(err.errors.email.message).to.be.a("string");
          done();
        });
    });
    it("Should NOT create a new 'Admin' model with a duplicate 'handle' field", (done) => {
      mockAdmin.email = faker.internet.email();
      mockAdmin.handle = "handle";
      // second mock admin model with duplicate handle //
      secondMockAdmin.email = faker.internet.email();
      secondMockAdmin.handle = "handle";

      Admin.create(mockAdmin)
        .then((_) => Admin.create(secondMockAdmin))
        .catch((err) => {
          //console.log(error.ValidationError.messages)
          expect(err).to.not.be.undefined;
          expect(err instanceof ValidationError).to.eq(true);
          expect(err.errors).to.haveOwnProperty("handle");
          expect(err.errors.handle.message).to.be.a("string");
          done();
        });
    });
  });

});