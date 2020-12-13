import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import faker from "faker";
// server, models //
import server from "../../server";
import StoreItem, { IStoreItem} from "../../models/StoreItem";
import Store, { IStore } from "../../models/Store";
import { StoreItemParams } from "../../controllers/store_items_controller/StoreItemsController";
// helpers //
import { setupDB, clearDB } from "../helpers/dbHelpers";
import { createStoreItems } from "../helpers/dataGeneration";
import { createStores } from "../helpers/data_generation/storesDataGeneration";

chai.use(chaiHttp);

describe ("StoreItem API tests", () => {
  let totalStoreItems: number; let store: IStore; let stores: IStore[];

  before((done) => {
    setupDB()
      .then(() => createStores(3, null))
      .then((createdStores) => {
        store = createdStores[0];
        const promises: Promise<IStoreItem[]>[] = []
        for (const store of createdStores) {
          promises.push(createStoreItems(20, store._id));
        }
        return Promise.all(promises);
      })
      .then(() => StoreItem.countDocuments())
      .then((number) => { 
        totalStoreItems = number; 
        done(); 
      })
      .catch((error) => { done(error); });
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  // generic GET request tests //
  context("GET Request generic", () => {
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
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(storeItems).to.be.an("array");
      });
      it("Should return a default number of StoreItems", () => {
        expect(storeItems.length).to.equal(10);
      });
    });
  });
  // END generic GET request tests //
  // GET Requests with queries tests //
  context("GET Requests with specific query options", () => {

    describe("GET { '/api/store_items?price=x&limit=x' }", () => {
      let storeItems: IStoreItem[], store: IStore, responseMsg: string;
      const price="desc"; let limit = 25;
      let differentStore = false;

      before((done) => {
        Store.find({}).limit(2).then((stores) => {
          store = stores[0]
          done()
        })
      })
      it("Should GET StoreItems from a variety of Stores", (done) => {
        chai.request(server)
          .get(`/api/store_items?price=${price}&limit=${limit}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            storeItems = response.body.storeItems;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should return correct StoreItems", () => {
        for (const item of storeItems) {
          if (item.storeName !== store.title) {
            differentStore = true;
          }
        }
        expect(differentStore).to.equal(true)
      });
      it(`Should return a correct number=${limit} of StoreItems`, () => {
        expect(storeItems.length).to.equal(limit);
      });
      it(`Should correctly sort StoreItems by price=${price}`, () => {
        for (let i = 0; i < storeItems.length - 1; i++) {
          const firstItemPrice = storeItems[i].price;
          const secondItemPrice = storeItems[i + 1].price;
          expect(firstItemPrice >= secondItemPrice).to.equal(true)
        }
      });
    });

    describe("GET { '/api/store_items?date=x&limit=x' }", () => {
      let storeItems: IStoreItem[], store: IStore, responseMsg: string;
      const date="desc"; let limit = 25;
      let differentStore = false;

      before((done) => {
        Store.find({}).limit(2).then((stores) => {
          store = stores[0]
          done()
        })
      })
      it("Should GET StoreItems from a variety of Stores", (done) => {
        chai.request(server)
          .get(`/api/store_items?date=${date}&limit=${limit}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            storeItems = response.body.storeItems;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should return correct StoreItems", () => {
        for (const item of storeItems) {
          if (item.storeName !== store.title) {
            differentStore = true;
          }
        }
        expect(differentStore).to.equal(true)
      });
      it(`Should return a correct number=${limit} of StoreItems`, () => {
        expect(storeItems.length).to.equal(limit);
      });
      it(`Should correctly sort StoreItems by date=${date}`, () => {
        for (let i = 0; i < storeItems.length - 1; i++) {
          const firstItemDate = storeItems[i].createdAt;
          const secondItemDate = storeItems[i + 1].createdAt;
          expect(firstItemDate >= secondItemDate).to.equal(true)
        }
      });
    });

    describe("GET { '/api/store_items?storeName=x' }", () => {
      let storeItems: IStoreItem[], store: IStore, responseMsg: string;
      before((done) => {
        Store.find({}).limit(2).then((stores) => {
          store = stores[0]
          done()
        })
      })
      it("Should GET only specific StoreItems from a specific Store", (done) => {
        chai.request(server)
          .get(`/api/store_items?storeName=${store.title}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            storeItems = response.body.storeItems;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should return correct StoreItems", () => {
        for (const item of storeItems) {
          expect(item.storeName).to.equal(store.title);
        }
      });
      it("Should return a default number of StoreItems", () => {
        expect(storeItems.length).to.equal(10);
      });
    });

    describe("GET { '/api/store_items?storeName=x&limit=x' }", () => {
      let storeItems: IStoreItem[], store: IStore, responseMsg: string;
      const limit = 5;

      before((done) => {
        Store.find({}).limit(2).then((stores) => {
          store = stores[0]
          done()
        })
      })
      it("Should GET only specific StoreItems from a specific Store", (done) => {
        chai.request(server)
          .get(`/api/store_items?storeName=${store.title}&limit=${limit}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            storeItems = response.body.storeItems;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should return correct StoreItems", () => {
        for (const item of storeItems) {
          expect(item.storeName).to.equal(store.title);
        }
      });
      it(`Should return a specific number=${limit} of StoreItems`, () => {
        expect(storeItems.length).to.equal(limit);
      });
    });

    describe("GET { '/api/store_items?storeName=x&price=x' }", () => {
      let storeItems: IStoreItem[], store: IStore, responseMsg: string;
      const price = "asc";

      before((done) => {
        Store.find({}).limit(2).then((stores) => {
          store = stores[0];
          done();
        });
      });
      it("Should GET only specific StoreItems from a specific Store", (done) => {
        chai.request(server)
          .get(`/api/store_items?storeName=${store.title}&price=${price}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            storeItems = response.body.storeItems;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should return correct StoreItems", () => {
        for (const item of storeItems) {
          expect(item.storeName).to.equal(store.title);
        }
      });
      it("Should return a default number of StoreItems", () => {
        expect(storeItems.length).to.equal(10);
      });
      it(`Should correctly sort StoreItems by price=${price}`, () => {
        for (let i = 0; i < storeItems.length - 1; i++) {
          const firstItemPrice = storeItems[i].price;
          const secondItemPrice = storeItems[i + 1].price;
          expect(firstItemPrice <= secondItemPrice).to.equal(true)
        }
      });
    });

    describe("GET { '/api/store_items?storeName=x&price=x&limit=x' }", () => {
      let storeItems: IStoreItem[], store: IStore, responseMsg: string;
      const price = "asc"; const limit = 5;

      before((done) => {
        Store.find({}).limit(2).then((stores) => {
          store = stores[0];
          done();
        });
      });
      it("Should GET only specific StoreItems from a specific Store", (done) => {
        chai.request(server)
          .get(`/api/store_items?storeName=${store.title}&price=${price}&limit=${limit}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            storeItems = response.body.storeItems;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should return correct StoreItems", () => {
        for (const item of storeItems) {
          expect(item.storeName).to.equal(store.title);
        }
      });
      it(`Should return a corect number=${limit} of StoreItems`, () => {
        expect(storeItems.length).to.equal(limit);
      });
      it(`Should correctly sort StoreItems by price=${price}`, () => {
        for (let i = 0; i < storeItems.length - 1; i++) {
          const firstItemPrice = storeItems[i].price;
          const secondItemPrice = storeItems[i + 1].price;
          expect(firstItemPrice <= secondItemPrice).to.equal(true)
        }
      });
    });

    describe("GET { '/api/store_items?storeName=x&date=x' }", () => {
      let storeItems: IStoreItem[], store: IStore, responseMsg: string;
      const date = "desc";

      before((done) => {
        Store.find({}).limit(2).then((stores) => {
          store = stores[0];
          done();
        });
      });
      it("Should GET only specific StoreItems from a specific Store", (done) => {
        chai.request(server)
          .get(`/api/store_items?storeName=${store.title}&date=${date}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            storeItems = response.body.storeItems;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should return correct StoreItems", () => {
        for (const item of storeItems) {
          expect(item.storeName).to.equal(store.title);
        }
      });
      it("Should return a default number of StoreItems", () => {
        expect(storeItems.length).to.equal(10);
      });
      it(`Should correctly sort StoreItems by date=${date}`, () => {
        for (let i = 0; i < storeItems.length - 1; i++) {
          const firstItemDate= storeItems[i].createdAt;
          const secondItemDate = storeItems[i + 1].createdAt;
          expect(firstItemDate >= secondItemDate).to.equal(true)
        }
      });
    });

    describe("GET { '/api/store_items?storeName=x&date=x&limit=x' }", () => {
      let storeItems: IStoreItem[], store: IStore, responseMsg: string;
      const date = "desc"; const limit = 5;

      before((done) => {
        Store.find({}).limit(2).then((stores) => {
          store = stores[0];
          done();
        });
      });
      it("Should GET only specific StoreItems from a specific Store", (done) => {
        chai.request(server)
          .get(`/api/store_items?storeName=${store.title}&date=${date}&limit=${limit}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            storeItems = response.body.storeItems;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should return correct StoreItems", () => {
        for (const item of storeItems) {
          expect(item.storeName).to.equal(store.title);
        }
      });
      it(`Should return a corect number=${limit} of StoreItems`, () => {
        expect(storeItems.length).to.equal(limit);
      });
      it(`Should correctly sort StoreItems by date=${date}`, () => {
        for (let i = 0; i < storeItems.length - 1; i++) {
          const firstItemDate= storeItems[i].createdAt;
          const secondItemDate = storeItems[i + 1].createdAt;
          expect(firstItemDate >= secondItemDate).to.equal(true)
        }
      });
    });

  });
  // END GET Requests with queries tests //
  // GET requests for one item tests //
  context("GET Request for specific Item", () => {
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
  });
  // END GET Requests for one item tests //
  // POST Requests tests //
  context("POST Request CREATE", () => {
    describe("POST { '/api/store_items/create' }", () => {
      let createdStoreItem: IStoreItem; let newData: StoreItemParams;
      before(() => {
        newData = {
          storeId: store._id,
          storeName: store.title,
          name: faker.lorem.word(),
          description: faker.lorem.paragraphs(1),
          details: faker.lorem.paragraphs(2),
          price: 100,
          images: [],
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
        expect(createdStoreItem.price).to.equal(newData.price as number);
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
  });
  // END POST requests tests //
  // PATCH requests tests //
  context("PATCH Request UPDATE", () => {
    describe("PATCH { '/api/store_items/update/:_id' }", () => {

      let storeItem: IStoreItem; let editedStoreItem: IStoreItem;
      let updateData: StoreItemParams;
      before((done) => {
        updateData = {
          storeId: store._id,
          storeName: store.title,
          name: faker.lorem.word(),
          description: faker.lorem.paragraphs(1),
          details: faker.lorem.paragraphs(2),
          price: 200,
          images: [],
          categories: ["misc"]
        };
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
        expect(editedStoreItem.price).to.eq(updateData.price);
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
  });
  // END PATCH requests tests //
  // DELETE requests tests //
  context("DELETE Request REMOVE", () => {
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
});
