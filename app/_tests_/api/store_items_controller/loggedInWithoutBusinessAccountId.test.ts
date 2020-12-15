// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import faker from "faker";
// server import //
import server from "../../../server";
// models and model interfaces //
import { StoreItemData } from "../../../controllers/store_items_controller/type_declarations/storeItemsControllerTypes";
import { IAdministrator } from "../../../models/Administrator";
import StoreItem, { IStoreItem } from "../../../models/StoreItem";
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { setupStoreItemControllerTests } from "./helpers/testSetupAndCleanup";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";
import { IStore } from "../../../models/Store";

chai.use(chaiHTTP);

describe("StoreItemsController - LOGGED IN - MISSING or WRONG BusinessAccount ID - GET/POST/PATCH/DELETE - API tests", () => {
  let newStoreItemData: StoreItemData;
  let updateStoreItemData: StoreItemData;
  // store models //
  let firstAdminsStore: IStore;
  // storeItem models //
  let firstAdminsStoreItem: IStoreItem;
  // admin models first two have a 'BusinessAccount' set up, third does not //
  let firstAdmin: IAdministrator;
  let secondAdmin: IAdministrator;
  let thirdAdmin: IAdministrator;
  // login jwtTokens //
  let firstAdminToken: string;
  let secondAdminToken: string;
  let thirdAdminToken: string;
  // total number of StoreItem models in database //
  let totalNumberOfStoreItems: number;
  // setup DB, create models, count storeItems //
  before((done) => {
    setupStoreItemControllerTests()
      .then((response) => {
        const { admins, storeItems, stores } = response;
        ({ firstAdmin, secondAdmin, thirdAdmin } = admins);
        ({ firstAdminsStore } = stores);
        [ firstAdminsStoreItem ] = storeItems.firstAdminsStoreItems;
        return StoreItem.countDocuments().exec();
      })
      .then((number) => {
        totalNumberOfStoreItems = number;
        done();
      })
      .catch((err) => {
        done(err);
      })
  });
  // login all admins and set the tokens //
  // yay callbacks //
  before((done) => {
    loginAdmins(chai, server, [ firstAdmin, secondAdmin, thirdAdmin ])
    .then((tokensArr) => {
      [ firstAdminToken, secondAdminToken, thirdAdminToken ] = tokensArr;
      done();
    })
    .catch((err) => {
      done(err);
    })
  });
  // generate mock data for CREATE EDIT actions //
  before(() => {
    newStoreItemData = {
      name: faker.commerce.product(),
      price: faker.commerce.price(100),
      description: faker.lorem.paragraph(),
    };
    updateStoreItemData = {
      name: "updatedName",
      price: "200",
      description: "updated description",
    };
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  
  // CONTEXT 'StoreItemsController' GET_MANY GET_ONE CREATE EDIT DELETE actions without 'BusinessAccount' set up //
  context("Admin without a 'BusinessAccount' set up, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {

    // TEST GET with no business account GET_MANY action //
    describe("GET '/api/store_items - NO 'NO BusinessAccount' - GET_MANY action", () => {

      it("Should NOT allow the GET_MANY action of 'StoreItemsController' and return correct response", (done) => {
        chai.request(server)
          .get("/api/store_items")
          .set({ "Authorization": thirdAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.storeItems).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT modify anything in the 'StoreItem' models in the database", (done) => {
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST GET with no business account GET_MANY action //

    // TEST GET with no business account GET_ONE action //
    describe("GET '/api/store_items/:storeItemId' - NO 'BusinessAccont' - GET_ONE action", () => {

      it("Should NOT allow the GET_ONE action of 'StoreItemsController' and return correct response", (done) => {
        chai.request(server)
          .get("/api/store_items/" + (firstAdminsStoreItem._id as string))
          .set({ "Authorization": thirdAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.storeItem).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT edit the 'StoreItem' in question in any way", (done) => {
        StoreItem.findOne({ _id: firstAdminsStoreItem._id })
          .then((foundStoreItem) => {
            expect(JSON.stringify(foundStoreItem)).to.equal(JSON.stringify(firstAdminsStoreItem));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'StoreItem' model in the database", (done) => {
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST GET with no business acount GET_ONE action //
    
    // TEST Admin with no business account CREATE action //
    describe("POST '/api/store_items/create/:storeId' - NO 'BusinessAccount' - CREATE action", () => {

      it("Should NOT allow CREATE of a 'StoreItem' if admin does not have a 'BusinessAccount' set up", (done) => {
        const storeId = firstAdminsStoreItem._id;
        chai.request(server)
          .post("/api/store_items/create/" + storeId)
          .set({ "Authorization": thirdAdminToken })
          .send({
            ...newStoreItemData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newStoreItem).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT add a new 'StoreItem' model to the database", (done) => {
        StoreItem.countDocuments().exec()
         .then((number) => {
          expect(number).to.equal(totalNumberOfStoreItems);
          done();
         })
         .catch((err) => {
           done(err);
         });
      });

    });
    // END TEST Admin with no business account CREATE action //

    // TEST Admin with no Business account EDIT action //
    describe("PATCH '/api/store_items/edit/:storeId/:storeItemId' - NO 'BusinessAccount' - EDIT action", () => {

      it("Should NOT allow EDIT of a 'StoreItem' if admin does not have a 'BusinessAccount' set up", (done) => {
        const storeId = firstAdminsStore._id as string;
        const storeItemId = firstAdminsStoreItem._id as string;
        chai.request(server)
          .patch(`/api/store_items/update/${storeId}/${storeItemId}`)
          .set({ "Authorization": thirdAdminToken })
          .send({
            ...updateStoreItemData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newStoreItem).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT alter the 'StoreItem' model in question in the database", (done) => {
        StoreItem.findOne({ _id: firstAdminsStoreItem._id }).exec()
          .then((storeItem) => {
            expect(JSON.stringify(storeItem)).to.equal(JSON.stringify(firstAdminsStoreItem));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'StoreItem' models in the database", (done) => {
        StoreItem.countDocuments().exec()
          .then((val) => {
            expect(val).to.equal(totalNumberOfStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST Admin with no Busniess accoint EDIT action //

    // TEST Admin with no Busniess account DELETE action //
    describe("DELETE '/api/store_items/delete/:storeId/:storeItemId' - NO 'BusinessAccount' - DELETE action", () => {

      it("Should NOT allow DELETE of a 'StoreItem' if admin does not have a 'BusinessAccount' set up", (done) => {
        const storeId = firstAdminsStore._id as string;
        const storeItemId = firstAdminsStoreItem._id as string;
        chai.request(server)
          .delete(`/api/store_items/delete/${storeId}/${storeItemId}`)
          .set({ "Authorization": thirdAdminToken })
          .send({
            ...updateStoreItemData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newStoreItem).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT alter the 'StoreItem' model in question in the database", (done) => {
        StoreItem.findOne({ _id: firstAdminsStoreItem._id }).exec()
          .then((storeItem) => {
            expect(JSON.stringify(storeItem)).to.equal(JSON.stringify(firstAdminsStoreItem));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'StoreItem' models in the database", (done) => {
        StoreItem.countDocuments().exec()
          .then((val) => {
            expect(val).to.equal(totalNumberOfStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST Admin with no Busniess account DELETE action //
    
  });
  // END CONTEXT 'StoreItemsController' INDEX GET CREATE EDIT DELETE actions without 'BusinessAccount' set up //

  // CONTEXT 'StoreItemsController' GET_ONE GET EDIT DELETE actions with wrong 'BusinessAccount //
  context("Admin with a wrong 'BusinessAccount' set up GET_ONE, CREATE, EDIT, DELETE actions", () => {
    // TEST GET GET_ONE controller action with wrong 'BusinesAccount' //
    describe("GET '/api/store_items/:storeItemId' - WRONG 'BusinessAccount' - GET_ONE action", () => {

      it("Should NOT return a 'StoreItem' model which belongs to another account", (done) => {
        chai.request(server)
          .get("/api/store_items/" + (firstAdminsStoreItem._id as string))
          .set({ "Authorization": secondAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            // console.log(response)
            expect(response.status).to.equal(401);
            expect(response.body.storeItem).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT edit a 'StoreItem' model in the database in any way", (done) => {
        StoreItem.findOne({ _id: firstAdminsStoreItem._id }).exec()
          .then((storeItem) => {
            expect(JSON.stringify(storeItem)).to.equal(JSON.stringify(firstAdminsStoreItem));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'StoreItem' models in the database", (done) => {
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    
    });
    // END TEST GET GET_ONE controller action with wrong 'BusinessAccount' //
    
    // TEST Admin with wrong business account CREATE action //
    describe("POST '/api/store_items/create/:storeId' - WRONG 'BusinessId - CREATE action", () => {

      it("Should NOT return a 'StoreItem' model which belongs to another account", (done) => {
        const storeId = firstAdminsStore._id as string;
        chai.request(server)
          .post(`/api/store_items/create/${storeId}`)
          .set({ "Authorization": secondAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            // console.log(response)
            expect(response.status).to.equal(401);
            expect(response.body.storeItem).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT edit a 'StoreItem' model in the database in any way", (done) => {
        StoreItem.findOne({ _id: firstAdminsStoreItem._id }).exec()
          .then((storeItem) => {
            expect(JSON.stringify(storeItem)).to.equal(JSON.stringify(firstAdminsStoreItem));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'StoreItem' models in the database", (done) => {
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST Admin with wrong business account CREATE action //

    // TEST Admin with wrong business account EDIT action //
    describe("PATCH '/api/store_items/update/:storeId/:storeItemId' - WRONG 'BusinessAccount' - EDIT action", () => {

      it("Should NOT allow EDIT of a 'StoreItem' if Admin's  'BusinessAccount' _id doesnt match 'StoreItem'", (done) => {
        const storeId = firstAdminsStore._id as string;
        const storeItemId = firstAdminsStoreItem._id as string;
        chai.request(server)
          .patch(`/api/store_items/update/${storeId}/${storeItemId}`)
          .set({ "Authorization": secondAdminToken })
          .send({
            ...newStoreItemData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newStoreItem).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT edit the 'StoreItem' in question in ANY way", (done) => {
        StoreItem.findOne({ _id: firstAdminsStoreItem._id }).exec()
          .then((foundStoreItem) => {
            expect(JSON.stringify(foundStoreItem)).to.equal(JSON.stringify(firstAdminsStoreItem));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'StoreItem' models in the database", (done) => {
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST Admin with wrong business account EDIT action //
    
    // TEST Admin with wrong BusinessAccount DELETE action //
    describe("DELETE '/api/store_items/delete/:storeId/:storeItemId' - WRONG 'BusinessAccount' - DELETE action", () => {
      it("Should NOT allow DELETE of a 'StoreItem' if Admin's  'BusinessAccount' _id doesnt match 'StoreItem'", (done) => {
        const storeId = firstAdminsStore._id as string;
        const storeItemId = firstAdminsStore._id as string;
        chai.request(server)
          .delete(`/api/store_items/delete/${storeId}/${storeItemId}`)
          .set({ "Authorization": secondAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newStoreItem).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT delete the 'StoreItem' from the database", (done) => {
        StoreItem.exists({ _id: firstAdminsStoreItem._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'StoreItem' models in the database", (done) => {
        StoreItem.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfStoreItems);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST Admin with wrong BusinessAccount DELETE action //
    
  });
  // END CONTEXT 'StoreItemsController' EDIT DELETE actions with wrong 'BusinessAcccount //
  
});