import chaiHTTP from "chai-http";
import chai, { expect } from "chai";
import User, { IUser, EMemberLevel } from "../../models/User";
import { clearDB, setupDB } from "../helpers/dbHelpers";
import { createUsers, generateMockUserData } from "../helpers/dataGeneration";
import { UserData } from "../../controllers/users_controller/type_declarations/usersControllerTypes";
import server from "../../server";
import { IAdministrator } from "../../models/Administrator";

chai.use(chaiHTTP);

describe("'UsersController' API tests", () => {
  let createdUsers: IUser[];
  let numberOfUsers: number;

  before( function(done) {
    this.timeout(5000);
    setupDB()
      .then(() => {
        return createUsers(5);
      })
      .then((users) => {
        createdUsers = users;
        return User.countDocuments().exec();
      })
      .then((number) => {
        numberOfUsers = number;
        done();
      })
      .catch((err) => { done(err) });
  });
  after( function(done) {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  // CONTEXT UsersController API tests without login or credentials //
  context("'UsersController' API tests NOT logged in (no JWT token)", () => {
    // TEST UsersController 'register' action with valid data //
    describe("POST '/api/users/register' - New User registration - VALID data", () => {
      let userData: UserData;
      let newUser: IUser;
      let jwtToken: {
        token: string;
        expiresIn: string;
      };

      before(() => {
        userData = generateMockUserData();
      });

      it("Should successfully register a new 'User'", (done) => {
        chai.request(server)
          .post("/api/users/register")
          .send(userData)
          .end((err, response) => {
            if (err) done(err);
            expect(response.status).to.equal(200);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.newUser).to.be.an("object");
            expect(response.body.jwtToken).to.be.an("object");
            expect(response.body.error).to.be.undefined;
            expect(response.body.errorMessages).to.be.undefined;
            newUser = response.body.newUser;
            jwtToken = response.body.jwtToken;
            done();
          });
      });
      
      it("Should send back the correct 'User' model and corect data", () => {
        expect(newUser.firstName).to.equal(userData.firstName);
        expect(newUser.lastName).to.equal(userData.lastName);
        expect(newUser.email).to.equal(userData.email);
        expect(newUser.handle).to.equal(userData.handle);
        expect(newUser.membershipLevel).to.equal(EMemberLevel.Rookie);
        expect(newUser.createdAt).to.be.a("string");
        expect(newUser.editedAt).to.be.a("string");
      });
      it("Should correctly issue a JWT token", () => {
        expect(jwtToken.token).to.be.a("string");
        expect(jwtToken.expiresIn).to.be.a("string");
      });
      it("Should increase the number of 'User' models by one", (done) => {
        User.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfUsers + 1);
            numberOfUsers = number;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST UsersController 'register' action with valid data //
    // TEST UsersController 'register' action with invalid data //
    
    describe("POST '/api/users/register - New User registration - INVALID data", () => {
      let userData: UserData;
      let existingUser: IUser;

      before(() => {
        userData = generateMockUserData();
      });
      before((done) => {
        User.findOne({}).exec()
          .then((user) => {
            existingUser = user!;
            done();
          })
          .catch((err) => done(err));
      })

      it("Should NOT register a new 'User' without a 'firstName' property", (done) => {
        chai.request(server)
          .post("/api/users/register")
          .send({
            ...userData,
            firstName: ""
          })
          .end((err, response) => {
            if (err) done(err);
            expect(response.status).to.equal(422);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            expect(response.body.newUser).to.be.undefined;
            expect(response.body.jwtToken).to.be.undefined;
            done();
          });
      });
      it("Should NOT register a new 'User' without a 'lastName' property", (done) => {
        chai.request(server)
          .post("/api/users/register")
          .send({
            ...userData,
            lastName: ""
          })
          .end((err, response) => {
            if (err) done(err);
            expect(response.status).to.equal(422);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            expect(response.body.newUser).to.be.undefined;
            expect(response.body.jwtToken).to.be.undefined;
            done();
          });
      });
      it("Should NOT register a new 'User' without an 'email' property", (done) => {
        chai.request(server)
          .post("/api/users/register")
          .send({
            ...userData,
            email: ""
          })
          .end((err, response) => {
            if (err) done(err);
            expect(response.status).to.equal(422);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            expect(response.body.newUser).to.be.undefined;
            expect(response.body.jwtToken).to.be.undefined;
            done();
          });
      });
      it("Should NOT register a new 'User' with a duplicate 'email' property", (done) => {
        chai.request(server)
          .post("/api/users/register")
          .send({
            ...userData,
            email: existingUser.email
          })
          .end((err, response) => {
            if (err) done(err);
            expect(response.status).to.equal(422);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            expect(response.body.newUser).to.be.undefined;
            expect(response.body.jwtToken).to.be.undefined;
            done();
          });
      });
      it("Should NOT register a new 'User' without a 'password' property", (done) => {
        chai.request(server)
          .post("/api/users/register")
          .send({
            ...userData,
            password: ""
          })
          .end((err, response) => {
            if (err) done(err);
            expect(response.status).to.equal(422);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            expect(response.body.newUser).to.be.undefined;
            expect(response.body.jwtToken).to.be.undefined;
            done();
          });
      });
      it("Should NOT register a new 'User' without a 'passwordConfirm' property", (done) => {
        chai.request(server)
          .post("/api/users/register")
          .send({
            ...userData,
            passwordConfirm: ""
          })
          .end((err, response) => {
            if (err) done(err);
            expect(response.status).to.equal(422);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            expect(response.body.newUser).to.be.undefined;
            expect(response.body.jwtToken).to.be.undefined;
            done();
          });
      });
      it("Should NOT register a new 'User' if 'password' and 'passwordConfirm' properties do not match", (done) => {
        chai.request(server)
          .post("/api/users/register")
          .send({
            ...userData,
            passwordConfirm: "definitelynotamatch"
          })
          .end((err, response) => {
            if (err) done(err);
            expect(response.status).to.equal(422);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            expect(response.body.newUser).to.be.undefined;
            expect(response.body.jwtToken).to.be.undefined;
            done();
          });
      });
    });
    
    // END TEST UsersController 'register' action with invalid data //

  });
  // END 
})