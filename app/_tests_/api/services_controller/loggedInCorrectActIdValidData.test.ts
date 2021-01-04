// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import { Types } from "mongoose";
// server import /
import server from "../../../server";
// models and model interfaces //
import BusinessAccount from "../../../models/BusinessAccount";
import { ServiceData } from "../../../controllers/services_controller/type_declarations/servicesControllerTypes";
import { IAdministrator } from "../../../models/Administrator";
import Service, { IService } from "../../../models/Service";
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { generateMockServiceData } from "../../helpers/data_generation/serviceDataGeneration"; 
import { setupServiceControllerTests } from "./helpers/setupServiceControllerTests";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";

chai.use(chaiHTTP);

describe("ServicesController - Logged In WITH CORRECT BusinessAccount ID - VALID DATA - GET/POST/PATCH/DELETE  - API tests", () => {
  let firstAdmin: IAdministrator;
  let fetchedServices: IService[];
  let createdService: IService;
  let updatedService: IService;
  let deletedService: IService;
  let firstAdminsService: IService;
  let firstToken: string;
  let totalServices: number;
  // mockData //
  let newServiceData: ServiceData;
  let updateServiceData: ServiceData;
  //
  let totalLinkedAdminsToFirstAdminsAcc: number;
  let totalLinkedStoresToFirstAdminsAcc: number;
  let totalLinkedServicesToFirstAdminsAcc: number;
  let totalLinkedProductsToFirstAdminsAcc: number;
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
        return BusinessAccount.findOne({ _id: firstAdmin.businessAccountId }).exec();
      })
      .then((foundAccount) => {
        totalLinkedAdminsToFirstAdminsAcc = foundAccount!.linkedAdmins.length;
        totalLinkedStoresToFirstAdminsAcc = foundAccount!.linkedStores.length;
        totalLinkedServicesToFirstAdminsAcc = foundAccount!.linkedServices.length;
        totalLinkedProductsToFirstAdminsAcc = foundAccount!.linkedProducts.length;
        done()
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

  context("Admin WITH a 'BusinessAccount' set up, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {
    // TEST GET GET_MANY action correct BusinessAccount //
    describe("GET '/api/services' - CORRECT 'BusinessAccount' - GET_MANY action", () => {

      it("Should fetch 'Service' models and return a correct response", (done) => {
        chai.request(server)
          .get("/api/services")
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            fetchedServices = res.body.services;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.services).to.be.an("array");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should return only 'Service' models belonging to 'Admins' 'Business' account", () => {
        for (const service of fetchedServices) {
          expect(String(service.businessAccountId)).to.equal(String(firstAdmin.businessAccountId));
        }
      });
      it("Should NOT add nor subtract any 'Service' models to the database", (done) => {
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
    // END TEST GET GET_MANY action correct BusinessAccount //
    
    // TEST GET GET_ONE action correct BusinessAccount //
    describe("GET '/api/services/:serviceId' - CORRECT 'BusinessAccount' - GET_ONE action", () => {
      let service: IService;

      it("Should fetch 'Service' models and return a correct response", (done) => {
        chai.request(server)
          .get("/api/services/" + String(firstAdminsService._id))
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            service = res.body.service;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.service).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should return the correct 'Service' model and corresponding data", () => {
        expect(JSON.stringify(service)).to.equal(JSON.stringify(firstAdminsService));
      });
      it("Should NOT alter in any way the 'Service' model in the database", (done) => {
        Service.findOne({ _id: firstAdminsService._id }).exec()
          .then((foundService) => {
            expect(JSON.stringify(foundService)).to.equal(JSON.stringify(firstAdminsService));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT add nor subtract any 'Service' models to the database", (done) => {
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
    // END TEST GET_ONE action correct BusinessAccount //

    // TEST POST CREATE action Correct BusinessAccount - valid Data //
    describe("POST '/api/producs/create' - CORRECT 'BusinessAccount' - VALID DATA - CREATE action", () => {
      it("Should create a new 'Service' model, send back correct response", (done) => {
        chai.request(server)
          .post("/api/services/create")
          .set({ "Authorization": firstToken })
          .send({ ...newServiceData })
          .end((err, res) => {
            if (err) done(err);
            createdService = res.body.newService;
            // asssert correct response //
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.newService).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly set all properties on a new 'Service' model", () => {
        expect(String(createdService.businessAccountId)).to.equal(String(firstAdmin.businessAccountId));
        expect(createdService.name).to.equal(newServiceData.name);
        expect(createdService.price.toString()).to.equal(parseInt((newServiceData.price as string)).toString());
        expect(createdService.description).to.equal(newServiceData.description);
        expect(createdService.images).to.be.an("array");
        expect(createdService.images.length).to.equal(0);
        expect(createdService.createdAt).to.be.a("string");
        expect(createdService.editedAt).to.be.a("string");
      });
      it("Should save the new 'Service' model in the database", (done) => {
        Service.exists({ _id: createdService._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should INCREASE the number of 'Service' models in the database by 1", (done) => {
        Service.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServices + 1);
            totalServices = number;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should update the linked 'BusinessAccount' model and add the newly created 'Service' mdel to it", (done) => {
        BusinessAccount.findOne({ _id: firstAdmin.businessAccountId }).exec()
          .then((foundAccount) => {
            const linkedServiceIds: string[] = foundAccount!.linkedServices.map((service) => (service as Types.ObjectId).toHexString());
            const createdServiceId: string = createdService._id;
            // assert //
            expect(linkedServiceIds.includes(createdServiceId)).to.equal(true);
            expect(foundAccount!.linkedServices.length).to.equal(totalLinkedServicesToFirstAdminsAcc + 1);
            totalLinkedServicesToFirstAdminsAcc = foundAccount!.linkedServices.length;
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter the linked 'BusinessAccount' model's any other subarrays", (done) => {
        BusinessAccount.findOne({ _id: firstAdmin.businessAccountId }).exec()
          .then((foundAccount) => {
            expect(foundAccount!.linkedAdmins.length).to.equal(totalLinkedAdminsToFirstAdminsAcc);
            expect(foundAccount!.linkedStores.length).to.equal(totalLinkedStoresToFirstAdminsAcc);
            expect(foundAccount!.linkedProducts.length).to.equal(totalLinkedProductsToFirstAdminsAcc);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

    });
    // END TEST POST CREATE action Correct BusinessAccount - VALID Data //
    
    // TEST PATCH EDIT action Correct BusinessAccount - VALID Data //
    describe("PATCH '/api/producs/update/:serviceId' - CORRECT 'BusinessAccount' - VALID DATA - EDIT action", () => {
      it("Should correctly update a 'Service' model, send back correct response", (done) => {
        chai.request(server)
          .patch("/api/services/update/" + (firstAdminsService._id as string))
          .set({ "Authorization": firstToken })
          .send({ ...updateServiceData })
          .end((err, res) => {
            if (err) done(err);
            updatedService = res.body.editedService;
            // asssert correct response //
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.editedService).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly set all properties on an updated 'Service' model", () => {
        expect(String(updatedService.businessAccountId)).to.equal(String(firstAdmin.businessAccountId));
        expect(updatedService.name).to.equal(updateServiceData.name);
        expect(updatedService.price.toString()).to.equal(parseInt((updateServiceData.price as string)).toString());
        expect(updatedService.description).to.equal(updateServiceData.description);
        expect(updatedService.images).to.be.an("array");
        expect(updatedService.images.length).to.equal(0);
        expect(updatedService.createdAt).to.be.a("string");
        expect(updatedService.editedAt).to.be.a("string");
        expect(updatedService.createdAt).to.not.equal(updatedService.editedAt);
      });
      it("Should save the new 'Service' model in the database", (done) => {
        Service.exists({ _id: updatedService._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should correctly save all fields in database, edited Service", (done) => {
        Service.findOne({ _id: updatedService._id })
          .then((savedService) => {
            expect(JSON.stringify(savedService)).to.equal(JSON.stringify(updatedService));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Service' model in the database", (done) => {
        Service.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServices);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the linked 'BusinessAccount' model and its <linkedServices> subarray", (done) => {
        BusinessAccount.findOne({ _id: firstAdmin.businessAccountId }).exec()
          .then((foundAccount) => {
            const linkedServiceIds: string[] = foundAccount!.linkedServices.map((serviceId) => (serviceId as Types.ObjectId).toHexString());
            const updatedServiceId: string = updatedService._id;
            expect(linkedServiceIds.includes(updatedServiceId)).to.equal(true);
            expect(foundAccount!.linkedServices.length).to.equal(totalLinkedServicesToFirstAdminsAcc);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter the linked 'BusinessAccount' model's any other subarrays", (done) => {
        BusinessAccount.findOne({ _id: firstAdmin.businessAccountId }).exec()
          .then((foundAccount) => {
            expect(foundAccount!.linkedAdmins.length).to.equal(totalLinkedAdminsToFirstAdminsAcc);
            expect(foundAccount!.linkedStores.length).to.equal(totalLinkedStoresToFirstAdminsAcc);
            expect(foundAccount!.linkedProducts.length).to.equal(totalLinkedProductsToFirstAdminsAcc);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

    });
    
    // END TEST PATCH EDIT action Correct BusinessAccount - VALID Data //

    // TEST DELETE DELETE action Correct BusinessAccount - Valid Data //
    describe("DELETE '/api/producs/delete/:serviceId' - CORRECT 'BusinessAccount' - VALID DATA - DELETE action", () => {
      it("Should correctly delete a 'Service' model, send back correct response", (done) => {
        chai.request(server)
          .delete("/api/services/delete/" + (firstAdminsService._id as string))
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            deletedService = res.body.deletedService;
            // asssert correct response //
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.deletedService).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should remove the 'Service' model from the database", (done) => {
        Service.exists({ _id: deletedService._id })
          .then((exists) => {
            expect(exists).to.equal(false);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should DECREMENT number of 'Service' models in the database exactly by 1", (done) => {
        Service.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServices - 1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should update the linked 'BusinessAccount' model and removed the deleted 'Service' model from its <linkedServices> subarray", (done) => {
        BusinessAccount.findOne({ _id: firstAdmin.businessAccountId }).exec()
          .then((foundAccount) => {
            const linkedServiceIds: string[] = foundAccount!.linkedServices.map((serviceId) => (serviceId as Types.ObjectId).toHexString());
            const createdServiceId: string = deletedService._id;
            expect(linkedServiceIds.includes(createdServiceId)).to.equal(false);
            expect(foundAccount!.linkedServices.length).to.equal(totalLinkedServicesToFirstAdminsAcc - 1);
            totalLinkedServicesToFirstAdminsAcc = foundAccount!.linkedServices.length;
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter linked 'BusinessAccount' model's any other subarrays", (done) => {
        BusinessAccount.findOne({ _id: firstAdmin.businessAccountId }).exec()
          .then((foundAccount) => {
            expect(foundAccount!.linkedAdmins.length).to.equal(totalLinkedAdminsToFirstAdminsAcc);
            expect(foundAccount!.linkedStores.length).to.equal(totalLinkedStoresToFirstAdminsAcc);
            expect(foundAccount!.linkedProducts.length).to.equal(totalLinkedProductsToFirstAdminsAcc);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

    });
    // END TEST DELETE DELETE action Correct BusinessAccount - Valid Data //
    
  });
 
});