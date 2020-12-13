// testing dependencies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server import //
import server from "../../../server";
// models and model interfaces //
import Store, { IStore } from "../../../models/Store";
// helpers and data generators //
import { isEmptyObj } from "../../../controllers/_helpers/queryHelpers";
import { setupStoreControllerTests } from "./_helpers/storeContTestHelpers";
import { clearDB } from "../../helpers/dbHelpers";

chai.use(chaiHTTP);

describe("StoresController - NOT LOGGED IN  - API tests", () => {
  let firstAdminsStore: IStore;
  let numberOfStores: number;

  before((done) => {
    setupStoreControllerTests()
      .then((response) => {
        ({ firstAdminsStore } = response.stores);
        return Store.countDocuments().exec();
      })
      .then((number) => {
        numberOfStores = number;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  // CONTEXT StoresController API tests Admin is not logged in //
  context("'StoresController API tests - NOT LOGGED IN - GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {

    // TEST GET admin not logged in GET_MANY action //
    describe("GET '/api/stores' - NO LOGIN - GET_MANY action", () => {

      it("Should not return any 'Store' models and send the correct response", (done) => {
        chai.request(server)
          .get("/api/stores")
          .set({ "Authorization": " " })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(401);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(res.body)).to.equal(true);
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        Store.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST GET admin not logged in GET_MANY action //

    // TEST GET admin not logged in GET_ONE action //
    describe("GET '/api/stores/:storeId - NO LOGIN - GET_ONE action", () => {
      it("Should not return a 'Store' model and send the correct response", (done) => {
        chai.request(server)
          .get("/api/stores/" + (firstAdminsStore._id as string))
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
        Store.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST GET admin not logged in GET_ONE action //

    // TEST POST admin not logged in CREATE action //
    describe("POST '/api/stores/create - NO LOGIN - CREATE action", () => {
      it("Should NOT return a 'Store' model and send the correct response", (done) => {
        chai.request(server)
          .post("/api/stores/create")
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
        Store.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST admin not logged in CREATE action //

    // TEST PATCH admin not logged in EDIT ction //
    describe("PATCH '/api/stores/update/:storeId- NO LOGIN - EDIT action", () => {
      it("Should not return a 'Store' model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/stores/update/" + (firstAdminsStore._id as string))
          .set({ "Authorization": "" })
          .send({ ...firstAdminsStore, name: "newStoreName" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(res.body)).to.equal(true);
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        Store.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT edit the 'Store' model in question", (done) => {
        Store.findOne({ _id: firstAdminsStore._id }).exec()
          .then((store) => {
            expect(JSON.stringify(store)).to.equal(JSON.stringify(firstAdminsStore));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST admin not logged in PATCH action //

    // TEST DELETE admin not logged in DELETE action //
    describe("DELETE'/api/stores/delete/:storeId - NO LOGIN - DELETE action", () => {
      it("Should not return a 'Store' model and send the correct response", (done) => {
        chai.request(server)
          .delete("/api/stores/delete/" + (firstAdminsStore._id as string))
          .set({ "Authorization": "" })
          .send({ ...firstAdminsStore, name: "newStoreName" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(res.body)).to.equal(true);
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        Store.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT remove the 'Store' model in question", (done) => {
        Store.exists({ _id: firstAdminsStore._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END DELETE admin not logged in DELETE action //
  });
  // END CONTEXT StoresController API tests Admin is not logged in //
});