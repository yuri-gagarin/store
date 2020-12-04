import chaiHTTP from "chai-http";
import chai, { expect } from "chai";
import User, { IUser, EMemberLevel } from "../../models/User";
import { clearDB, setupDB } from "../helpers/dbHelpers";
import { createUsers, generateMockUserData } from "../helpers/dataGeneration";
import { UserData } from "../../controllers/users_controller/type_declarations/usersControllerTypes";
import server from "../../server";
import { response } from "express";

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
      it("Should NOT register a new 'User' inf all the fields are empty and return proper error messages", (done) => {
        chai.request(server)
          .post("/api/users/register")
          .send({})
          .end((err, response) => {
            if (err) done(err);
            const messages: string[] = response.body.errorMessages;
            expect(response.status).to.equal(422);
            expect(response.body.jwtToken).to.be.undefined;
            expect(response.body.newUser).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(5);

            for (const message of messages) {
              expect(message).to.be.a("string");
            }
            done();
          });
      });
      it("Should NOT increase the count of 'User' model in the database", (done) => {
        User.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfUsers);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST UsersController 'register' action with invalid data //

    // TEST Users controller 'editRegistration' action without credentials //
    describe("PATCH '/api/users/updated/:userId' - User update WITHOUT a valid JWT token", () => {
      
      it("Should NOT allow an update without proper authorization", (done) => {
        chai.request(server)
          .patch("/api/users/update/" + String(createdUsers[0]._id))
          .send({})
          .end((err, response) => {
            if (err) done(err);
            expect(response.status).to.equal(401);
            expect(response.error.text).to.equal("Unauthorized");
            expect(response.body.editedUser).to.be.undefined;
            done();
          });
      });
      it("Should NOT modify the 'User' model in the database", (done) => {
        User.findOne({ _id: createdUsers[0]._id }).exec()
          .then((userModel) => {
            expect(JSON.stringify(userModel)).to.equal(JSON.stringify(createdUsers[0]));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT change the number of 'Users' in the database", (done) => {
        User.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfUsers);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST Users controller 'editRegistration' action without credentials //

    // TEST Users controller 'deleteRegistration' action without credentials //
    describe("DELETE '/api/users/delete/:userId' - User Delete WITHOUT a valid JWT token", () => {

      it("Should NOT allow a delete action without proper authorization", (done) => {
        chai.request(server)
          .delete("/api/users/delete/" + String(createdUsers[0]._id))
          .end((err, response) => {
            if (err) done(err);
            expect(response.status).to.equal(401);
            expect(response.error.text).to.equal("Unauthorized");
            expect(response.body.deletedUser).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove the 'User' model which was attempted to be deleted from the database", (done) => {
        User.exists({ _id: createdUsers[0]._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          })
      });
      it("Should not alter the number of 'User' models in the database", (done) => {
        User.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfUsers);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    })
    // END TEST Users controller 'deleteRegistration' action without credentials //
  });
  // END CONTEXT UsersController API tests without login or creadentials //

  // TEST CONTEXT UsersController API tests with valid login and credentials //
  context("'UsersController' API tests logged IN WITH JWT TOKEN", () => {
    let user: IUser;
    let secondUser: IUser;
    let jwtToken: string;

    before((done) => {
      User.find({}).limit(2).exec()
        .then((userArr) => {
          user = userArr[0];
          secondUser = userArr[1];
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    // login a user, set the jwt token //
    before((done) => {
      chai.request(server)
        .post("/api/users/login")
        .send({ 
          email: user.email,
          password: "password"
        })
        .end((err, res) => {
          if (err) done(err);
          jwtToken = res.body.jwtToken.token;
          done();
        });
    });
    // TEST User EDIT and DELETE actions on an account the DONT own //
    describe("'UsersController' 'editRegistration' and 'deleteRegistration' actions on an account they DONT OWN", () => {
      // TEST PATCH requests on a user model they dont own //
      describe("PATCH '/api/users/update/:userId' action on another Users' account", () => {
        it("Should NOT edit the account and send back the correct response", (done) => {
          chai.request(server)
            .patch("/api/users/update/" + String(secondUser._id))
            .set({
              "Authorization": jwtToken
            })
            .send({
              firstName: "new first name",
              oldPassword: "password"
            })
            .end((err, response) => {
              if (err) done(err);
              // asssert correct response //
              expect(response.status).to.equal(401);
              expect(response.body.responseMsg).to.be.a("string");
              expect(response.body.editedUser).to.be.undefined;
              expect(response.body.error).to.be.an("object");
              expect(response.body.errorMessages).to.be.an("array");
              expect(response.body.errorMessages[0]).to.be.a("string");
              done();
            });
        });
        it("Should NOT alter the 'User' model which was attemotet to be edited", (done) => {
          User.findOne({ _id: secondUser._id }).exec()
            .then((user) => {
              expect(JSON.stringify(user)).to.equal(JSON.stringify(secondUser));
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
        it("Should NOT alter the count of 'User' models in the database", (done) => {
          User.countDocuments().exec()
            .then((count) => {
              expect(count).to.equal(numberOfUsers);
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      })
      // END TEST PATCH request on a user model they dont own //

      // TEST DELETE request on a user model they dont own //
      describe("'/api/users/delete/:userId' action on another Users' account", () => {
        it("Should NOT delete the User account and send back the correct response", (done) => {
          chai.request(server)
            .delete("/api/users/delete/" + String(secondUser._id))
            .set({
              "Authorization": jwtToken
            })
            .end((err, response) => {
              if (err) done(err);
              expect(response.status).to.equal(401);
              expect(response.body.responseMsg).to.be.a("string");
              expect(response.body.deletedUser).to.be.undefined;
              expect(response.body.error).to.be.an("object");
              expect(response.body.errorMessages).to.be.an("array");
              expect(response.body.errorMessages[0]).to.be.a("string");
              done();
            });
        });
        it("Should keep the attempted deleted 'User' model in the database", (done) => {
          User.exists({ _id: secondUser._id })
            .then((exists) => {
              expect(exists).to.equal(true);
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
        it("Should NOT alter the number of 'User' model in the database", (done) => {
          User.countDocuments().exec()
            .then((number) => {
              expect(number).to.equal(numberOfUsers);
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      });
      // END DELETE request on a user model they dont own //
    });
    // END TEST User EDIT and DELETE actions on an account they DONT own //

    // TEST User EDIT and DELETE actions on an account they do own //
    describe("'UsersController' 'editRegistration' and 'deleteRegistration' actions on an account they DO OWN", () => {

    })
    // END TEST User EDIT and DELETE acions on an account they do own //

  });
  // END CONTEXT UsersController API tets with valid login and credentials //


})