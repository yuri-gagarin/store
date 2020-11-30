import { expect } from "chai";
import faker from "faker";
import { UserData } from "../../../controllers/users_controller/type_declarations/usersControllerTypes";
import User, { IUser, MemberLevel } from "../../../models/User";
import { setupDB, clearDB } from "../../helpers/dbHelpers";

const generateMockUser = (): UserData => {
  const newUser: UserData = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: "password",
    passwordConfirm: "password",
  };
  return newUser;
};

describe("'User' model unit tests", () => {
  
  before((done) => {
    setupDB().then(() => done()).catch((err) => done(err));
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });

  describe("Valid 'User' model", () => {
    let mockUser: UserData;
    let createdUser: IUser;

    before(() => {
      mockUser = generateMockUser();
    })
    it("Should successfully create a new 'User' model", (done) => {
      User.create(mockUser)
        .then((user) => {
          createdUser = user;
          expect(createdUser instanceof User).to.eq(true);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it("Should correctly set the created and default valus on a new 'User' model", () =>{
      expect(createdUser._id).to.not.be.undefined;
      expect(createdUser.firstName).to.eql(mockUser.firstName);
      expect(createdUser.lastName).to.eql(mockUser.lastName);
      expect(createdUser.password).to.eql(mockUser.password);
      expect(createdUser.membershipLevel).to.eql(MemberLevel.Rookie);
      expect(createdUser.createdAt).to.be.a("string");
      expect(createdUser.editedAt).to.be.a("string");
    });
  });

  describe("Invalid 'User' model", () => {
    let mockUser: UserData;
    let secondMockUser: UserData;

    before(() => {
      mockUser = generateMockUser();
    });

    it("Should NOT create a new 'User' model without a 'firstName' property", (done) => {
      User.create({ ...mockUser, firstName: "" })
        .then(() => {})
        .catch((err) => {
          expect(err).to.not.be.undefined;
          expect(err instanceof Error).to.eq(true);
          done();
        });
    });
    it("Should NOT create a new 'User' model without a 'lastName' property", (done) => {
      User.create({ ...mockUser, lastName: "" })
        .then(() => {})
        .catch((err) => {
          expect(err).to.not.be.undefined;
          expect(err instanceof Error).to.eq(true);
          done();
        });
    });
    it("Should NOT create a new 'User' model without a 'password' property", (done) => {
      User.create({ ...mockUser, password: "" })
        .then(() => {})
        .catch((err) => {
          expect(err).to.not.be.undefined;
          expect(err instanceof Error).to.eq(true);
          done();
        });
    });
    it("Should NOT create a new 'User' model if an email already exists in the DB", (done) => {
      secondMockUser = generateMockUser();
      secondMockUser.email = "email";
      mockUser.email = "email";

      User.create(mockUser)
        .then((_) => {
          return User.create(secondMockUser);
        })
        .then(() => {})
        .catch((err) => {
          expect(err).to.not.be.undefined;
          expect(err instanceof Error).to.eq(true);
          done();
        });
    });
  });

});