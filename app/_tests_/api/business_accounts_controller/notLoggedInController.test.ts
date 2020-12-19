// testing dependencies //
import chain, { expect } from "chai";
import chaiHTTP from "chai-http";
// server import //
import server from "../../../server";
// models and model interfaces //
import BusinessAccount, { IBusinessAccount } from "../../../models/BusinessAccount";
import { isEmptyObj } from "../../../controllers/_helpers/queryHelpers";


chai.use(chaiHTTP);

describe("BusinessAccountsController - NOT LOGGED IN - API tests", () => {
  let numberOfBusinessAccounts: number;
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
    describe("GET '/api/business_accounts/:businessAcctId", () => {

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
    describe("GET '/api/business_accounts", () => {
      
    })
    // END TEST GET_MANY ACTION admin not logged in //// TEST GET_MANY ACTION admin not logged in //
    describe("GET '/api/business_accounts", () => {
      
    })
    // END TEST GET_MANY ACTION admin not logged in //
  })
  // END CONTEXT 'BusinessAccountsController' API tests admin not logged in //

})