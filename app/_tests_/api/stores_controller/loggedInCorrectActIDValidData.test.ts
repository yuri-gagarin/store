// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server import /
import server from "../../../server";
// models and model interfaces //
import { StoreData } from "../../../controllers/stores_controller/type_declarations/storesControllerTypes";
import { IAdministrator } from "../../../models/Administrator";
import Store, { IStore } from "../../../models/Store";
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { generateMockStoreData } from "../../helpers//data_generation/storesDataGeneration"; 
import { setupStoreControllerTests } from "./_helpers/storeContTestHelpers";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";

chai.use(chaiHTTP);

describe("StoresController - Logged In WITH CORRECT BusinessAccount ID - VALID DATA - GET/POST/PATCH/DELETE  - API tests", () => {
  let firstAdmin: IAdministrator;
  let fetchedStores: IStore[];
  let createdStore: IStore;
  let updatedStore: IStore;
  let deletedStore: IStore;
  let firstAdminsStore: IStore;
  let firstToken: string;
  let totalStores: number;
  // mockData //
  let newStoreData: StoreData;
  let updateStoreData: StoreData;

  // database and model data setup //
  // logins and jwtTokens //
  before((done) => {
    setupStoreControllerTests()
      .then((response) => {
        ({ firstAdmin } = response.admins);
        ({ firstAdminsStore } = response.stores);
        return loginAdmins(chai, server, [ firstAdmin ]);
      })
      .then((tokensArr) => {
        ([ firstToken ] = tokensArr);
        return Store.countDocuments().exec();
      })
      .then((number) => {
        totalStores = number;
        done();
      })
      .catch((err) => {
        done(err);
      });
      
  });
  before(() => {
    [ newStoreData, updateStoreData ] = generateMockStoreData(2);
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });

  context("Admin WITH a 'BusinessAccount' set up, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {
    // TEST GET GET_MANY action correct BusinessAccount //
    describe("GET '/api/stores' - CORRECT 'BusinessAccount' - GET_MANY action", () => {

      it("Should fetch 'Store' models and return a correct response", (done) => {
        chai.request(server)
          .get("/api/stores")
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            fetchedStores = res.body.stores;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.stores).to.be.an("array");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should return only 'Store' models belonging to 'Admins' 'Business' account", () => {
        for (const store of fetchedStores) {
          expect(String(store.businessAccountId)).to.equal(String(firstAdmin.businessAccountId));
        }
      });
      it("Should NOT add nor subtract any 'Store' models to the database", (done) => {
        Store.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST GET GET_MANY action correct BusinessAccount //
    
    // TEST GET GET_ONE action correct BusinessAccount //
    describe("GET '/api/stores/:storeId' - CORRECT 'BusinessAccount' - GET_ONE action", () => {
      let store: IStore;

      it("Should fetch 'Store' models and return a correct response", (done) => {
        chai.request(server)
          .get("/api/stores/" + String(firstAdminsStore._id))
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            store = res.body.store;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.store).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should return the correct 'Store' model and corresponding data", () => {
        expect(JSON.stringify(store)).to.equal(JSON.stringify(firstAdminsStore));
      });
      it("Should NOT alter in any way the 'Store' model in the database", (done) => {
        Store.findOne({ _id: firstAdminsStore._id }).exec()
          .then((foundStore) => {
            expect(JSON.stringify(foundStore)).to.equal(JSON.stringify(firstAdminsStore));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT add nor subtract any 'Store' models to the database", (done) => {
        Store.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST GET_ONE action correct BusinessAccount //

    // TEST POST CREATE action Correct BusinessAccount - valid Data //
    describe("POST '/api/stores/create' - CORRECT 'BusinessAccount' - VALID DATA - CREATE action", () => {
      it("Should create a new 'Store' model, send back correct response", (done) => {
        chai.request(server)
          .post("/api/stores/create")
          .set({ "Authorization": firstToken })
          .send({ ...newStoreData })
          .end((err, res) => {
            if (err) done(err);
            createdStore = res.body.newStore;
            // asssert correct response //
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.newStore).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly set all properties on a new 'Store' model", () => {
        expect(String(createdStore.businessAccountId)).to.equal(String(firstAdmin.businessAccountId));
        expect(createdStore.title).to.equal(newStoreData.title);
        expect(createdStore.description).to.equal(newStoreData.description);
        expect(createdStore.images).to.be.an("array");
        expect(createdStore.images.length).to.equal(0);
        expect(createdStore.numOfItems).to.equal(0);
        expect(createdStore.createdAt).to.be.a("string");
        expect(createdStore.editedAt).to.be.a("string");
      });
      it("Should save the new 'Store' model in the database", (done) => {
        Store.exists({ _id: createdStore._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should INCREASE the number of 'Store' models in the database by 1", (done) => {
        Store.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStores + 1);
            totalStores = number;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST POST CREATE action Correct BusinessAccount - VALID Data //
    
    // TEST PATCH EDIT action Correct BusinessAccount - VALID Data //
    describe("PATCH '/api/stores/update/:storeId' - CORRECT 'BusinessAccount' - VALID DATA - EDIT action", () => {
      it("Should correctly update a 'Store' model, send back correct response", (done) => {
        chai.request(server)
          .patch("/api/stores/update/" + (firstAdminsStore._id))
          .set({ "Authorization": firstToken })
          .send({ ...updateStoreData })
          .end((err, res) => {
            if (err) done(err);
            updatedStore = res.body.editedStore;
            // asssert correct response //
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.editedStore).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly set all properties on an updated 'Store' model", () => {
        expect(String(updatedStore.businessAccountId)).to.equal(String(firstAdmin.businessAccountId));
        expect(updatedStore.title).to.equal(updateStoreData.title);
        expect(updatedStore.description).to.equal(updateStoreData.description);
        expect(updatedStore.images).to.be.an("array");
        expect(updatedStore.images.length).to.equal(0);
        expect(updatedStore.numOfItems).to.equal(0);
        expect(updatedStore.createdAt).to.be.a("string");
        expect(updatedStore.editedAt).to.be.a("string");
        expect(updatedStore.createdAt).to.not.equal(updatedStore.editedAt);
      });
      it("Should save the new 'Store' model in the database", (done) => {
        Store.exists({ _id: updatedStore._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should correctly save all fields in database, edited Store", (done) => {
        Store.findOne({ _id: updatedStore._id })
          .then((savedStore) => {
            expect(JSON.stringify(savedStore)).to.equal(JSON.stringify(updatedStore));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Store' model in the database", (done) => {
        Store.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    
    // END TEST PATCH EDIT action Correct BusinessAccount - VALID Data //

    // TEST DELETE DELETE action Correct BusinessAccount - Valid Data //
    describe("DELETE '/api/stores/delete/:storeId' - CORRECT 'BusinessAccount' - VALID DATA - DELETE action", () => {
      it("Should correctly delete a 'Store' model, send back correct response", (done) => {
        chai.request(server)
          .delete("/api/stores/delete/" + (firstAdminsStore._id))
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            deletedStore = res.body.deletedStore;
            // asssert correct response //
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.deletedStore).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should remove the 'Store' model from the database", (done) => {
        Store.exists({ _id: deletedStore._id })
          .then((exists) => {
            expect(exists).to.equal(false);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should DECREMENT number of 'Store' models in the database exactly by 1", (done) => {
        Store.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStores - 1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST DELETE DELETE action Correct BusinessAccount - Valid Data //
    
  });
 
});