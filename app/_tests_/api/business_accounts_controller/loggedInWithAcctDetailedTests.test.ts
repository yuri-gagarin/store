// testing dependencies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import { Types } from "mongoose";
// server import //
import server from "../../../server";
// models and model interfaces //
import Administrator, { IAdministrator } from "../../../models/Administrator";
import BusinessAccount, { IBusinessAccount } from "../../../models/BusinessAccount";
import { IStore } from "../../../models/Store";
// helpers and test setup methods //
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";
import { setupBusinessAccountControllerTests, populateBusinessAccount, cleanupBusinessAccountTestImages } from "./helpers/testSetupAndBreakdown";
import { isEmptyObj } from "../../../controllers/_helpers/queryHelpers";
import { clearDB } from "../../helpers/dbHelpers";


chai.use(chaiHTTP);

/**
 * NOTES 
 * DELETE action for 'BusinessAccountsController' needs to be thouroughly tested for a populated account
 */

describe("BusinessAccountsController - LOGGED IN - WITH ACCOUNT - ACCESSING OWN ACCOUNT - DETAILED API tests for PATCH/DELETE methods", () => {
  // firstAdmin and secondAdmin have mock acccounts, thirdAdmin and fourthAdmin do not //
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator, fourthAdmin: IAdministrator;
  let firstAdminsBusinessAccount: IBusinessAccount, secondAdminsBusinessAccount: IBusinessAccount;
  let populatedBusinessAccount: IBusinessAccount;
  let numberOfBusinessAccounts: number;
  //
  let editedAccount: IBusinessAccount;
  let deletedBusinessAccount: IBusinessAccount;
  //
  let firstAdminsToken: string, secondAdminsToken: string, thirdAdminsToken: string, fourthAdminsToken: string;
  before(function(done) {
    // neeed a longer timeout to 
    this.timeout(30000);
    setupBusinessAccountControllerTests()
      .then(({ admins, businessAccounts }) => {
        ({ firstAdmin, secondAdmin, thirdAdmin, fourthAdmin } = admins);
        ({ firstAdminsBusinessAccount, secondAdminsBusinessAccount } = businessAccounts);
        return BusinessAccount.countDocuments().exec();
      })
      .then((number) => {
        numberOfBusinessAccounts = number;
        return loginAdmins(chai, server, [ firstAdmin ]);
      })
      .then((adminsArr) => {
        [ firstAdminsToken, secondAdminsToken, thirdAdminsToken, fourthAdminsToken ] = adminsArr;
        return populateBusinessAccount({
          businessAccountId: firstAdminsBusinessAccount._id,
          numOfStores: 2,
          numOfStoreImagesPerStore: 2,
          numOfStoreItemsPerStore: 2,
          numOfStoreItemImgsPerStoreItem: 2,
          numOfServices: 2,
          numOfServiceImgsPerService: 2,
          numOfProducts: 2,
          numOfProductImgsPerProduct: 2
        });
      })
      .then(({ populatedBusinessAcct }) => {
        populatedBusinessAccount =  populatedBusinessAcct;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  after((done) => {
    clearDB()
      .then(() => {
        const busAcctId: Types.ObjectId = firstAdminsBusinessAccount._id;
        return cleanupBusinessAccountTestImages(String(busAcctId));
      })
      .then((_) => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  // CONTEXT 'BusinessAccountsController' API tests admin is logged in with a business account accessing their own account //
  context("'BusinessAccountsController' API tets - ADMIN LOGGED IN - WITH BUSINESS ACCOUNT - Accessing own account - detailed PATCH tests", () => {
  
    // TEST PATCH EDIT ACTION admin logged in with business account //
    describe("PATCH '/api/business_accounts/edit/:businessAcctId' - EDIT action on own account - Adding A single 'Admin' to account who doesnt have an account", () => {
      
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
            editedAccount = res.body.editedBusinessAccount;
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.editedBusinessAccount).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should return correctly linked 'editedBusinessAccount' in response", () => {
        const { linkedStores, linkedProducts, linkedServices } = editedAccount;
        expect(linkedStores.length).to.equal(populatedBusinessAccount.linkedStores.length);
        expect(linkedServices.length).to.equal(populatedBusinessAccount.linkedServices.length);
        expect(linkedProducts.length).to.equal(populatedBusinessAccount.linkedProducts.length);
      });
      it("Should return correct data in linked 'editedBusinessAccount' in response", () => {
        const { linkedStores, linkedProducts, linkedServices } = editedAccount;
        for (const store of linkedStores as IStore[]) {
          expect(store).to.be.an("object");
        }
        for (const product of linkedProducts) {
          expect(product).to.be.an("object");
        }
        for (const service of linkedServices) {
          expect(service).to.be.an("object");
        }
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
      it("Should update the queried 'Administrator' model in the database", (done) => {
        Administrator.findOne({ _id: thirdAdmin._id }).exec()
        done();
      })
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

    // TEST PATCH EDIT ACTION admin logged in with business account own account adding an admin with account //
    describe("PATCH '/api/business_accounts/edit/:businessAcctId' - EDIT action on own account - Adding A single 'Admin' to account who DOES have an account", () => {
      
      it("Should update and return a 'BusinessAccount' model and send the correct response", (done) => {
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
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(2);
            expect(res.body.editedBusinessAccount).to.be.undefined;
            done();
          });
      });
      it("Should NOT update the 'BusinessAccount' model in the database", (done) => {
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
      it("Should update the queried 'Administrator' model in the database", (done) => {
        Administrator.findOne({ _id: thirdAdmin._id }).exec()
        done()
      })
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

    // TEST PATCH EDIT ACTION admin logged in 
    describe("PATCH '/api/business_accounts/edit/:businessAcctId' - EDIT action on own account - Removing an 'Admin' from 'BusinessAccount'", () => {
      
      it("Should update and return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/business_accounts/edit/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": firstAdminsToken })
          .send({
            adminsToRemove: [ thirdAdmin._id ]
          })
          .end((err, res) => {
            if(err) done(err);
            // assert correct rendering //
            editedAccount = res.body.editedBusinessAccount;
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.editedBusinessAccount).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should return correctly linked 'editedBusinessAccount' in response", () => {
        const { linkedStores, linkedProducts, linkedServices } = editedAccount;
        expect(linkedStores.length).to.equal(populatedBusinessAccount.linkedStores.length);
        expect(linkedServices.length).to.equal(populatedBusinessAccount.linkedServices.length);
        expect(linkedProducts.length).to.equal(populatedBusinessAccount.linkedProducts.length);
      });
      it("Should return correct data in linked 'editedBusinessAccount' in response", () => {
        const { linkedStores, linkedProducts, linkedServices } = editedAccount;
        for (const store of linkedStores as IStore[]) {
          expect(store).to.be.an("object");
        }
        for (const product of linkedProducts) {
          expect(product).to.be.an("object");
        }
        for (const service of linkedServices) {
          expect(service).to.be.an("object");
        }
      });
      it("Should correctly update the 'BusinessAccount' model in the database", (done) => {
        BusinessAccount.findOne({ _id: firstAdminsBusinessAccount._id }).exec()
          .then((businessAccount) => {
            expect(businessAccount!.linkedAdmins.length).to.equal(1);
            expect(businessAccount!.linkedAdmins.includes(firstAdmin._id)).to.equal(true);
            expect(businessAccount!.linkedAdmins.includes(thirdAdmin._id)).to.equal(false);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should update the queried 'Administrator' model in the database", (done) => {
        Administrator.findOne({ _id: thirdAdmin._id }).exec()
        done();
      })
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

    // TEST PATCH EDIT ACTION admin logged in with business account own account adding an admin with account //
    describe("PATCH '/api/business_accounts/edit/:businessAcctId' - EDIT action on own account - Adding A single 'Admin' to account who has already been added", () => {
      
      it("Should update and return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/business_accounts/edit/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": firstAdminsToken })
          .send({
            newAdmins: [ firstAdmin._id ]
          })
          .end((err, res) => {
            if(err) done(err);
            // assert correct rendering //
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(2);
            expect(res.body.editedBusinessAccount).to.be.undefined;
            done();
          });
      });
      it("Should NOT update the 'BusinessAccount' model in the database", (done) => {
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
      it("Should update the queried 'Administrator' model in the database", (done) => {
        Administrator.findOne({ _id: thirdAdmin._id }).exec()
        done()
      })
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

    describe("PATCH '/api/business_accounts/edit/:businessAcctId' - EDIT action on own account - removing the last admin", () => {
      
      it("Should NOT remove and return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/business_accounts/edit/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": firstAdminsToken })
          .send({
            adminsToRemove: [ firstAdmin._id ]
          })
          .end((err, res) => {
            if(err) done(err);
            // assert correct rendering //
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(2);
            expect(res.body.editedBusinessAccount).to.be.undefined;
            done();
          });
      });
      it("Should NOT update the 'BusinessAccount' model in the database", (done) => {
        BusinessAccount.findOne({ _id: firstAdminsBusinessAccount._id }).exec()
          .then((businessAccount) => {
            expect(businessAccount!.linkedAdmins.length).to.equal(1);
            expect(businessAccount!.linkedAdmins.includes(firstAdmin._id)).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT update the queried 'Administrator' model in the database", (done) => {
        Administrator.findOne({ _id: firstAdmin._id }).exec()
          .then((foundAdmin) => {
            expect(foundAdmin.businessAccountId).to.be.an("object");
            expect((foundAdmin.businessAccountId as Types.ObjectId).equals(firstAdminsBusinessAccount._id)).to.equal(true);
          })
          .catch((error) => {
            done(error);
          })
      })
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
   
  });
  // END CONTEXT 'BusinessAccountsController' API tests admin not logged in //

})