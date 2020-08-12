import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import faker from "faker";
// server, models //
import server from "../../server";
import Store, { IStore } from "../../models/Store";
import { IStoreItem } from "../../models/StoreItem";
import { StoreParams } from "../../controllers/StoreController";
// helpers
import { setupDB, clearDB } from "../helpers/dbHelpers";
import { createStores, createStoreItems } from "../helpers/dataGeneration";

chai.use(chaiHttp);

describe ("Store API tests", () => {
  let totalStores: number; let createdStores: IStore[]; const storeItemPromises: Promise<IStoreItem[]>[] = []

  before((done) => {
    setupDB()
      .then(() => createStores(10))
      .then((stores) => {
        totalStores = stores.length;
        for (const store of stores) {
          storeItemPromises.push(createStoreItems("random", store._id))
        }
        return Promise.all(storeItemPromises);
      })
      .then((storeItemArray) => {
        return Store.find({})
      })
      .then((stores) => {
        createdStores = stores;
        done();
      })
      .catch((error) => { done(error); });
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  
  // generic GET request tests //
  context("GET Request generic", () => {
    describe("GET { '/api/stores' }", () => {
      let stores: IStore[], responseMsg: string;

      it("Should GET all stores", (done) => {
        chai.request(server)
          .get("/api/stores")
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            stores = response.body.stores;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(stores).to.be.an("array");
      });
      it("Should return a default number of Stores", () => {
        expect(stores.length).to.equal(5);
      });
    });
  });
  // END generic GET requests tests //
  // GET requests with queries tests //
  context("GET Requests with specific query options", () => {
    describe("GET { '/api/stores?items=x' }", () => {
      let stores: IStore[], responseMsg: string;
      const items = "desc";

      it("Should GET all stores", (done) => {
        chai.request(server)
          .get(`/api/stores?items=${items}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            stores = response.body.stores;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(stores).to.be.an("array");
      });
      it("Should return a default number of Stores", () => {
        expect(stores.length).to.equal(5);
      });
      it(`Should sort the Stores with number of items in ${items.toUpperCase()} order`, () => {
        for (let i = 0; i < stores.length - 1; i++) {
          const firstStoreItems = stores[i].numOfItems;
          const secondStoreItems = stores[i + 1].numOfItems;
          expect(firstStoreItems >= secondStoreItems).to.equal(true);
        }
      });
    });

    describe("GET { '/api/stores?items=x'&limit=x }", () => {
      let stores: IStore[], responseMsg: string;
      const items = "desc"; const limit = 2;

      it("Should GET all stores", (done) => {
        chai.request(server)
          .get(`/api/stores?items=${items}&limit=${limit}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            stores = response.body.stores;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(stores).to.be.an("array");
      });
      it(`Should return a correct number (${limit}) of Stores`, () => {
        expect(stores.length).to.equal(5);
      });
      it(`Should sort the Stores with number of items in ${items.toUpperCase()} order`, () => {
        for (let i = 0; i < stores.length - 1; i++) {
          const firstStoreItems = stores[i].numOfItems;
          const secondStoreItems =stores[i + 1].numOfItems;
          expect(firstStoreItems >= secondStoreItems).to.equal(true);
        }
      });
    });

    describe("GET { '/api/stores?title=x' }", () => {
      let stores: IStore[], responseMsg: string;
      const title = "asc";

      it("Should GET all stores", (done) => {
        chai.request(server)
          .get(`/api/stores?title=${title}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            stores = response.body.stores;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(stores).to.be.an("array");
      });
      it("Should return a default number of Stores", () => {
        expect(stores.length).to.equal(5);
      });
      it(`Should sort the Stores by title in correct alphabetical ${title.toUpperCase()} order`, () => {
        for (let i = 0; i < stores.length - 1; i++) {
          const firstStoreTitle = stores[i].title;
          const secondStoreTitle =stores[i].title;
          expect(firstStoreTitle <= secondStoreTitle).to.equal(true);
        }
      });
    });

    describe("GET { '/api/stores?title=x&limit=x' }", () => {
      let stores: IStore[], responseMsg: string;
      const title = "asc"; const limit = 2;

      it("Should GET all stores", (done) => {
        chai.request(server)
          .get(`/api/stores?title=${title}&limit=${limit}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            stores = response.body.stores;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(stores).to.be.an("array");
      });
      it(`Should return a correct number (${limit}) of Stores`, () => {
        expect(stores.length).to.equal(limit);
      });
      it(`Should sort the Stores by title in correct alphabetical ${title.toUpperCase()} order`, () => {
        for (let i = 0; i < stores.length - 1; i++) {
          const firstStoreTitle = stores[i].title;
          const secondStoreTitle =stores[i].title;
          expect(firstStoreTitle <= secondStoreTitle).to.equal(true);
        }
      });
    });

  });
  // END requests with queries tests //
  // GET request for specific store tests //
  context("GET Request for specific Product", () => {
    describe("GET { '/api/stores/:_id }", () => {
      let store: IStore, requestedStore: IStore; 
      let responseMsg: string;
  
      before((done) => {
        Store.find().limit(1)
          .then((foundStores) => {
            store = foundStores[0];
            done();
          })
          .catch((error) => { done(error); });
      });
  
      it("Should GET a specific store", (done) => {
        chai.request(server)
          .get("/api/stores/" + store._id)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.store).to.be.an("object");
            responseMsg = response.body.responseMsg;
            requestedStore = response.body.store;
            done();
          });
      });
      it("Should return the correct {Store}", (done) => {
        expect(String(requestedStore._id)).to.equal(String(store._id));
        expect(requestedStore.title).to.equal(store.title);
        expect(requestedStore.description).to.equal(store.description);
        done();
      });
  
    });
  });
  // END request for specific store tests //
  // POST Requests tests //
  context("POST Request CREATE", () => {
    describe("POST { '/api/stores/create' }", ()=> {
      const newStore: StoreParams = {
        title: faker.lorem.word(),
        description: faker.lorem.paragraphs(2),
        storeImages: []
      };
      let createdStore: IStore;

      it("Should create a new {Store}", (done) => {
        chai.request(server)
          .post("/api/stores/create")
          .send(newStore)
          .end((err, response) => {
            if (err) done(err);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.newStore).to.be.an("object");
            createdStore = response.body.newStore;
            done();
          });
      });
      it("Should return the created {Store} and correct data", (done) => {
        expect(createdStore.title).to.equal(newStore.title);
        expect(createdStore.description).to.equal(newStore.description);
        done();
      });
      it("Should INCREASE the number of {Store(s)} by 1", (done) => {
        Store.countDocuments()
          .then((number) => {
            expect(number).to.equal(totalStores + 1);
            totalStores = number;
            done();
          })
          .catch((error) => { done(error); });
      });
    });
  });
  // END POST requests tests //
  // PATCH requests tests //
  context("PATCH Request UPDATE", () => {
    describe("PATCH { '/api/stores/update/:_id' }", () => {

      let store: IStore, editedStore: IStore;
      const updateData: StoreParams = {
        title: faker.lorem.word(),
        description: faker.lorem.paragraphs(1),
        storeImages: []
      };

      before((done) => {
        Store.find().limit(1)
          .then((stores) => {
            store = stores[0];
            done();
          })
          .catch((error) => { done(error); });
      });

      it("Should update an existing {Store}", (done) => {
        chai.request(server)
          .patch("/api/stores/update/" + store._id)
          .send(updateData)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.editedStore).to.be.an("object");
            editedStore = res.body.editedStore;
            done();
          });
      });
      it("Should return the updated {Store} and the updated data", (done) => {
        expect(String(editedStore._id)).to.equal(String(store._id));
        expect(editedStore.title).to.equal(updateData.title);
        expect(editedStore.description).to.equal(updateData.description);
        done();
      });
      it("Should NOT INCREASE the number of {Store(s)}", (done) => {
        Store.countDocuments()
          .then((number) => {
            expect(number).to.equal(totalStores);
            done();
          })
          .catch((err) => { done(err); });
      });

    });
  });
  // END PATCH requests tests //
  // DELETE requests tests //
  context("DELETE Request REMOVE", () => {
    describe("DELETE { '/api/stores/delete/:_id' }", () => {
      let store: IStore, deletedStore: IStore;

      before((done) => {
        Store.find().limit(1)
          .then((stores) => {
            store = stores[0];
            done();
          })
          .catch((err) => { done(err); });
      });

      it("Should successfully delete a {Store}", (done) => {
        chai.request(server)
          .delete("/api/stores/delete/" + store._id)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.deletedStore).to.be.an("object");
            deletedStore = res.body.deletedStore;
            done();
          });
      });
      it("Should return the deleted {Store} and its data", (done) => {
        expect(String(deletedStore._id)).to.equal(String(store._id));
        done();
      });
      it("Should DECREASE the number of {Store(s)} by 1", (done) => {
        Store.countDocuments()
          .then((number) => {
            expect(number).to.equal(totalStores - 1);
            totalStores = number;
            done();
          })
          .catch((err) => { done(err); });
      });
    });
  });
  // END DELETE requests tests //
  
});