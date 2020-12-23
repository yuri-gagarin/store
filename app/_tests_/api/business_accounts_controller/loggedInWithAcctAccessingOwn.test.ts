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

/**
 * NOTES 
 * DELETE action for 'BusinessAccountsController' needs to be thouroughly tested for a populated account
 */

describe("BusinessAccountsController - LOGGED IN - WITH ACCOUNT - ACCESSING OWN ACCOUNT - API tests", () => {
  // firstAdmin and secondAdmin have mock acccounts, thirdAdmin and fourthAdmin do not //
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  let firstAdminsBusinessAccount: IBusinessAccount, secondAdminsBusinessAccount: IBusinessAccount;
  let numberOfBusinessAccounts: number;
  //
  let fetchedAccount: IBusinessAccount;
  let deletedBusinessAccount: IBusinessAccount;
  //
  let firstAdminsToken: string, secondAdminsToken: string, thirdAdminsToken: string, fourthAdminsToken: string;
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
        [ firstAdminsToken, secondAdminsToken, thirdAdminsToken, fourthAdminsToken ] = adminsArr;
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

  // CONTEXT 'BusinessAccountsController' API tests admin is logged in with a business account accessing their own account //
  context("'BusinessAccountsController' API tets - ADMIN LOGGED IN - WITH BUSINESS ACCOUNT - Accessing own account", () => {
    /*
    // TEST GET_MANY ACTION admin logged in with account they own //
    describe("GET '/api/business_accounts - ADMIN LOGGED IN - NO BUSINESS ACCOUNT - GET_MANY action", () => {

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
    // END TEST GET_MANY ACTION admin logged in with account they own  //
    */
    // TEST GET_ONE ACTION admin logged in WITH ACCOUNT - ACCESSING OWN ACCOUNT //
    describe("GET '/api/business_accounts/:businessAcctId' - ADMIN LOGGED IN - WITH BUSINESS ACCOUNT - GET_ONE action on own account", () => {

      it("Should return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .get("/api/business_accounts/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": firstAdminsToken })
          .end((err, res) => {
            if(err) done(err);
            // assert correct rendering //
            fetchedAccount = res.body.businessAccount;
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.businessAccount).to.be.an("object")
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
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
    // END TEST GET_ONE ACTION admin logged in WITH ACCOUNT - ACCESSING OWN ACCOUNT //
    
    // TEST POST CREATE ACTION admin logged in with an account //
    describe("POST '/api/business_accounts/create - ADMIN LOGGED IN - WITH BUSINESS ACCOUNT - CREATE action", () => {
      
      it("Should NOT create and return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .post("/api/business_accounts/create")
          .set({ "Authorization": firstAdminsToken })
          .end((err, res) => {
            if(err) done(err);
           // assert correct rendering //
           expect(res.status).to.equal(401);
           expect(res.body.responseMsg).to.be.a("string");
           expect(res.body.newBusinessAccount).to.be.undefined;
           expect(res.body.error).to.be.an("object");
           expect(res.body.errorMessages).to.be.an("array");
           done();
          });
      });
      it("Should NOT INCREASE the number of 'BusinessAccount' model in the database by 1", (done) => {
        BusinessAccount.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfBusinessAccounts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
      it("Should NOT edit the 'Administrator' <businessAccountId> field", (done) => {
        Administrator.findOne({ _id: firstAdmin._id }).exec()
          .then((administrator) => {
            expect((administrator!.businessAccountId! as Types.ObjectId).equals(firstAdminsBusinessAccount._id)).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      })
    });
    // END TEST POST CREATE ACTION admin logged with an account //
    
    // TEST PATCH EDIT ACTION admin logged in with business account //
    describe("PATCH '/api/business_accounts/edit/:businessAcctId' - ADMIN LOGGED IN - WITH BUSINESS ACCOUNT - EDIT action on own account", () => {
      
      it("Should update and return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/business_accounts/edit/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": firstAdminsToken })
          .send({
            newAdmins: [ thirdAdmin._id ]
          })
          .end((err, res) => {
            if(err) done(err);
            // assert correct rendering //
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.editedBusinessAccount).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly update the 'BusinessAccount' model in the database", (done) => {
        BusinessAccount.findOne({ _id: firstAdminsBusinessAccount._id }).exec()
          .then((businessAccount) => {
            expect(businessAccount!.linkedAdmins.length).to.equal(2);
            expect(businessAccount!.linkedAdmins.includes(firstAdmin._id)).to.equal(true);
            expect(businessAccount!.linkedAdmins.includes(thirdAdmin._id)).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT change the number 'BusinessAccount' models in the database", (done) => {
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
    // END TEST PATCH EDIT ACTION admin logged in and no business account //
    
    // TEST PATCH EDIT action admin logged in with business account own account trying to add an admin with an account //
    describe("PATCH '/api/business_accounts/edit/:businessAcctId' - ADMIN LOGGED IN - WITH BUSINESS ACCOUNT - ADDING ADMIN WITH ACCOUNT- EDIT action on own account", () => {
      
      it("Should NOT alter the model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/business_accounts/edit/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": firstAdminsToken })
          .send({
            newAdmins: [ secondAdmin._id ]
          })
          .end((err, res) => {
            if(err) done(err);
            // assert correct rendering //
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.editedBusinessAccount).to.be.undefined;
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.an("array");
            done();
          });
      });
      it("Should NOT update 'BusinessAccount' model in the database", (done) => {
        BusinessAccount.findOne({ _id: firstAdminsBusinessAccount._id }).exec()
          .then((businessAccount) => {
            expect(businessAccount!.linkedAdmins.length).to.equal(2);
            expect(businessAccount!.linkedAdmins.includes(firstAdmin._id)).to.equal(true);
            expect(businessAccount!.linkedAdmins.includes(thirdAdmin._id)).to.equal(true);
            expect(businessAccount!.linkedAdmins.includes(secondAdmin._id)).to.equal(false);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT change the number 'BusinessAccount' models in the database", (done) => {
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
    // END TEST PATCH EDIT action admin logged in with business account own account trying to add an admin with an account //
    
    // TEST DELETE DELETE Action admin logged in with business acount deleting own account //
    describe("DELETE '/api/business_accounts/delete/:businessAcctId' - LOGGED IN - WITH BUSINESS ACCOUNT - DELETE action on own account", () => {
      
      it("Should correctly delete, return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .delete("/api/business_accounts/delete/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": firstAdminsToken })
          .end((err, res) => {
            if(err) done(err);
             // assert correct rendering //
             expect(res.status).to.equal(200);
             expect(res.body.responseMsg).to.be.a("string");
             expect(res.body.deletedBusinessAccount).to.be.an("object");
             expect(res.body.error).to.be.undefined;
             expect(res.body.errorMessages).to.be.undefined;
             done();
          });
      });
      it("Should remove the queried 'BusinessAccount' model from the database", (done) => {
        BusinessAccount.exists({ _id: firstAdminsBusinessAccount._id })
          .then((exists) => {
            expect(exists).to.equal(false);
            done();
          })
          .catch((err) => {
            done(err);
          })
      });
      it("Should DECREASE number of 'BusinessAccount' model in the database by 1", (done) => {
        BusinessAccount.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfBusinessAccounts - 1);
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

})