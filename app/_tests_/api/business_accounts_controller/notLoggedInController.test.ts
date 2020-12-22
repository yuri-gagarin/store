// testing dependencies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server import //
import server from "../../../server";
// models and model interfaces //
import { IAdministrator } from "../../../models/Administrator";
import BusinessAccount, { IBusinessAccount } from "../../../models/BusinessAccount";
// helpers and test setup methods //
import { setupBusinessAccountControllerTests } from "./helpers/testSetupAndBreakdown";
import { isEmptyObj } from "../../../controllers/_helpers/queryHelpers";
import { clearDB } from "../../helpers/dbHelpers";


chai.use(chaiHTTP);

describe("BusinessAccountsController - NOT LOGGED IN - API tests", () => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator;
  let firstAdminsBusinessAccount: IBusinessAccount, secondAdminsBusinessAccount: IBusinessAccount;
  let numberOfBusinessAccounts: number;

  before((done) => {
    setupBusinessAccountControllerTests()
      .then(({ admins, businessAccounts }) => {
        ({ firstAdmin, secondAdmin } = admins);
        ({ firstAdminsBusinessAccount, secondAdminsBusinessAccount } = businessAccounts);
        return BusinessAccount.countDocuments().exec();
      })
      .then((number) => {
        numberOfBusinessAccounts = number;
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

  // CONTEXT 'BusinessAccountsController' API tests admin not logged in //
  context("'BusinessAccountsController' API tets - ADMIN NOT LOGGED IN (NO JWT token)", () => {
    // TEST GET_MANY ACTION admin not logged in //
    describe("GET '/api/business_accounts - NO LOGIN - GET_MANY action", () => {

      it("Should not return any 'BusinessAccount' models and send the correct response", (done) => {
        chai.request(server)
          .get("/api/business_accounts")
          .set({ "Authorization": "" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(res.body)).to.equal(true);
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
    // END TEST GET_MANY ACTION admin not logged in //

    // TEST GET_ONE ACTION admin not logged in //
    describe("GET '/api/business_accounts/:businessAcctId' - NO LOGIN - GET_ONE action", () => {

      it("Should not return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .get("/api/business_accounts/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": "" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(res.body)).to.equal(true);
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
    // END TEST GET_ONE ACTION admin not logged in //// TEST GET_MANY ACTION admin not logged in //
    describe("POST '/api/business_accounts/create - NO LOGIN - CREATE action", () => {
      
      it("Should not return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .post("/api/business_accounts/create")
          .set({ "Authorization": "" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(res.body)).to.equal(true);
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
    // END TEST POST CREATE ACTION admin not logged in //

    // TEST PATCH EDIT ACTION admin not logged in //
    describe("PATCH '/api/business_accounts/edit/:businessAcctId' - NO LOGIN - EDIT action", () => {
      
      it("Should not return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/business_accounts/edit/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": "" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(res.body)).to.equal(true);
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
    // END TEST PATCH EDIT ACTION admin not logged in //

    // TEST DELETE DELETE Action admin not logged in //
    describe("DELETE '/api/business_accounts/delete/:businessAcctId' - NO LOGIN - DELETE action", () => {
      
      it("Should not return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .delete("/api/business_accounts/delete/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": "" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(res.body)).to.equal(true);
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
    // END TEST DELETE DELETE ACTION admin not logged in //

  });
  // END CONTEXT 'BusinessAccountsController' API tests admin not logged in //

})