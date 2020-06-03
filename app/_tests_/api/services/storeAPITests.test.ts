import { setupDB, clearDB } from "../../helpers/dbHelpers";
import { createStores } from "../../helpers/dataGeneration";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../../../server";
import Store, { IStore } from "../../../models/Store";
import faker from "faker";
import { StoreParams } from "../../../controllers/StoreController";

chai.use(chaiHttp);

describe ("Store API tests", () => {

  before((done) => {
    setupDB()
      .then(() => {
        return createStores(10);
      })
      .then(() => { done() })
      .catch((error) => done(error))
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err))
  })
  
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
  });
  describe("GET { '/api/stores/:_id }", () => {
    let store: IStore, requestedStore: IStore; 
    let responseMsg: string;

    before((done) => {
      Store.find().limit(1)
        .then((foundStores) => {
          store = foundStores[0];
          done();
        })
        .catch((error) => { done(error) });
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
    it("Should return the correct {Service}", (done) => {
      expect(String(requestedStore._id)).to.equal(String(store._id));
      expect(requestedStore.title).to.equal(store.title);
      expect(requestedStore.description).to.equal(store.description);
      done();
    });
  })
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
          done()
        })
    });
    it("Should return the created {Store} and correct data", (done) => {
      expect(createdStore.title).to.equal(newStore.title);
      expect(createdStore.description).to.equal(newStore.description);
      done();
    });
  });

  describe("PATCH { '/api/stores/update/:_id' }", () => {
    let store: IStore, editedStore: IStore;
    const updateData: StoreParams = {
      title: faker.lorem.word(),
      description: faker.lorem.paragraphs(1),
      storeImages: []
    }

    before((done) => {
      Store.find().limit(1)
        .then((stores) => {
          store = stores[0];
          done()
        })
        .catch((error) => { done(error) });
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
        })
    });
    it("Should return the updated {Store} and the updated data", (done) => {
      expect(String(editedStore._id)).to.equal(String(store._id));
      expect(editedStore.title).to.equal(updateData.title);
      expect(editedStore.description).to.equal(updateData.description);
      done();
    });
  });
  
  describe("DELETE { '/api/stores/delete/:_id' }", () => {
    let store: IStore, deletedStore: IStore;

    before((done) => {
      Store.find().limit(1)
        .then((stores) => {
          store = stores[0];
          done();
        })
        .catch((err) => { done(err) });
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
  })
  
})