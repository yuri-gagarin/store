// testing dependencies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import { Types } from "mongoose";
// server import //
import server from "../../../server";
// models and model interfaces //
import Administrator, { IAdministrator } from "../../../models/Administrator";
import BusinessAccount, { IBusinessAccount } from "../../../models/BusinessAccount";
// helpers and test setup methods //
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";
import { setupBusinessAccountControllerTests } from "./helpers/testSetupAndBreakdown";
import { isEmptyObj } from "../../../controllers/_helpers/queryHelpers";
import { clearDB } from "../../helpers/dbHelpers";


chai.use(chaiHTTP);

describe("BusinessAccountsController API tets - ADMIN LOGGED IN - WITH ACCOUNT SET UP - Attempting GET/PATCH/DELETE on account they dont own", () => {
  // firstAdmin and secondAdmin have mock acccounts, thirdAdmin and fourthAdmin do not //
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  let firstAdminsBusinessAccount: IBusinessAccount, secondAdminsBusinessAccount: IBusinessAccount;
  let numberOfBusinessAccounts: number;
  // 
  let firstAdminsToken: string;
  before((done) => {
    setupBusinessAccountControllerTests()
      .then(({ admins, businessAccounts }) => {
        ({ firstAdmin, secondAdmin, thirdAdmin } = admins);
        ({ firstAdminsBusinessAccount, secondAdminsBusinessAccount } = businessAccounts);
        return BusinessAccount.countDocuments().exec();
      })
      .then((number) => {
        numberOfBusinessAccounts = number;
        return loginAdmins(chai, server, [ firstAdmin ]);
      })
      .then((adminsArr) => {
        [ firstAdminsToken ] = adminsArr;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  after((done) => {
    clearDB()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  // CONTEXT 'BusinessAccountsController' API tests admin is logged in with an account set up//
  context("'BusinessAccountsController' API tets - ADMIN LOGGED IN - WITH ACCOUNT SET UP - Attempting GET/PATCH/DELETE on account they dont own", () => {
    /*
    // TEST GET_MANY ACTION admin logged with account accessing account which doesnt belong to them//
    describe("GET '/api/business_accounts - ADMIN LOGGED IN -  WITH BUSINESS ACCOUNT - INCORRECT ACCESS - GET_MANY action", () => {

      it("Should NOT return any 'BusinessAccount' models and send the correct response", (done) => {
        chai.request(server)
          .get("/api/business_accounts")
          .set({ "Authorization": thirdAdminsToken })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object")
            expect(res.body.errorMesssages).to.be.an("array");
            expect(res.body.errorMesssages[0]).to.be.a("string");
            expect(res.body.businessAccounts).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        BusinessAccount.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfBusinessAccounts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST GET_MANY ACTION admin logged with account accessing account which doesnt belong to them //
    */
    // TEST GET_ONE ACTION admin logged with account accessing account which doesnt belong to them //
    describe("GET '/api/business_accounts/:businessAcctId' - ADMIN LOGGED IN - WITH BUSINESS ACCOUNT - INCORRECT ACCESS - GET_ONE action", () => {

      it("Should NOT return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .get("/api/business_accounts/" + (secondAdminsBusinessAccount._id as string))
          .set({ "Authorization":firstAdminsToken })
          .end((err, res) => {
            if(err) done(err);
            // assert correct rendering //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object")
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.businessAccount).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        BusinessAccount.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfBusinessAccounts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END GET_ONE ACTION admin logged with account accessing account which doesnt belong to them //
    
    // TEST PATCH EDIT ACTION admin logged with account accessing account which doesnt belong to them //
    describe("PATCH '/api/business_accounts/edit/:businessAcctId' - ADMIN LOGGED IN - WITH BUSINESS ACCOUNT - INCORRECT ACCESS - EDIT action", () => {
      
      it("Should not return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/business_accounts/edit/" + (secondAdminsBusinessAccount._id as string))
          .set({ "Authorization": firstAdminsToken })
          .send({
            newAdmins: [ thirdAdmin._id ]
          })
          .end((err, res) => {
            if(err) done(err);
            // assert correct rendering //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object")
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.editedBusinessAccount).to.be.undefined;
            done();
          });
      });
      it("Should NOT add the new 'Administrator' to the queried 'BusinessAccount' model", (done) => {
        BusinessAccount.findOne({ _id: secondAdminsBusinessAccount._id}).exec()
          .then((busAccount) => {
            expect(busAccount!.linkedAdmins.length).to.equal(1);
            expect(busAccount!.linkedAdmins.includes(secondAdmin._id)).to.equal(true);
            expect(busAccount!.linkedAdmins.includes(thirdAdmin._id)).to.equal(false);
            done();
          })
          .catch((error) => {
            done(error);
          })
      })
      it("Should NOT alter anything in the database", (done) => {
        BusinessAccount.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfBusinessAccounts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    })
    // END TEST PATCH EDIT ACTION admin logged with account accessing account which doesnt belong to them //
    
    // TEST DELETE DELETE Action admin logged with account accessing account which doesnt belong to them //
    describe("DELETE '/api/business_accounts/delete/:businessAcctId' - ADMIN LOGGED IN - WITH BUSINESS ACCOUNT - INCORRECT ACCESS - DELETE action", () => {
      
      it("Should NOT delete and return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .delete("/api/business_accounts/delete/" + (secondAdminsBusinessAccount._id as string))
          .set({ "Authorization": firstAdminsToken })
          .end((err, res) => {
            if(err) done(err);
             // assert correct rendering //
             expect(res.status).to.equal(401);
             expect(res.body.responseMsg).to.be.a("string");
             expect(res.body.error).to.be.an("object")
             expect(res.body.errorMessages).to.be.an("array");
             expect(res.body.errorMessages.length).to.equal(1);
             expect(res.body.deletedBusinessAccount).to.be.undefined;
             done();
          });
      });
      it("Should NOT remove the queried 'BusinessAccount' model from the database", (done) => {
        BusinessAccount.exists({ _id: firstAdminsBusinessAccount._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          })
      });
      it("Should NOT alter anything in the database", (done) => {
        BusinessAccount.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfBusinessAccounts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST DELETE DELETE ACTION admin not logged in //
  });
  // END CONTEXT 'BusinessAccountsController' API tests admin not logged in //

});