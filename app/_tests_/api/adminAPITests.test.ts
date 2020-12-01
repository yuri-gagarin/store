import chaiHTTP from "chai-http";
import chai, { expect } from "chai";
import { Response } from "express";
import fs from "fs";
// server, models //
import server from "../../server";
import Administrator, { IAdministrator, EAdminLevel } from "../../models/Administrator";
import { setupDB, clearDB } from "../helpers/dbHelpers";
import { createAdmins, generateMockAdminData } from "../helpers/dataGeneration";
import { AdminData } from "../../controllers/admins_controller/type_declarations/adminsControllerTypes";
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
    // TEST new Administrator CREATE API Action invalid data //
    describe("'POST '/api/admins/register' New Administrator registration with INVALID data", () => {
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
            expect(res.body.messages).to.be.an("array");
            expect(res.body.messages[0]).to.be.a("string");
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
            expect(res.body.messages).to.be.an("array");
            expect(res.body.messages[0]).to.be.a("string");
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
            expect(res.body.messages).to.be.an("array");
            expect(res.body.messages[0]).to.be.a("string");
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
                expect(res.body.messages).to.be.an("array");
                expect(res.body.messages[0]).to.be.a("string");                
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
            expect(res.body.messages).to.be.an("array");
            expect(res.body.messages[0]).to.be.a("string");  
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
            expect(res.body.messages).to.be.an("array");
            expect(res.body.messages[0]).to.be.a("string");  
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
            expect(res.body.messages).to.be.an("array");
            expect(res.body.messages[0]).to.be.a("string");  
            done();
          });
      });
      it("Should NOT register a new Administrator if all fields are empty and return proper error messages", (done) => {
        chai.request(server)
          .post("/api/admins/register")
          .send({})
          .end((err, res) => {
            if (err) done(err);
            const messages: string[] = res.body.messages;
            expect(res.status).to.equal(422);
            expect(res.body.jwtToken).to.be.undefined;
            expect(res.body.newAdmin).to.be.undefined;
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.messages).to.be.an("array");
            expect(res.body.messages.length).to.equal(5);

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
    // END TEST new Administrator CREATE API Action invalid data //
  });
  // END CONTEXT Administrator API tests without login/authorization //

  /*
  context("Administrator API tests logged in (with JWT token)", () => {

  })
  */
})
