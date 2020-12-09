// testing dependencies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import faker from "faker";
// server import //
import server from "../../../server";
// models and model interfaces //
import { StoreData } from "../../../controllers/stores_controller/type_declarations/storesControllerTypes";
import { IAdministrator } from "../../../models/Administrator";
import Store, { IStore } from "../../../models/Store";
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { setupStoreControllerTests } from "./_helpers/storeContTestHelpers";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";

chai.use(chaiHTTP);

describe("StoresController - Logged In WITH WRONG or MISSING BusinessAccount ID - GET/POST/PATCH/DELETE - API tests", () => {
  let newStoreData: StoreData;
  let updateStoreData: StoreData;
  // store models //
  let firstAdminsStore: IStore;
  let secondAdminsStore: IStore;
  // admin models first two have a 'BusinessAccount' set up, third does not //
  let firstAdmin: IAdministrator;
  let secondAdmin: IAdministrator;
  let thirdAdmin: IAdministrator;
  // login jwtTokens //
  let firstAdminToken: string;
  let secondAdminToken: string;
  let thirdAdminToken: string;
  // total number of Store models in database //
  let totalNumberOfStores: number;
  // setup DB, create models, count stores //
  before((done) => {
    setupStoreControllerTests()
      .then((response) => {
        const { admins, stores } = response;
        ({ firstAdmin, secondAdmin, thirdAdmin } = admins);
        ({ firstAdminsStore, secondAdminsStore } = stores);
        return Store.countDocuments().exec();
      })
      .then((number) => {
        totalNumberOfStores = number;
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
    newStoreData = {
      title: faker.commerce.product(),
      description: faker.lorem.paragraph()
    };
    updateStoreData = {
      title: "updatedTitle",
      description: "updated description"
    };
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  
  // CONTEXT 'StoresController' GET_MANY GET_ONE CREATE EDIT DELETE actions without 'BusinessAccount' set up //
  context("Admin without a 'BusinessAccount' set up, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {
    
    // TEST GET with no business account GET_MANY action //
    describe("GET '/api/stores - NO 'NO BusinessAccount' - GET_MANY action", () => {

      it("Should NOT allow the GET_MANY action of 'StoresController' and return correct response", (done) => {
        chai.request(server)
          .get("/api/stores")
          .set({ "Authorization": thirdAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.stores).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT modify anything in the 'Store' models in the database", (done) => {
        Store.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST GET with no business account GET_MANY action //

    // TEST GET with no business account GET_ONE action //
    describe("GET '/api/stores/:storeId' - NO 'BusinessAccont' - GET_ONE action", () => {

      it("Should NOT allow the GET_ONE action of 'StoresController' and return correct response", (done) => {
        chai.request(server)
          .get("/api/stores/" + (firstAdminsStore._id as string))
          .set({ "Authorization": thirdAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.store).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT edit the 'Store' in question in any way", (done) => {
        Store.findOne({ _id: firstAdminsStore._id })
          .then((foundStore) => {
            expect(JSON.stringify(foundStore)).to.equal(JSON.stringify(firstAdminsStore));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Store' model in the database", (done) => {
        Store.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST GET with no business acount GET_ONE action //
    
    // TEST Admin with no business account CREATE action //
    describe("POST '/api/stores/create' - NO 'BusinessAccount' - CREATE action", () => {

      it("Should NOT allow CREATE of a 'Store' if admin does not have a 'BusinessAccount' set up", (done) => {
        chai.request(server)
          .post("/api/stores/create")
          .set({ "Authorization": thirdAdminToken })
          .send({
            ...newStoreData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newStore).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT add a new 'Store' model to the database", (done) => {
        Store.countDocuments().exec()
         .then((number) => {
          expect(number).to.equal(totalNumberOfStores);
          done();
         })
         .catch((err) => {
           done(err);
         });
      });

    });
    // END TEST Admin with no business account CREATE action //
    
    // TEST Admin with no Business account EDIT action //
    describe("PATCH '/api/stores/edit/:storeId' - NO 'BusinessAccount' - EDIT action", () => {

      it("Should NOT allow EDIT of a 'Store' if admin does not have a 'BusinessAccount' set up", (done) => {
        chai.request(server)
          .patch("/api/stores/update/" + (firstAdminsStore._id as string))
          .set({ "Authorization": thirdAdminToken })
          .send({
            ...updateStoreData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newStore).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT alter the 'Store' model in question in the database", (done) => {
        Store.findOne({ _id: firstAdminsStore._id }).exec()
          .then((store) => {
            expect(JSON.stringify(store)).to.equal(JSON.stringify(firstAdminsStore));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Store' models in the database", (done) => {
        Store.countDocuments().exec()
          .then((val) => {
            expect(val).to.equal(totalNumberOfStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST Admin with no Busniess accoint EDIT action //
    
    // TEST Admin with no Busniess account DELETE action //
    describe("DELETE '/api/stores/delete/:storeId' - NO 'BusinessAccount' - DELETE action", () => {

      it("Should NOT allow DELETE of a 'Store' if admin does not have a 'BusinessAccount' set up", (done) => {
        chai.request(server)
          .delete("/api/stores/delete/" + String(firstAdminsStore._id))
          .set({ "Authorization": thirdAdminToken })
          .send({
            ...updateStoreData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newStore).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT alter the 'Store' model in question in the database", (done) => {
        Store.findOne({ _id: firstAdminsStore._id }).exec()
          .then((store) => {
            expect(JSON.stringify(store)).to.equal(JSON.stringify(firstAdminsStore));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Store' models in the database", (done) => {
        Store.countDocuments().exec()
          .then((val) => {
            expect(val).to.equal(totalNumberOfStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST Admin with no Busniess account DELETE action //
    
  });
  // END CONTEXT 'StoresController' INDEX GET CREATE EDIT DELETE actions without 'BusinessAccount' set up //
  
  // CONTEXT 'StoresController' GET_ONE GET EDIT DELETE actions with wrong 'BusinessAccount //
  context("Admin with a wrong 'BusinessAccount' set up GET_ONE, EDIT, DELETE actions", () => {
    
    // TEST GET GET_ONE controller action with wrong 'BusinesAccount' //
    describe("GET '/api/stores/:storeId' - WRONG 'BusinessAccount' - GET_ONE action", () => {

      it("Should NOT return a 'Store' model which belongs to another account", (done) => {
        chai.request(server)
          .get("/api/stores/" + String(firstAdminsStore._id) )
          .set({ "Authorization": secondAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.store).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT edit a 'Store' model in the database in any way", (done) => {
        Store.findOne({ _id: firstAdminsStore._id }).exec()
          .then((store) => {
            expect(JSON.stringify(store)).to.equal(JSON.stringify(firstAdminsStore));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Store' models in the database", (done) => {
        Store.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    
    });
    // END TEST GET GET_ONE controller action with wrong 'BusinessAccount' //
    
    // TEST Admin with wrong business account EDIT action //
    describe("PATCH '/api/stores/update/:storeId' - WRONG 'BusinessAccount' - EDIT action", () => {
      it("Should NOT allow EDIT of a 'Store' if Admin's  'BusinessAccount' _id doesnt match 'Store'", (done) => {
        chai.request(server)
          .patch("/api/stores/update/" + String(firstAdminsStore._id))
          .set({ "Authorization": secondAdminToken })
          .send({
            ...newStoreData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newStore).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT edit the 'Store' in question in ANY way", (done) => {
        Store.findOne({ _id: firstAdminsStore._id }).exec()
          .then((foundStore) => {
            expect(JSON.stringify(foundStore)).to.equal(JSON.stringify(firstAdminsStore));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Store' models in the database", (done) => {
        Store.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST Admin with wrong business account EDIT action //
    
    // TEST Admin with wrong BusinessAccount DELETE action //
    describe("DELETE '/api/stores/delete/:storeId' - WRONG 'BusinessAccount' - DELETE action", () => {
      it("Should NOT allow DELETE of a 'Store' if Admin's  'BusinessAccount' _id doesnt match 'Store'", (done) => {
        chai.request(server)
          .delete("/api/stores/delete/" + String(firstAdminsStore._id))
          .set({ "Authorization": secondAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newStore).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT delete the 'Store' from the database", (done) => {
        Store.exists({ _id: firstAdminsStore._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Store' models in the database", (done) => {
        Store.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST Admin with wrong BusinessAccount DELETE action //
    
  });
  // END CONTEXT 'StoresController' EDIT DELETE actions with wrong 'BusinessAcccount //
  
});