// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server import /
import server from "../../../server";
// models and model interfaces //
import { StoreItemData } from "../../../controllers/store_items_controller/type_declarations/storeItemsControllerTypes";
import { IAdministrator } from "../../../models/Administrator";
import StoreItem, { IStoreItem } from "../../../models/StoreItem";
// helpers and validators//
import { clearDB } from "../../helpers/dbHelpers";
import { generateMockStoreItemsData } from "../../helpers/data_generation/storeItemDataGenerations"; 
import { setupStoreItemControllerTests } from "./helpers/testSetupAndCleanup";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";
import { IStore } from "../../../models/Store";

chai.use(chaiHTTP);

describe("StoreItemsController - Logged In WITH CORRECT BusinessAccount ID - INVALID DATA - PATCH/POST - API tests", () => {
  let firstAdmin: IAdministrator;
  let firstAdminsStore: IStore;
  let firstAdminsStoreItem: IStoreItem;
  let firstToken: string;
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
        [ firstAdminsStoreItem ] = response.storeItems.firstAdminsStoreItems;
        return loginAdmins(chai, server, [ firstAdmin ]);
      })
      .then((tokensArr) => {
        ([ firstToken ] = tokensArr);
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

  // CONTEXT  POST CREATE action Correct BusinessAccount - Invalid Data CREATE, EDIT ACTIONS //
  context("Admin WITH a 'BusinessAccount' set up, CREATE, EDIT actions", () => {
    
    // TEST POST CREATE action Correct BusinessAccount - Invalid Data //
    describe("POST '/api/store_items/create/:storeId' - CORRECT 'BusinessAccount' - INVALID DATA", () => {
      it("Should NOT create a new 'StoreItem' model without a 'name' property", (done) => {
        chai.request(server)
          .post("/api/store_items/create/" + (firstAdminsStore._id as string))
          .set({ "Authorization": firstToken })
          .send({
            ...newStoreItemData,
            name: ""
          })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            // console.log(res.body)
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.errorMessages[0]).to.be.a("string");
            expect(res.body.newStoreItem).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new 'StoreItem' model without a 'price' property", (done) => {
        chai.request(server)
          .post("/api/store_items/create/" + (firstAdminsStore._id as string))
          .set({ "Authorization": firstToken })
          .send({
            ...newStoreItemData,
            price: ""
          })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.errorMessages[0]).to.be.a("string");
            expect(res.body.newStoreItem).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new 'StoreItem' model without a 'description' property", (done) => {
        chai.request(server)
          .post("/api/store_items/create/" + (firstAdminsStore._id as string))
          .set({ "Authorization": firstToken })
          .send({
            ...newStoreItemData,
            description: ""
          })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.errorMessages[0]).to.be.a("string");
            expect(res.body.newStoreItem).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new 'StoreItem' model without a 'details' property", (done) => {
        chai.request(server)
          .post("/api/store_items/create/" + (firstAdminsStore._id as string))
          .set({ "Authorization": firstToken })
          .send({
            ...newStoreItemData,
            details: ""
          })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.errorMessages[0]).to.be.a("string");
            expect(res.body.newStoreItem).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new 'StoreItem' model without a 'categories' property", (done) => {
        chai.request(server)
          .post("/api/store_items/create/" + (firstAdminsStore._id as string))
          .set({ "Authorization": firstToken })
          .send({
            ...newStoreItemData,
            details: ""
          })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.errorMessages[0]).to.be.a("string");
            expect(res.body.newStoreItem).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new 'StoreItem' model with all empty properties", (done) => {
        chai.request(server)
          .post("/api/store_items/create/" + (firstAdminsStore._id as string))
          .set({ "Authorization": firstToken })
          .send({})
          .end((err, res) => {
            if (err) done(err);
            const errorsArr: string[] = res.body.errorMessages;
            // assert correct response //
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(4);
            expect(res.body.newStoreItem).to.be.undefined;
            for (const errorMsg of errorsArr) {
              expect(errorMsg).to.be.a("string");
            }
            done();
          });
      });
      it("Should NOT modify the number of 'StoreItem' models in the database", (done) => {
        StoreItem.countDocuments({}).exec()
          .then((number) => {
            expect(number).to.equal(totalStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST POST CREATE action Correct BusinessAccount - Invalid Data //
    
    // TEST PATCH EDIT action Correct BusinessAccount - Invalid Data //
    describe("PATCH '/api/producs/update/:storeId/:storeItemId' - CORRECT 'BusinessAccount' - INVALID DATA", () => {
      it("Should NOT update an existing 'StoreItem' model without a 'name' property", (done) => {
        const storeId = firstAdminsStore._id;
        const storeItemId = firstAdminsStoreItem._id;
        chai.request(server)
          .patch(`/api/store_items/update/${storeId}/${storeItemId}` )
          .set({ "Authorization": firstToken })
          .send({
            ...newStoreItemData,
            name: ""
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.errorMessages[0]).to.be.a("string");
            expect(res.body.editedStoreItem).to.be.undefined;
            done();
          });
      });
      it("Should NOT update an existing 'StoreItem' model without a 'price' property", (done) => {
        const storeId = firstAdminsStore._id;
        const storeItemId = firstAdminsStoreItem._id;
        chai.request(server)
          .patch(`/api/store_items/update/${storeId}/${storeItemId}`)
          .set({ "Authorization": firstToken })
          .send({
            ...newStoreItemData,
            price: ""
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.errorMessages[0]).to.be.a("string");
            expect(res.body.editedStoreItem).to.be.undefined;
            done();
          });
      });
      it("Should NOT update an existing 'StoreItem' model without a 'description' property", (done) => {
        const storeId = firstAdminsStore._id;
        const storeItemId = firstAdminsStoreItem._id;
        chai.request(server)
          .patch(`/api/store_items/update/${storeId}/${storeItemId}`)
          .set({ "Authorization": firstToken })
          .send({
            ...newStoreItemData,
            description: ""
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.errorMessages[0]).to.be.a("string");
            expect(res.body.editedStoreItem).to.be.undefined;
            done();
          });
      });
      it("Should NOT update an existing 'StoreItem' model with all empty properties", (done) => {
        const storeId = firstAdminsStore._id;
        const storeItemId = firstAdminsStoreItem._id;
        chai.request(server)
          .patch(`/api/store_items/update/${storeId}/${storeItemId}`)
          .set({ "Authorization": firstToken })
          .send({})
          .end((err, res) => {
            if (err) done(err);
            const errorsArr: string[] = res.body.errorMessages;
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(4);
            expect(res.body.editedStoreItem).to.be.undefined;
            for (const errorMsg of errorsArr) {
              expect(errorMsg).to.be.a("string");
            }
            done();
          });
      });
      it("Should NOT alter the 'StoreItem' model in question in any way", (done) => {
        StoreItem.findOne({ _id: firstAdminsStoreItem._id }).exec()
          .then((store_item) => {
            expect(JSON.stringify(store_item)).to.equal(JSON.stringify(firstAdminsStoreItem));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number 'StoreItem' models in the database", (done) => {
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
    // END TEST PATCH EDIT action Correct BusinessAccount - Invalid Data //
  
  });
  // END CONTEXT POST CREATE action Correct BusinessAccount - Invalid Data CREATE, EDIT ACTIONS //

});