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

describe("BusinessAccountsController - LOGGED IN - NO ACCOUNT - API tests", () => {
  // firstAdmin and secondAdmin have mock acccounts, thirdAdmin and fourthAdmin do not //
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator, fourthAdmin: IAdministrator;
  let firstAdminsBusinessAccount: IBusinessAccount, secondAdminsBusinessAccount: IBusinessAccount;
  let numberOfBusinessAccounts: number;
  // 
  let createdBusinessAccount: IBusinessAccount;
  let deletedBusinessAccount: IBusinessAccount;
  //
  let firstAdminsToken: string, secondAdminsToken: string, thirdAdminsToken: string, fourthAdminsToken: string;
  before((done) => {
    setupBusinessAccountControllerTests()
      .then(({ admins, businessAccounts }) => {
        ({ firstAdmin, secondAdmin, thirdAdmin, fourthAdmin } = admins);
        ({ firstAdminsBusinessAccount, secondAdminsBusinessAccount } = businessAccounts);
        return BusinessAccount.countDocuments().exec();
      })
      .then((number) => {
        numberOfBusinessAccounts = number;
        return loginAdmins(chai, server, [ firstAdmin, secondAdmin, thirdAdmin, fourthAdmin ]);
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

  // CONTEXT 'BusinessAccountsController' API tests admin is  logged in but has no account set up //
  context("'BusinessAccountsController' API tets - ADMIN LOGGED IN (NO BusinessAccount set up)", () => {
    /*
    // TEST GET_MANY ACTION admin logged in  no acccount //
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
    // END TEST GET_MANY ACTION admin logged in no account //
    */
    // TEST GET_ONE ACTION admin logged in NO ACCOUNT //
    describe("GET '/api/business_accounts/:businessAcctId' - ADMIN LOGGED IN - NO BUSINESS ACCOUNT - GET_ONE action", () => {

      it("Should not return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .get("/api/business_accounts/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": thirdAdminsToken })
          .end((err, res) => {
            if(err) done(err);
            // assert correct rendering //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object")
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(2);
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
    // END TEST GET_ONE ACTION admin logged in no account //
    
    // TEST POST CREATE ACTION admin logged in no account //
    describe("POST '/api/business_accounts/create - ADMIN LOGGED IN - NO BUSINESS ACCOUNT - CREATE action", () => {
      
      it("Should successfully create and return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .post("/api/business_accounts/create")
          .set({ "Authorization": thirdAdminsToken })
          .end((err, res) => {
            if(err) done(err);
           // assert correct rendering //
           createdBusinessAccount = res.body.newBusinessAccount;
           expect(res.status).to.equal(200);
           expect(res.body.responseMsg).to.be.a("string");
           expect(res.body.newBusinessAccount).to.be.an("object");
           expect(res.body.error).to.be.undefined;
           expect(res.body.errorMessages).to.be.undefined;
           done();
          });
      });
      it("Should INCREASE the number of 'BusinessAccount' model in the database by 1", (done) => {
        BusinessAccount.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfBusinessAccounts + 1);
            numberOfBusinessAccounts = number;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should place the newly created 'BusinessAccount' model in the database", (done) => {
        BusinessAccount.exists({ _id: createdBusinessAccount._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should correctly place the Admin information in newly created 'BusinessAccountModel", () => {
        const account = createdBusinessAccount.linkedAdmins.filter((admin) => {
          return (admin as IAdministrator)._id == thirdAdmin._id;
        });
        expect(account.length).to.equal(1);
      });
      it("Should correctly update the 'Administrator' model and set the <businessAccountId> field", (done) => {
        Administrator.findOne({ _id: thirdAdmin._id }).exec()
          .then((administrator) => {
            expect((administrator!.businessAccountId! as Types.ObjectId).toHexString()).to.equal(createdBusinessAccount._id)
            done();
          })
          .catch((err) => {
            done(err);
          });
      })
    });
    // END TEST POST CREATE ACTION admin logged in no account //
    
    // TEST PATCH EDIT ACTION admin logged in and no business account //
    describe("PATCH '/api/business_accounts/edit/:businessAcctId' - ADMIN LOGGED IN - NO BUSINESS ACCOUNT - EDIT action", () => {
      
      it("Should not return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/business_accounts/edit/" + (createdBusinessAccount._id as string))
          .set({ "Authorization": fourthAdminsToken })
          .end((err, res) => {
            if(err) done(err);
            // assert correct rendering //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object")
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(2);
            expect(res.body.editedBusinessAccount).to.be.undefined;
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
    })
    // END TEST PATCH EDIT ACTION admin logged in and no business account //
  
    // TEST DELETE DELETE Action admin logged in and no business account //
    describe("DELETE '/api/business_accounts/delete/:businessAcctId' - LOGGED IN - NO BUSINESS ACCOUNT - DELETE action", () => {
      
      it("Should NOT delete and return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .delete("/api/business_accounts/delete/" + (createdBusinessAccount._id as string))
          .set({ "Authorization": fourthAdminsToken })
          .end((err, res) => {
            if(err) done(err);
             // assert correct rendering //
             expect(res.status).to.equal(401);
             expect(res.body.responseMsg).to.be.a("string");
             expect(res.body.error).to.be.an("object")
             expect(res.body.errorMessages).to.be.an("array");
             expect(res.body.errorMessages.length).to.equal(2);
             expect(res.body.deletedBusinessAccount).to.be.undefined;
             done();
          });
      });
      it("Should NOT remove the queried 'BusinessAccount' model from the database", (done) => {
        BusinessAccount.exists({ _id: createdBusinessAccount._id })
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

})