import chaiHTTP from "chai-http";
import chai, { expect, use } from "chai";
import { Response } from "express";
import fs from "fs";
// server, models //
import server from "../../server";
import Administrator, { IAdministrator, EAdminLevel } from "../../models/Administrator";
import { setupDB, clearDB } from "../helpers/dbHelpers";
import { createAdmins, generateMockAdminData } from "../helpers/dataGeneration";
import { AdminData } from "../../controllers/admins_controller/type_declarations/adminsControllerTypes";
import { Error } from "mongoose";
import { keyword } from "chalk";
import { UserData } from "../../controllers/users_controller/type_declarations/usersControllerTypes";

chai.use(chaiHTTP);

describe("Administrator API tests", () => {
  let createdAdmins: IAdministrator[];
  let numberOfAdmins: number;

  before(function(done) {
    // longer timeout for data generation (default is 2000ms) //
    this.timeout(5000);
    setupDB()
      .then(() => {
        return createAdmins(5);
      })
      .then((admins) => {
        createdAdmins = admins;
        return Administrator.countDocuments().exec();
      })
      .then((number) => {
        numberOfAdmins = number;
        done();
      })
      .catch((err) => { done (err) });
  });
  after(function(done) {
    clearDB().then(() => done()).catch(err => done(err));
  });

  // CONTEXT Administrator API tests without login/authorization //
  context("Administrator API tests NOT logged in (no JWT token)", () => {
    // TEST new Administrator CREATE API Action valid data //
    describe("POST '/api/admins/register' - New Administrator registration with valid data", () => {
      let adminData: AdminData; 
      let newAdmin: IAdministrator;
      let jwtToken: {
        token: string;
        expiresIn: string;
      };

      before(() => {
        adminData = generateMockAdminData();
      });
      
      it("Should successfullly register a new Administrator", (done) => {
        chai.request(server)
          .post("/api/admins/register")
          .send(adminData)
          .end((err, res) => {
            if(err) {
              done(err)
            }
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.newAdmin).to.be.an("object");
            expect(res.body.jwtToken).to.be.an("object");
            newAdmin = res.body.newAdmin;
            jwtToken = res.body.jwtToken;
            done();
          });
      });
      it("Should send back the correct data", () => {
        expect(newAdmin.firstName).to.equal(adminData.firstName);
        expect(newAdmin.lastName).to.equal(adminData.lastName);
        expect(newAdmin.email).to.equal(adminData.email);
        expect(newAdmin.handle).to.equal(adminData.handle);
        expect(newAdmin.approved).to.equal(false);
        expect(newAdmin.adminLevel).to.equal(EAdminLevel.Moderator);
        expect(newAdmin.createdAt).to.be.a("string");
        expect(newAdmin.editedAt).to.be.a("string");
      });
      it("Should correctly issue a JWT token", () => {
        expect(jwtToken.token).to.be.a("string");
        expect(jwtToken.expiresIn).to.be.a("string");
      });
      it("Should increast the number of 'Administrator' model by 1", (done) => {
        Administrator.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfAdmins + 1);
            numberOfAdmins = number;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST new Administrator CREATE API Action valid data //
    // TEST new Administrator REGISTER API Action invalid data //
    describe("POST '/api/admins/register' New Administrator registration with INVALID data", () => {
      let adminData: AdminData; 
  
      before(() => {
        adminData = generateMockAdminData();
      });

      it("Should NOT register a new Admin without a 'firstName' property", (done) => {
        chai.request(server)
          .post("/api/admins/register")
          .send({
            ...adminData,
            firstName: ""
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(422)
            expect(res.body.jwtToken).to.be.undefined;
            expect(res.body.newAdmin).to.be.undefined;
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT register a new Administrator without a 'lastName' property", (done) => {
        chai.request(server)
          .post("/api/admins/register")
          .send({
            ...adminData,
            lastName: ""
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(422);
            expect(res.body.jwtToken).to.be.undefined;
            expect(res.body.newAdmin).to.be.undefined;
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages[0]).to.be.a("string");
            done();
          });       
      });
      it("Should NOT register a new Administrator without an 'email' property", (done) => {
        chai.request(server)
          .post("/api/admins/register")
          .send({
            ...adminData,
            email: ""
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(422);
            expect(res.body.jwtToken).to.be.undefined;
            expect(res.body.newAdmin).to.be.undefined;
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT register a new Administrator if an email already exists in database", (done) => {
        let dataWithDuplicateEmail: AdminData;
        Administrator.find({}).limit(1).exec()
          .then((admin) => {
            dataWithDuplicateEmail = {
              ...adminData,
              email: admin[0].email
            }
            return Promise.resolve();
          })
          .then((_) => {
            chai.request(server)
              .post("/api/admins/register")
              .send({
                ...dataWithDuplicateEmail
              })
              .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(400);
                expect(res.body.jwtToken).to.be.undefined;
                expect(res.body.newAdmin).to.be.undefined;
                expect(res.body.responseMsg).to.be.a("string");
                expect(res.body.error).to.be.an("object");
                expect(res.body.errorMessages).to.be.an("array");
                expect(res.body.errorMessages[0]).to.be.a("string");                
                done();
              });
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT register a new Administrator without a 'password' property", (done) => {
        chai.request(server)
          .post("/api/admins/register")
          .send({
            ...adminData,
            password: ""
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(422);
            expect(res.body.jwtToken).to.be.undefined;
            expect(res.body.newAdmin).to.be.undefined;
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages[0]).to.be.a("string");  
            done();
          });
      });
      it("Should NOT register a new Administrator without a 'passwordConfirm' property", (done) => {
        chai.request(server)
          .post("/api/admins/register")
          .send({
            ...adminData,
            passwordConfirm: ""
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(422);
            expect(res.body.jwtToken).to.be.undefined;
            expect(res.body.newAdmin).to.be.undefined;
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages[0]).to.be.a("string");  
            done();
          });
      });
      it("Should NOT register a new Administrator if 'password' and 'passwordConfirm' properties do not match", (done) => {
        chai.request(server)
          .post("/api/admins/register")
          .send({
            ...adminData,
            password: "password",
            passwordConfirm: "password1"
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(422);
            expect(res.body.jwtToken).to.be.undefined;
            expect(res.body.newAdmin).to.be.undefined;
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages[0]).to.be.a("string");  
            done();
          });
      });
      it("Should NOT register a new Administrator if all fields are empty and return proper error messages", (done) => {
        chai.request(server)
          .post("/api/admins/register")
          .send({})
          .end((err, res) => {
            if (err) done(err);
            const messages: string[] = res.body.errorMessages;
            expect(res.status).to.equal(422);
            expect(res.body.jwtToken).to.be.undefined;
            expect(res.body.newAdmin).to.be.undefined;
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(5);

            for (const message of messages) {
              expect(message).to.be.a("string");
            }

            done();
          });
      });
      it("Should NOT increase the count of Administrator models in the database", (done) => {
        Administrator.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfAdmins);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST new Administrator REGISTER API Action invalid data //
    // TEST update Administrator  EDIT_REGISTRATION Action invalid data //
    describe("PATCH '/api/admins/update/:adminId' - 'Administrator' update with valid data", () => {
      let foundAdmin: IAdministrator;
      let adminUpdate: AdminData;

      before((done) => {
       
        Administrator.find({}).limit(1).exec()
          .then((admins) => {
            foundAdmin = admins[0];
            adminUpdate = {
              firstName: "First",
              lastName: "Last",
              email: foundAdmin.email,
              password: "password",
              passwordConfirm: "password"
            }
            done();
          })
          .catch((err) => { 
            done(err);
          });
      });

      it("Should not allow an update without proper authorization", (done) => {
        chai.request(server)
          .patch("/api/admins/update/" + (foundAdmin._id as string))
          .send(adminUpdate)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            done();
          });
      });
      it("Should NOT modify the 'Administrator' model in the database", (done) => {
        Administrator.findOne({ _id: foundAdmin._id })
          .then((adminModel) => {
            expect(JSON.stringify(adminModel)).to.equal(JSON.stringify(foundAdmin));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT change the number of 'Administrator' models in the database", (done) => {
        Administrator.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfAdmins);
            done();
          })
          .catch((err) => done(err));
      });
    });
    // END TEST update Administrator  EDIT_REGISTRATION Action invalid data //
    // TEST delete Administrator DELETE_REGISTRATION Action //
    describe("DELETE '/api/admins/delete/:adminId", () => {
      let foundAdmin: IAdministrator;

      before((done) => {
        Administrator.find({}).limit(1).exec()
          .then((adminArr) => {
            foundAdmin = adminArr[0];
            done();
          })
          .catch((err) => done(err));
      });

      it("Should NOT allow a DELETE action without proper authorization", (done) => {
        chai.request(server)
          .delete("/api/admins/delete/" + (foundAdmin._id as string))
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            done();            
          });
      });
      it("Should not remove the particular 'Admininstrator' model from the database", (done) => {
        Administrator.exists({ _id: foundAdmin._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should not alter the number of 'Administrator' models", (done) => {
        Administrator.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfAdmins);
            done();
          })
          .catch((err) => {
            done(err);
          })
      })
    })
  });
  // END CONTEXT Administrator API tests without login/authorization //
  // CONTEXT Administrator LOGIN / LOGOUT tests //
  
  context("Administrator API tests LOGIN/LOGOUT functionality", () => {
    // TEST POST Administrator LOGIN functionallity with valid credentials //
    describe("POST '/api/admins/login' - LOGIN with VALID credentials", () => {
      let admin: IAdministrator;
      let adminResponse: IAdministrator;
      let jwtToken: {
        token: string;
        expiresIn: string;
      };

      before((done) => {
        Administrator.find({}).limit(1).exec()
          .then((adminArr) => {
            admin = adminArr[0];
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

      it("Should properly respond to a login request, send correct response", (done) => {
        chai.request(server)
          .post("/api/admins/login")
          .send({
            email: admin.email,
            password: "password"
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.admin).to.be.an("object");
            expect(res.body.success).to.equal(true);
            expect(res.body.jwtToken).to.be.an("object");
            // assign for assertion //
            adminResponse = res.body.admin;
            jwtToken = res.body.jwtToken;
            done();
          });
      });
      it("Should send back correct 'Administrator' data", () => {
       expect(JSON.stringify(admin)).to.equal(JSON.stringify(adminResponse));
      });
      it("Should send back a correct JWT token response", () => {
        expect(jwtToken.token).to.be.a("string");
        expect(jwtToken.expiresIn).to.be.a("string");
      });
    });
    // END TEST POST Administrator LOGIN functionallity with valid credentials //
    // TEST POST Administrator LOGIN functionallity with invalid credentials //
    describe("POST '/api/admins/login - LOGIN with INVALID credentials", () => {

      let admin: IAdministrator;
      let adminResponse: IAdministrator;
      let jwtToken: {
        token: string;
        expiresIn: string;
      };

      before((done) => {
        Administrator.find({}).limit(1).exec()
          .then((adminArr) => {
            admin = adminArr[0];
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      // TEST login without an email sent //
      describe("Attempted LOGIN without an email", () => {

        it("Should properly respond to a LOGIN request WITHOUT an email", (done) => {
          chai.request(server)
            .post("/api/admins/login")
            .send({
              email: "",
              password: "password"
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(422);
              expect(res.body.responseMsg).to.be.a("string");
              expect(res.body.errorMessages).to.be.an("array");
              expect(res.body.errorMessages[0]).to.be.a("string");
              // assign undefined values //
              adminResponse = res.body.admin;
              jwtToken = res.body.jwtToken;
              done();
            });
        });
        it("Should NOT send back any 'Administrator' data", () => {
          expect(adminResponse).to.be.undefined;
        });
        it("Should NOT send back any JWT token response", () => {
          expect(jwtToken).to.be.undefined;
        });

      });
      // END TEST login without an email sent //
      // TEST login without a password sent //
      describe("Attempted LOGIN without a password", () => {

        it("Should properly respond to a LOGIN request WITHOUT a password", (done) => {
          chai.request(server)
            .post("/api/admins/login")
            .send({
              email: admin.email,
              password: " "
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(422);
              expect(res.body.responseMsg).to.be.a("string");
              expect(res.body.errorMessages).to.be.an("array");
              expect(res.body.errorMessages[0]).to.be.a("string");
              // assign undefined values //
              adminResponse = res.body.admin;
              jwtToken = res.body.jwtToken;
              done();
            });
        });
        it("Should NOT send back any 'Administrator' data", () => {
          expect(adminResponse).to.be.undefined;
        });
        it("Should NOT send back any JWT token response", () => {
          expect(jwtToken).to.be.undefined;
        });

      });
      // END TEST login without a password sent //
      // TEST login with an incorrect email sent //
      describe("Attempted LOGIN with an INCORRECT email", () => {

        it("Should properly respond to a LOGIN request withn an INCORRECT emai", (done) => {
          chai.request(server)
            .post("/api/admins/login")
            .send({
              email: "thisdoesnotexist",
              password: "password"
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(404);
              expect(res.body.responseMsg).to.be.a("string");
              expect(res.body.errorMessages).to.be.an("array");
              expect(res.body.errorMessages[0]).to.be.a("string");
              // assign undefined values //
              adminResponse = res.body.admin;
              jwtToken = res.body.jwtToken;
              done();
            });
        });
        it("Should NOT send back any 'Administrator' data", () => {
          expect(adminResponse).to.be.undefined;
        });
        it("Should NOT send back any JWT token response", () => {
          expect(jwtToken).to.be.undefined;
        });

      });
      // END TEST login with an incorrect email sent //
      // TEST login with an incorrect password sent //
      describe("Attempted LOGIN with an INCORRECT password", () => {

        it("Should properly respond to a LOGIN request with an INCORRECT password", (done) => {
          chai.request(server)
            .post("/api/admins/login")
            .send({
              email: admin.email,
              password: "definitelywrong"
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(401);
              expect(res.body.responseMsg).to.be.a("string");
              expect(res.body.errorMessages).to.be.an("array");
              expect(res.body.errorMessages[0]).to.be.a("string");
              // assign undefined values //
              adminResponse = res.body.admin;
              jwtToken = res.body.jwtToken;
              done();
            });
        });
        it("Should NOT send back any 'Administrator' data", () => {
          expect(adminResponse).to.be.undefined;
        });
        it("Should NOT send back any JWT token response", () => {
          expect(jwtToken).to.be.undefined;
        });

      });
      // END TEST login with an incorrect password sent //
    });
    // END TEST POST Administrator LOGIN functionality with invalid credentials //
  });
  // END CONTEXT Administrator LOGIN / LOGOUT tests //
  
  // CONTEXT AdminsController API tests logged in //
  context("Administrator API tests logged in (with JWT token)", () => {
    let admin: IAdministrator;
    let secondAdmin: IAdministrator;
    let jwtToken: string;

    before((done) => {
      Administrator.find({}).limit(2).exec()
        .then((adminArr) => {
          admin = adminArr[0];
          secondAdmin = adminArr[1];
          done();
        })
        .catch((err) => done(err));
    });
    // login an admin and get back a jwtToken //
    before((done) => {
      chai.request(server)
        .post("/api/admins/login")
        .send({
          email: admin.email,
          password: "password"
        })
        .end((err, res) => {
          if (err) done(err);
          jwtToken = res.body.jwtToken.token;
          done()
        });
    });

    describe("Admin EDIT and DELETE on an account they own", () => {
      const userUpdate: UserData = {
        firstName: "newname",
        email: "newlast",
        lastName: "newlast",
        oldPassword: "password",
        password: "password",
        passwordConfirm: "password"
      }
      // TEST PATCH request with invalid data supplied //
      describe("PATCH '/api/admins/update/:adminId' with invalid data supplied", () => {
        it("Should not update the Admin without a 'firstName' field supplied", (done) => {
          chai.request(server)
            .patch("/api/admins/update/" + (admin._id as string)) 
            .set({
              "Authorization": jwtToken
            })
            .send({
              ...userUpdate,
              firstName: ""
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(422);
              expect(res.body.responseMsg).to.be.a("string");
              expect(res.body.error).to.be.an("object");
              expect(res.body.errorMessages).to.be.an("array");
              expect(res.body.errorMessages[0]).to.be.a("string");
              done();
            });
        });
        it("Should not update the Admin without a 'lastName' field supplied", (done) => {
          chai.request(server)
            .patch("/api/admins/update/" + (admin._id as string)) 
            .set({
              "Authorization": jwtToken
            })
            .send({
              ...userUpdate,
              lastName: ""
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(422);
              expect(res.body.responseMsg).to.be.a("string");
              expect(res.body.error).to.be.an("object");
              expect(res.body.errorMessages).to.be.an("array");
              expect(res.body.errorMessages[0]).to.be.a("string");
              done();
            });
        });
        it("Should not update the Admin without an 'email' field supplied", (done) => {
          chai.request(server)
            .patch("/api/admins/update/" + (admin._id as string)) 
            .set({
              "Authorization": jwtToken
            })
            .send({
              ...userUpdate,
              email: ""
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(422);
              expect(res.body.responseMsg).to.be.a("string");
              expect(res.body.error).to.be.an("object");
              expect(res.body.errorMessages).to.be.an("array");
              expect(res.body.errorMessages[0]).to.be.a("string");
              done();
            });
        });
        it("Should not update the Admin if an admin with 'email' already exists", (done) => {
          chai.request(server)
            .patch("/api/admins/update/" + (admin._id as string)) 
            .set({
              "Authorization": jwtToken
            })
            .send({
              ...userUpdate,
              email: secondAdmin.email
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(422);
              expect(res.body.responseMsg).to.be.a("string");
              expect(res.body.error).to.be.an("object");
              expect(res.body.errorMessages).to.be.an("array");
              expect(res.body.errorMessages[0]).to.be.a("string");
              done();
            });
        });
        it("Should not update the Admin without a 'oldPassword' field supplied", (done) => {
          chai.request(server)
            .patch("/api/admins/update/" + (admin._id as string)) 
            .set({
              "Authorization": jwtToken
            })
            .send({
              ...userUpdate,
              oldPassword: ""
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(401);
              expect(res.body.responseMsg).to.be.a("string");
              expect(res.body.error).to.be.an("object");
              expect(res.body.errorMessages).to.be.an("array");
              expect(res.body.errorMessages[0]).to.be.a("string");
              done();
            });
        });
      });
      // END TEST PATCH request with invalid data supplied //
      describe("PATCH '/api/admins/update/:adminId' with valid data supplied", () => {
        let adminResponse: IAdministrator;

        it("Should properly update the 'Administrator' model, send back correct response", (done) => {
          chai.request(server)
            .patch("/api/admins/update/" + (admin._id as string)) 
            .set({
              "Authorization": jwtToken
            })
            .send({
              ...userUpdate
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).to.equal(200);
              expect(res.body.responseMsg).to.be.a("string");
              expect(res.body.editedAdmin).to.be.an("object");
              expect(res.body.error).to.be.undefined;
              expect(res.body.errorMessages).to.be.undefined;
              adminResponse = res.body.editedAdmin;
              done();
            });
        });
        it("Should send back the 'editedAdmin' model and set correct fields", () => {
          expect(adminResponse.firstName).to.equal(userUpdate.firstName);
          expect(adminResponse.lastName).to.equal(userUpdate.lastName);
          expect(adminResponse.email).to.equal(userUpdate.email);
        });
        it("Should NOT alter the count of 'Administrator' model in database", (done) => {
          Administrator.countDocuments().exec()
            .then((number) => {
              expect(number).to.equal(numberOfAdmins);
              done();
            })
            .catch((err) => {
              done(err);
            })
        })
      })
    })
  })
  
})
