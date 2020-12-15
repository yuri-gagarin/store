// testing dependencies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server import //
import server from "../../../server";
// models and model interfaces //
import { IStore } from "../../../models/Store";
import StoreItem, { IStoreItem } from "../../../models/StoreItem";
// helpers and data generators //
import { setupStoreItemControllerTests} from "./helpers/testSetupAndCleanup";
import { isEmptyObj } from "../../../controllers/_helpers/queryHelpers";
import { clearDB } from "../../helpers/dbHelpers";

chai.use(chaiHTTP);

describe("StoreItemsController - NOT LOGGED IN - API tests", () => {
  let firstAdminsStore: IStore;
  let firstAdminsStoreItem: IStoreItem;
  let numberOfStoreItems: number;

  before((done) => {
    setupStoreItemControllerTests()
      .then((response) => {
        ({ firstAdminsStore } = response.stores);
        [ firstAdminsStoreItem ] = response.storeItems.firstAdminsStoreItems;
        return StoreItem.countDocuments().exec();
      })
      .then((number) => {
        numberOfStoreItems = number;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  // CONTEXT 'StoreItemsController' API tests Admin not logged in //
  context("'StoreItemsController' API tests - ADMIN NOT LOGGED IN (NO JWT token)", () => {
    // TEST GET GET_MANY action admin not logged in //
    describe("GET '/api/store_items' - NO LOGIN - GET_MANY action", () => {

      it("Should not return any 'StoreItem' models and send the correct response", (done) => {
        chai.request(server)
          .get("/api/store_items")
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
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST GET GET_MANY action admin not logged in //

    // TEST GET GET_ONE action admin not logged in //
    describe("GET '/api/store_items/:storeItemId - NO LOGIN - GET_ONE action", () => {
      it("Should not return a 'StoreItem' model and send the correct response", (done) => {
        chai.request(server)
          .get("/api/store_items/" + (firstAdminsStoreItem._id as string))
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
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST GET GET action admin not logged in //

    // TEST POST CREATE action admin not logged in //
    describe("POST '/api/store_items/create/:storeId - NO LOGIN - CREATE action", () => {
      it("Should NOT return a 'StoreItem' model and send the correct response", (done) => {
        chai.request(server)
          .post("/api/store_items/create/" + (firstAdminsStore._id as string)) 
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
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST GET GET action admin not logged in //

    // TEST PATCH EDIT action admin not logged in //
    describe("PATCH '/api/store_items/update/:storeId/:storeItemId - NO LOGIN - EDIT action", () => {

      it("Should NOT return a 'StoreItem' model and send the correct response", (done) => {
        const storeId = firstAdminsStore._id as string;
        const storeItemId = firstAdminsStoreItem._id as string;
        chai.request(server)
          .patch(`/api/store_items/update/${storeId}/${storeItemId}`)
          .set({ "Authorization": "" })
          .send({ ...firstAdminsStoreItem, name: "newStoreItemName" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(res.body)).to.equal(true);
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT edit the 'StoreItem' model in question", (done) => {
        StoreItem.findOne({ _id: firstAdminsStoreItem._id }).exec()
          .then((storeItem) => {
            expect(JSON.stringify(storeItem)).to.equal(JSON.stringify(firstAdminsStoreItem));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST PATCH EDIT action admin not logged in //

    // TEST DELETE DELETE action admin not logged in //
    describe("DELETE'/api/store_items/delete/:storeItemId - NO LOGIN - DELETE action", () => {
      
      it("Should not return a 'StoreItem' model and send the correct response", (done) => {
        const storeId = firstAdminsStore._id as string;
        const storeItemId = firstAdminsStoreItem._id as string; 
        chai.request(server)
          .delete(`/api/store_items/delete/${storeId}/${storeItemId}`)
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
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT remove the 'StoreItem' model in question", (done) => {
        StoreItem.exists({ _id: firstAdminsStoreItem._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST DELETE DELETE action admin not logged in //
  });
  // END CONTEXT 'StoreItemsController' API tests Admin not logged in //

});
