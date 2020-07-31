import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import faker from "faker";
// server, models //
import server from "../../server";
import StoreItem, { IStoreItem} from "../../models/StoreItem";
import { StoreItemParams } from "../../controllers/StoreItemsController";
// helpers //
import { setupDB, clearDB } from "../helpers/dbHelpers";
import { createStoreItems, createStores } from "../helpers/dataGeneration";

chai.use(chaiHttp);

describe ("StoreItem API tests", () => {
  let totalStoreItems: number; let storeId: string;

  before((done) => {
    setupDB()
      .then(() => createStores(1))
      .then((stores) => {
        storeId = stores[0]._id;
        return createStoreItems(20, storeId);
      })
      .then(() => StoreItem.countDocuments())
      .then((number) => { totalStoreItems = number; done(); })
      .catch((error) => { done(error); });
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  
  describe("GET { '/api/store_items' }", () => {
    let storeItems: IStoreItem[], responseMsg: string;

    it("Should GET all StoreItems", (done) => {
      chai.request(server)
        .get("/api/store_items")
        .end((error, response) => {
          if (error) done(error);
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          storeItems = response.body.storeItems;
          responseMsg = response.body.responseMsg;
          done();
        });
    });
    it("Should have the correct response AND correct default number of StoreItems", () => {
      expect(responseMsg).to.be.a("string");
      expect(storeItems).to.be.an("array");
      expect(storeItems.length).to.equal(10);
    });
  });

  describe("GET { '/api/store_items?query=5' }", () => {
    let storeItems: IStoreItem[], responseMsg: string;

    it("Should GET all StoreItems", (done) => {
      chai.request(server)
        .get("/api/store_items")
        .query({ limit: 5 })
        .end((error, response) => {
          if (error) done(error);
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          storeItems = response.body.storeItems;
          responseMsg = response.body.responseMsg;
          done();
        });
    });
    it("Should have the correct response AND correct number of StoreItems", () => {
      expect(responseMsg).to.be.a("string");
      expect(storeItems).to.be.an("array");
      expect(storeItems.length).to.equal(5);
    });
  });

  describe("GET { '/api/store_items/:_id }", () => {
    let storeItem: IStoreItem, requestedStoreItem: IStoreItem; 

    before((done) => {
      StoreItem.find().limit(1)
        .then((foundStoreItems) => {
          storeItem = foundStoreItems[0];
          done();
        })
        .catch((error) => { done(error); });
    });

    it("Should GET a specific storeItem", (done) => {
      chai.request(server)
        .get("/api/store_items/" + storeItem._id)
        .end((error, response) => {
          if (error) done(error);
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          expect(response.body.responseMsg).to.be.a("string");
          expect(response.body.storeItem).to.be.an("object");
          requestedStoreItem = response.body.storeItem;
          done();
        });
    });
    it("Should return the correct {StoreItem}", (done) => {
      expect(String(requestedStoreItem._id)).to.equal(String(storeItem._id));
      expect(requestedStoreItem.name).to.equal(storeItem.name);
      expect(requestedStoreItem.description).to.equal(storeItem.description);
      done();
    });

  });

  describe("POST { '/api/store_items/create' }", () => {
    let createdStoreItem: IStoreItem; let newData: StoreItemParams;
    before(() => {
      newData = {
        storeId: storeId,
        name: faker.lorem.word(),
        description: faker.lorem.paragraphs(1),
        details: faker.lorem.paragraphs(2),
        price: "100",
        storeItemImages: [],
        categories: ["sports"]
      };
    });
    
    it("Should create a new {StoreItem}", (done) => {
      chai.request(server)
        .post("/api/store_items/create")
        .send(newData)
        .end((err, response) => {
          if (err) done(err);
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          expect(response.body.responseMsg).to.be.a("string");
          expect(response.body.newStoreItem).to.be.an("object");
          createdStoreItem = response.body.newStoreItem;
          done();
        });
    });
    it("Should return the created {StoreItem} and correct data", (done) => {
      expect(createdStoreItem.name).to.equal(newData.name);
      expect(createdStoreItem.description).to.equal(newData.description);
      expect(createdStoreItem.details).to.equal(newData.details);
      expect(createdStoreItem.price).to.equal(newData.price);
      expect(createdStoreItem.categories).to.deep.equal(newData.categories);
      done();
    });
    it("Should INCREASE the number of {StoreItem(s)} by 1", (done) => {
      StoreItem.countDocuments()
        .then((number) => {
          expect(number).to.equal(totalStoreItems + 1);
          totalStoreItems = number;
          done();
        })
        .catch((err) => { done(err); });
    });

  });

  describe("PATCH { '/api/store_items/update/:_id' }", () => {

    let storeItem: IStoreItem, editedStoreItem: IStoreItem;
    const updateData: StoreItemParams = {
      storeId: storeId,
      name: faker.lorem.word(),
      description: faker.lorem.paragraphs(1),
      details: faker.lorem.paragraphs(2),
      price: "200",
      storeItemImages: [],
      categories: ["misc"]
    };

    before((done) => {
      StoreItem.find().limit(1)
        .then((storeItems) => {
          storeItem = storeItems[0];
          done();
        })
        .catch((error) => { done(error); });
    });

    it("Should update an existing {StoreItem}", (done) => {
      chai.request(server)
        .patch("/api/store_items/update/" + storeItem._id)
        .send(updateData)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.responseMsg).to.be.a("string");
          expect(res.body.editedStoreItem).to.be.an("object");
          editedStoreItem = res.body.editedStoreItem;
          done();
        });
    });
    it("Should return the updated {StoreItem} and the updated data", (done) => {
      expect(String(editedStoreItem._id)).to.equal(String(storeItem._id));
      expect(editedStoreItem.name).to.equal(updateData.name);
      expect(editedStoreItem.description).to.equal(updateData.description);
      expect(editedStoreItem.details).to.equal(updateData.details);
      expect(editedStoreItem.price).to.equal(updateData.price);
      expect(editedStoreItem.categories).to.deep.equal(updateData.categories);
      done();
    });
    it("Should NOT INCREASE the number of {StoreItem(s)}", (done) => {
      StoreItem.countDocuments()
        .then((number) => {
          expect(number).to.equal(totalStoreItems);
          done();
        })
        .catch((err) => { done(err); });
    });

  });
  
  describe("DELETE { '/api/store_items/delete/:_id' }", () => {
    let storeItem: IStoreItem, deletedStoreItem: IStoreItem;

    before((done) => {
      StoreItem.find().limit(1)
        .then((storeItems) => {
          storeItem = storeItems[0];
          done();
        })
        .catch((err) => { done(err); });
    });

    it("Should successfully delete a {StoreItem}", (done) => {
      chai.request(server)
        .delete("/api/store_items/delete/" + storeItem._id)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.responseMsg).to.be.a("string");
          expect(res.body.deletedStoreItem).to.be.an("object");
          deletedStoreItem = res.body.deletedStoreItem;
          done();
        });
    });
    it("Should return the deleted {StoreItem} and its data", (done) => {
      expect(String(deletedStoreItem._id)).to.equal(String(storeItem._id));
      done();
    });
    it("Should DECREASE the number of {StoreItem(s)} by 1", (done) => {
      StoreItem.countDocuments()
        .then((number) => {
          expect(number).to.equal(totalStoreItems - 1);
          done();
        })
        .catch((err) => { done(err); });
    });
  });
  
});
