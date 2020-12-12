// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server import /
import server from "../../../server";
// models and model interfaces //
import { ServiceData } from "../../../controllers/services_controller/type_declartions/servicesControllerTypes";
import { IAdministrator } from "../../../models/Administrator";
import Service, { IService } from "../../../models/Service";
// helpers and validators//
import { clearDB } from "../../helpers/dbHelpers";
import { generateMockServiceData } from "../../helpers/data_generation/serviceDataGeneration"; 
import { setupServiceControllerTests } from "./helpers/setupServiceControllerTests";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";

chai.use(chaiHTTP);

describe("ServicesController - Logged In WITH CORRECT BusinessAccount ID - INVALID DATA - PATCH/POST - API tests", () => {
  let firstAdmin: IAdministrator;
  let firstAdminsService: IService;
  let firstToken: string;
  let totalServices: number;
  // mockData //
  let newServiceData: ServiceData;
  let updateServiceData: ServiceData;

  // database and model data setup //
  // logins and jwtTokens //
  before((done) => {
    setupServiceControllerTests()
      .then((response) => {
        ({ firstAdmin } = response.admins);
        ({ firstAdminsService } = response.services);
        return loginAdmins(chai, server, [ firstAdmin ]);
      })
      .then((tokensArr) => {
        ([ firstToken ] = tokensArr);
        return Service.countDocuments().exec();
      })
      .then((number) => {
        totalServices = number;
        done();
      })
      .catch((err) => {
        done(err);
      });
      
  });
  before(() => {
    [ newServiceData, updateServiceData ] = generateMockServiceData(2);
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });

  // CONTEXT  POST CREATE action Correct BusinessAccount - Invalid Data CREATE, EDIT ACTIONS //
  context("Admin WITH a 'BusinessAccount' set up, CREATE, EDIT actions", () => {
    
    // TEST POST CREATE action Correct BusinessAccount - Invalid Data //
    describe("POST '/api/producs/create' - CORRECT 'BusinessAccount' - INVALID DATA", () => {
      it("Should NOT create a new 'Service' model without a 'name' property", (done) => {
        chai.request(server)
          .post("/api/services/create")
          .set({ "Authorization": firstToken })
          .send({
            ...newServiceData,
            name: ""
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
            expect(res.body.newService).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new 'Service' model without a 'price' property", (done) => {
        chai.request(server)
          .post("/api/services/create")
          .set({ "Authorization": firstToken })
          .send({
            ...newServiceData,
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
            expect(res.body.newService).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new 'Service' model without a 'description' property", (done) => {
        chai.request(server)
          .post("/api/services/create")
          .set({ "Authorization": firstToken })
          .send({
            ...newServiceData,
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
            expect(res.body.newService).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new 'Service' model with all empty properties", (done) => {
        chai.request(server)
          .post("/api/services/create")
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
            expect(res.body.errorMessages.length).to.equal(3);
            expect(res.body.newService).to.be.undefined;
            for (const errorMsg of errorsArr) {
              expect(errorMsg).to.be.a("string");
            }
            done();
          });
      });
      it("Should NOT modify the number of 'Service' models in the database", (done) => {
        Service.countDocuments({}).exec()
          .then((number) => {
            expect(number).to.equal(totalServices);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST POST CREATE action Correct BusinessAccount - Invalid Data //
    
    // TEST PATCH EDIT action Correct BusinessAccount - Invalid Data //
    describe("PATCH '/api/producs/update/:serviceId' - CORRECT 'BusinessAccount' - INVALID DATA", () => {
      it("Should NOT update an existing 'Service' model without a 'name' property", (done) => {
        chai.request(server)
          .patch("/api/services/update/" + String(firstAdminsService._id ))
          .set({ "Authorization": firstToken })
          .send({
            ...newServiceData,
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
            expect(res.body.editedService).to.be.undefined;
            done();
          });
      });
      it("Should NOT update an existing 'Service' model without a 'price' property", (done) => {
        chai.request(server)
          .patch("/api/services/update/" + String(firstAdminsService._id ))
          .set({ "Authorization": firstToken })
          .send({
            ...newServiceData,
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
            expect(res.body.editedService).to.be.undefined;
            done();
          });
      });
      it("Should NOT update an existing 'Service' model without a 'description' property", (done) => {
        chai.request(server)
          .patch("/api/services/update/" + String(firstAdminsService._id ))
          .set({ "Authorization": firstToken })
          .send({
            ...newServiceData,
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
            expect(res.body.editedService).to.be.undefined;
            done();
          });
      });
      it("Should NOT update an existing 'Service' model with all empty properties", (done) => {
        chai.request(server)
          .patch("/api/services/update/" + String(firstAdminsService._id ))
          .set({ "Authorization": firstToken })
          .send({})
          .end((err, res) => {
            if (err) done(err);
            const errorsArr: string[] = res.body.errorMessages;
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(3);
            expect(res.body.editedService).to.be.undefined;
            for (const errorMsg of errorsArr) {
              expect(errorMsg).to.be.a("string");
            }
            done();
          });
      });
      it("Should NOT alter the 'Service' model in question in any way", (done) => {
        Service.findOne({ _id: firstAdminsService._id }).exec()
          .then((service) => {
            expect(JSON.stringify(service)).to.equal(JSON.stringify(firstAdminsService));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number 'Service' models in the database", (done) => {
        Service.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServices);
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