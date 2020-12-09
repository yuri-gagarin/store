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

describe("StoresController - Logged In WITH CORRECT BusinessAccount ID - INVALID DATA - PATCH/POST - API tests", () => {
  let firstAdmin: IAdministrator;
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

  context("Admin WITH a 'BusinessAccount' set up, CREATE, EDIT actions", () => {
    // TEST POST CREATE action Correct BusinessAccount - Invalid Data //
    describe("POST '/api/stores/create' - CORRECT 'BusinessAccount' - INVALID DATA - CREATE action", () => {
      it("Should NOT create a new 'Store' model without a 'title' property", (done) => {
        chai.request(server)
          .post("/api/stores/create")
          .set({ "Authorization": firstToken })
          .send({
            ...newStoreData,
            title: ""
          })
          .end((err, res) => {
            //console.log(res)
            if (err) done(err);
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.errorMessages[0]).to.be.a("string");
            expect(res.body.newStore).to.be.undefined;
            done();
          });
      });
      
      it("Should NOT create a new 'Store' model without a 'description' property", (done) => {
        chai.request(server)
          .post("/api/stores/create")
          .set({ "Authorization": firstToken })
          .send({
            ...newStoreData,
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
            expect(res.body.newStore).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new 'Store' model with all empty properties", (done) => {
        chai.request(server)
          .post("/api/stores/create")
          .set({ "Authorization": firstToken })
          .send({})
          .end((err, res) => {
            if (err) done(err);
            const errorsArr: string[] = res.body.errorMessages;
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(2);
            expect(res.body.newStore).to.be.undefined;
            for (const errorMsg of errorsArr) {
              expect(errorMsg).to.be.a("string");
            }
            done();
          });
      });
      it("Should NOT modify the number of 'Store' models in the database", (done) => {
        Store.countDocuments({}).exec()
          .then((number) => {
            expect(number).to.equal(totalStores);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST POST CREATE action Correct BusinessAccount - Invalid Data //
    
    // TEST PATCH EDIT action Correct BusinessAccount - Invalid Data //
    describe("PATCH '/api/stores/update/:storeId' - CORRECT 'BusinessAccount' - INVALID DATA - EDIT Action", () => {
      it("Should NOT update an existing 'Store' model without a 'title' property", (done) => {
        chai.request(server)
          .patch("/api/stores/update/" + (firstAdminsStore._id  as string))
          .set({ "Authorization": firstToken })
          .send({
            ...updateStoreData,
            title: ""
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.errorMessages[0]).to.be.a("string");
            expect(res.body.editedStore).to.be.undefined;
            done();
          });
      });
      it("Should NOT update an existing 'Store' model without a 'description' property", (done) => {
        chai.request(server)
          .patch("/api/stores/update/" + (firstAdminsStore._id  as string))
          .set({ "Authorization": firstToken })
          .send({
            ...updateStoreData,
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
            expect(res.body.editedStore).to.be.undefined;
            done();
          });
      });
      it("Should NOT update an existing 'Store' model with all empty properties", (done) => {
        chai.request(server)
          .patch("/api/stores/update/" + String(firstAdminsStore._id ))
          .set({ "Authorization": firstToken })
          .send({})
          .end((err, res) => {
            if (err) done(err);
            const errorsArr: string[] = res.body.errorMessages;
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(2);
            expect(res.body.editedStore).to.be.undefined;
            for (const errorMsg of errorsArr) {
              expect(errorMsg).to.be.a("string");
            }
            done();
          });
      });
      it("Should NOT alter the 'Store' model in question in any way", (done) => {
        Store.findOne({ _id: firstAdminsStore._id }).exec()
          .then((store) => {
            expect(JSON.stringify(store)).to.equal(JSON.stringify(firstAdminsStore));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number 'Store' models in the database", (done) => {
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
    // END TEST PATCH EDIT action Correct BusinessAccount - Invalid Data //
    
  });
 
});