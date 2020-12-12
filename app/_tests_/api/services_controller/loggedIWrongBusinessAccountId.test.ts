// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import faker from "faker";
// server import //
import server from "../../../server";
// models and model interfaces //
import { ServiceData } from "../../../controllers/services_controller/type_declartions/servicesControllerTypes";
import { IAdministrator } from "../../../models/Administrator";
import Service, { IService } from "../../../models/Service";
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { setupServiceControllerTests, loginAdmins } from "./helpers/setupServiceControllerTests";

chai.use(chaiHTTP);

describe("ServicesController - Logged In WITH WRONG or MISSING BusinessAccount ID - GET/POST/PATCH/DELETE - API tests", () => {
  let newServiceData: ServiceData;
  let updateServiceData: ServiceData;
  // service models //
  let firstAdminsService: IService;
  // admin models first two have a 'BusinessAccount' set up, third does not //
  let firstAdmin: IAdministrator;
  let secondAdmin: IAdministrator;
  let thirdAdmin: IAdministrator;
  // login jwtTokens //
  let firstAdminToken: string;
  let secondAdminToken: string;
  let thirdAdminToken: string;
  // total number of Service models in database //
  let totalNumberOfServices: number;
  // setup DB, create models, count services //
  before((done) => {
    setupServiceControllerTests()
      .then((response) => {
        const { admins, services } = response;
        ({ firstAdmin, secondAdmin, thirdAdmin } = admins);
        ({ firstAdminsService } = services);
        return Service.countDocuments().exec();
      })
      .then((number) => {
        totalNumberOfServices = number;
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
    newServiceData = {
      name: faker.commerce.product(),
      price: faker.commerce.price(100),
      description: faker.lorem.paragraph(),
    };
    updateServiceData = {
      name: "updatedName",
      price: "200",
      description: "updated description",
    };
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  
  // CONTEXT 'ServicesController' GET_MANY GET_ONE CREATE EDIT DELETE actions without 'BusinessAccount' set up //
  context("Admin without a 'BusinessAccount' set up, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {

    // TEST GET with no business account GET_MANY action //
    describe("GET '/api/services - NO 'NO BusinessAccount' - GET_MANY action", () => {

      it("Should NOT allow the GET_MANY action of 'ServicesController' and return correct response", (done) => {
        chai.request(server)
          .get("/api/services")
          .set({ "Authorization": thirdAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.services).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT modify anything in the 'Service' models in the database", (done) => {
        Service.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfServices);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST GET with no business account GET_MANY action //

    // TEST GET with no business account GET_ONE action //
    describe("GET '/api/services/:serviceId' - NO 'BusinessAccont' - GET_ONE action", () => {

      it("Should NOT allow the GET_ONE action of 'ServicesController' and return correct response", (done) => {
        chai.request(server)
          .get("/api/services/" + (firstAdminsService._id as string))
          .set({ "Authorization": thirdAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.service).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT edit the 'Service' in question in any way", (done) => {
        Service.findOne({ _id: firstAdminsService._id })
          .then((foundService) => {
            expect(JSON.stringify(foundService)).to.equal(JSON.stringify(firstAdminsService));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Service' model in the database", (done) => {
        Service.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfServices);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST GET with no business acount GET_ONE action //
    
    // TEST Admin with no business account CREATE action //
    describe("POST '/api/services/create' - NO 'BusinessAccount' - CREATE action", () => {

      it("Should NOT allow CREATE of a 'Service' if admin does not have a 'BusinessAccount' set up", (done) => {
        chai.request(server)
          .post("/api/services/create")
          .set({ "Authorization": thirdAdminToken })
          .send({
            ...newServiceData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newService).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT add a new 'Service' model to the database", (done) => {
        Service.countDocuments().exec()
         .then((number) => {
          expect(number).to.equal(totalNumberOfServices);
          done();
         })
         .catch((err) => {
           done(err);
         });
      });

    });
    // END TEST Admin with no business account CREATE action //

    // TEST Admin with no Business account EDIT action //
    describe("PATCH '/api/services/edit/:serviceId' - NO 'BusinessAccount' - EDIT action", () => {

      it("Should NOT allow EDIT of a 'Service' if admin does not have a 'BusinessAccount' set up", (done) => {
        chai.request(server)
          .patch("/api/services/update/" + String(firstAdminsService._id))
          .set({ "Authorization": thirdAdminToken })
          .send({
            ...updateServiceData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newService).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT alter the 'Service' model in question in the database", (done) => {
        Service.findOne({ _id: firstAdminsService._id }).exec()
          .then((service) => {
            expect(JSON.stringify(service)).to.equal(JSON.stringify(firstAdminsService));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Service' models in the database", (done) => {
        Service.countDocuments().exec()
          .then((val) => {
            expect(val).to.equal(totalNumberOfServices);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST Admin with no Busniess accoint EDIT action //

    // TEST Admin with no Busniess account DELETE action //
    describe("DELETE '/api/services/delete/:serviceId' - NO 'BusinessAccount' - DELETE action", () => {

      it("Should NOT allow DELETE of a 'Service' if admin does not have a 'BusinessAccount' set up", (done) => {
        chai.request(server)
          .delete("/api/services/delete/" + String(firstAdminsService._id))
          .set({ "Authorization": thirdAdminToken })
          .send({
            ...updateServiceData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newService).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT alter the 'Service' model in question in the database", (done) => {
        Service.findOne({ _id: firstAdminsService._id }).exec()
          .then((service) => {
            expect(JSON.stringify(service)).to.equal(JSON.stringify(firstAdminsService));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Service' models in the database", (done) => {
        Service.countDocuments().exec()
          .then((val) => {
            expect(val).to.equal(totalNumberOfServices);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST Admin with no Busniess account DELETE action //
    
  });
  // END CONTEXT 'ServicesController' INDEX GET CREATE EDIT DELETE actions without 'BusinessAccount' set up //

  // CONTEXT 'ServicesController' GET_ONE GET EDIT DELETE actions with wrong 'BusinessAccount //
  context("Admin with a wrong 'BusinessAccount' set up GET_ONE, EDIT, DELETE actions", () => {
    // TEST GET GET_ONE controller action with wrong 'BusinesAccount' //
    describe("GET '/api/services/:serviceId' - WRONG 'BusinessAccount' - GET_ONE action", () => {

      it("Should NOT return a 'Service' model which belongs to another account", (done) => {
        chai.request(server)
          .get("/api/services/" + String(firstAdminsService._id) )
          .set({ "Authorization": secondAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            // console.log(response)
            expect(response.status).to.equal(401);
            expect(response.body.service).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT edit a 'Service' model in the database in any way", (done) => {
        Service.findOne({ _id: firstAdminsService._id }).exec()
          .then((service) => {
            expect(JSON.stringify(service)).to.equal(JSON.stringify(firstAdminsService));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Service' models in the database", (done) => {
        Service.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfServices);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    
    });
    // END TEST GET GET_ONE controller action with wrong 'BusinessAccount' //
    
    // TEST Admin with wrong business account EDIT action //
    describe("PATCH '/api/services/update/:serviceId' - WRONG 'BusinessAccount' - EDIT action", () => {
      it("Should NOT allow EDIT of a 'Service' if Admin's  'BusinessAccount' _id doesnt match 'Service'", (done) => {
        chai.request(server)
          .patch("/api/services/update/" + String(firstAdminsService._id))
          .set({ "Authorization": secondAdminToken })
          .send({
            ...newServiceData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newService).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT edit the 'Service' in question in ANY way", (done) => {
        Service.findOne({ _id: firstAdminsService._id }).exec()
          .then((foundService) => {
            expect(JSON.stringify(foundService)).to.equal(JSON.stringify(firstAdminsService));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Service' models in the database", (done) => {
        Service.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfServices);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST Admin with wrong business account EDIT action //
    
    // TEST Admin with wrong BusinessAccount DELETE action //
    describe("DELETE '/api/services/delete/:serviceId' - WRONG 'BusinessAccount' - DELETE action", () => {
      it("Should NOT allow DELETE of a 'Service' if Admin's  'BusinessAccount' _id doesnt match 'Service'", (done) => {
        chai.request(server)
          .delete("/api/services/delete/" + String(firstAdminsService._id))
          .set({ "Authorization": secondAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newService).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT delete the 'Service' from the database", (done) => {
        Service.exists({ _id: firstAdminsService._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Service' models in the database", (done) => {
        Service.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfServices);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST Admin with wrong BusinessAccount DELETE action //
    
  });
  // END CONTEXT 'ServicesController' EDIT DELETE actions with wrong 'BusinessAcccount //
  
});