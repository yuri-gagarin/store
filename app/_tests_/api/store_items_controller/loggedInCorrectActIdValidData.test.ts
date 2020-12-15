// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server import /
import server from "../../../server";
// models and model interfaces //
import { StoreItemData } from "../../../controllers/store_items_controller/type_declarations/storeItemsControllerTypes";
import { IAdministrator } from "../../../models/Administrator";
import StoreItem, { IStoreItem } from "../../../models/StoreItem";
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { generateMockStoreItemsData } from "../../helpers/data_generation/storeItemDataGenerations"; 
import { setupStoreItemControllerTests } from "./helpers/testSetupAndCleanup";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";
import { IStore } from "../../../models/Store";
import { response } from "express";

chai.use(chaiHTTP);

describe("StoreItemsController - Logged In WITH CORRECT BusinessAccount ID - VALID DATA - GET/POST/PATCH/DELETE  - API tests", () => {
  let firstAdmin: IAdministrator;
  let firstAdminsStore: IStore;
  let firstAdminsStoreItems: IStoreItem[];
  let firstAdminsToken: string;
  // varibales for API query results //
  let storeItem: IStoreItem;
  let fetchedStoreItems: IStoreItem[];
  let createdStoreItem: IStoreItem;
  let updatedStoreItem: IStoreItem;
  let deletedStoreItem: IStoreItem;
  let totalStoreItems: number;
  // mockData //
  let newStoreItemData: StoreItemData;
  let updateStoreItemData: StoreItemData;

  // database and model data setup //
  // logins and jwtTokens //
  before((done) => {
    setupStoreItemControllerTests()
      .then((response) => {
        ({ firstAdmin } = response.admins);
        ({ firstAdminsStore } = response.stores);
        ({ firstAdminsStoreItems } = response.storeItems);
        return loginAdmins(chai, server, [ firstAdmin ]);
      })
      .then((tokensArr) => {
        ([ firstAdminsToken ] = tokensArr);
        return StoreItem.countDocuments().exec();
      })
      .then((number) => {
        totalStoreItems = number;
        done();
      })
      .catch((err) => {
        done(err);
      });
      
  });
  before(() => {
    [ newStoreItemData, updateStoreItemData ] = generateMockStoreItemsData(2, firstAdminsStore);
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });

  context("Admin WITH a 'BusinessAccount' set up, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {
    /*
    // TEST GET GET_MANY action correct BusinessAccount //
    describe("GET '/api/store_items' - CORRECT 'BusinessAccount' - GET_MANY action", () => {

      it("Should fetch 'StoreItem' models and return a correct response", (done) => {
        chai.request(server)
          .get("/api/store_items")
          .set({ "Authorization": firstAdminsToken })
          .end((err, res) => {
            if (err) done(err);
            fetchedStoreItems = res.body.storeItems;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.storeItems).to.be.an("array");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should return only 'StoreItem' models belonging to 'Admins' 'Business' account", () => {
        for (const store_item of fetchedStoreItems) {
          expect(String(store_item.businessAccountId)).to.equal(String(firstAdmin.businessAccountId));
        }
      });
      it("Should NOT add nor subtract any 'StoreItem' models to the database", (done) => {
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST GET GET_MANY action correct BusinessAccount //
    
    // TEST GET GET_ONE action correct BusinessAccount //
    describe("GET '/api/store_items/:storeItemId' - CORRECT 'BusinessAccount' - GET_ONE action", () => {

      it("Should fetch 'StoreItem' models and return a correct response", (done) => {
        const storeItemId = firstAdminsStoreItems[0]._id as string;
        chai.request(server)
          .get("/api/store_items/" + storeItemId)
          .set({ "Authorization": firstAdminsToken })
          .end((err, res) => {
            if (err) done(err);
            storeItem = res.body.storeItem;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.storeItem).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should return the correct 'StoreItem' model and corresponding data", () => {
        expect(JSON.stringify(storeItem)).to.equal(JSON.stringify(firstAdminsStoreItems[0]));
      });
      it("Should NOT alter in any way the 'StoreItem' model in the database", (done) => {
        StoreItem.findOne({ _id: firstAdminsStoreItems[0]._id }).exec()
          .then((foundStoreItem) => {
            expect(JSON.stringify(foundStoreItem)).to.equal(JSON.stringify(firstAdminsStoreItems[0]));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT add nor subtract any 'StoreItem' models to the database", (done) => {
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST GET_ONE action correct BusinessAccount //
    */
    // TEST POST CREATE action Correct BusinessAccount - valid Data //
    describe("POST '/api/producs/create/:storeId' - CORRECT 'BusinessAccount' - VALID DATA - CREATE action", () => {

      it("Should create a new 'StoreItem' model, send back correct response", (done) => {
        const storeId = firstAdminsStore._id as string;
        chai.request(server)
          .post("/api/store_items/create/" +storeId)
          .set({ "Authorization": firstAdminsToken })
          .send({ ...newStoreItemData })
          .end((err, res) => {
            if (err) done(err);
            createdStoreItem = res.body.newStoreItem;
            // asssert correct response //
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.newStoreItem).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly set all properties on a new 'StoreItem' model", () => {
        expect(String(createdStoreItem.businessAccountId)).to.equal(String(firstAdmin.businessAccountId));
        expect(createdStoreItem.name).to.equal(newStoreItemData.name);
        expect(createdStoreItem.price.toString()).to.equal(parseInt((newStoreItemData.price as string)).toString());
        expect(createdStoreItem.description).to.equal(newStoreItemData.description);
        expect(createdStoreItem.images).to.be.an("array");
        expect(createdStoreItem.images.length).to.equal(0);
        expect(createdStoreItem.createdAt).to.be.a("string");
        expect(createdStoreItem.editedAt).to.be.a("string");
      });
      it("Should save the new 'StoreItem' model in the database", (done) => {
        StoreItem.exists({ _id: createdStoreItem._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should INCREASE the number of 'StoreItem' models in the database by 1", (done) => {
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStoreItems + 1);
            totalStoreItems = number;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST POST CREATE action Correct BusinessAccount - VALID Data //
    
    // TEST PATCH EDIT action Correct BusinessAccount - VALID Data //
    describe("PATCH '/ap/store_items/update/:storeId/:storeItemId' - CORRECT 'BusinessAccount' - VALID DATA - EDIT action", () => {

      it("Should correctly update a 'StoreItem' model, send back correct response", (done) => {
        const storeId = firstAdminsStore._id as string;
        const storeItemId = firstAdminsStoreItems[0]._id as string;
        chai.request(server)
          .patch(`/api/store_items/update/${storeId}/${storeItemId}`)
          .set({ "Authorization": firstAdminsToken })
          .send({ ...updateStoreItemData })
          .end((err, res) => {
            if (err) done(err);
            updatedStoreItem = res.body.editedStoreItem;
            // asssert correct response //
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.editedStoreItem).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly set all properties on an updated 'StoreItem' model", () => {
        expect(String(updatedStoreItem.businessAccountId)).to.equal(String(firstAdmin.businessAccountId));
        expect(updatedStoreItem.name).to.equal(updateStoreItemData.name);
        expect(updatedStoreItem.price.toString()).to.equal(parseInt((updateStoreItemData.price as string)).toString());
        expect(updatedStoreItem.description).to.equal(updateStoreItemData.description);
        expect(updatedStoreItem.images).to.be.an("array");
        expect(updatedStoreItem.images.length).to.equal(0);
        expect(updatedStoreItem.createdAt).to.be.a("string");
        expect(updatedStoreItem.editedAt).to.be.a("string");
        expect(updatedStoreItem.createdAt).to.not.equal(updatedStoreItem.editedAt);
      });
      it("Should save the new 'StoreItem' model in the database", (done) => {
        StoreItem.exists({ _id: updatedStoreItem._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should correctly save all fields in database, edited StoreItem", (done) => {
        StoreItem.findOne({ _id: updatedStoreItem._id })
          .then((savedStoreItem) => {
            expect(JSON.stringify(savedStoreItem)).to.equal(JSON.stringify(updatedStoreItem));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'StoreItem' model in the database", (done) => {
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    
    // END TEST PATCH EDIT action Correct BusinessAccount - VALID Data //
    /*
    // TEST DELETE DELETE action Correct BusinessAccount - Valid Data //
    describe("DELETE '/api/store_items/delete/:storeId/:storeItemId' - CORRECT 'BusinessAccount' - VALID DATA - DELETE action", () => {
      
      it("Should correctly delete a 'StoreItem' model, send back correct response", (done) => {
        const storeId = firstAdminsStore._id as string;
        const storeItemId = firstAdminsStoreItems[0]._id as string;
        chai.request(server)
          .delete(`/api/store_items/delete/${storeId}/${storeItemId}`)
          .set({ "Authorization": firstAdminsToken })
          .end((err, res) => {
            if (err) done(err);
            deletedStoreItem = res.body.deletedStoreItem;
            // asssert correct response //
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.deletedStoreItem).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should remove the 'StoreItem' model from the database", (done) => {
        StoreItem.exists({ _id: deletedStoreItem._id })
          .then((exists) => {
            expect(exists).to.equal(false);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should DECREMENT number of 'StoreItem' models in the database exactly by 1", (done) => {
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStoreItems - 1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST DELETE DELETE action Correct BusinessAccount - Valid Data //
    */
  });
 
});