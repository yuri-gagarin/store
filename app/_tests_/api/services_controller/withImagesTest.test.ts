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
import { createServiceImages } from "../../helpers/data_generation/serviceImageDataGeneration";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";
import ServiceImage, { IServiceImage } from "../../../models/ServiceImage";

chai.use(chaiHTTP);
/**
 * This test suite tests mostly the effect of 'ServiceController' methods on linked 'ServiceImage' models,
 * making sure actions are correctly populating and removing images when appropriate
 * For detailed 'ServiceController' action tests, another test suite handles other detailed test cases
 */

describe("ServicesController - Logged In WITH CORRECT BusinessAccount ID - tests with 'ServiceImage' models present - GET/POST/PATCH/DELETE  - API tests", () => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  // service models //
  let service: IService;
  let fetchedServices: IService[];
  let createdService: IService;
  let updatedService: IService;
  let deletedService: IService;
  let firstAdminsService: IService, secondAdminsService: IService;
  let firstAdminsServiceImages: IServiceImage[];
  //
  let firstToken: string, secondToken: string;
  let totalServices: number;
  let firstAdminsServiceImgTotal: number;
  let totalServiceImages: number;
  // mockData //
  let newServiceData: ServiceData;
  let updateServiceData: ServiceData;

  // database and model data setup //
  // logins and jwtTokens //
  before((done) => {
    setupServiceControllerTests()
      .then((response) => {
        ({ firstAdmin, secondAdmin } = response.admins);
        ({ firstAdminsService, secondAdminsService } = response.services);
        return loginAdmins(chai, server, [ firstAdmin, secondAdmin ]);
      })
      .then((tokensArr) => {
        ([ firstToken, secondToken ] = tokensArr);
        return Promise.all([
          createServiceImages(5, firstAdminsService),
          createServiceImages(5, secondAdminsService)
        ]);
      })
      .then((imgArray) => {
        firstAdminsServiceImages = imgArray[0];
        return Promise.all([
          Service.countDocuments().exec(),
          ServiceImage.countDocuments().exec(),
          ServiceImage.countDocuments({ serviceId: firstAdminsService._id }).exec()
        ]);
      })
      .then((countsArray) => {
        [ totalServices, totalServiceImages, firstAdminsServiceImgTotal ] = countsArray;
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

  context("Admin WITH a 'BusinessAccount' set up, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {
    // TEST GET GET_MANY action correct BusinessAccount //
    describe("GET '/api/services' - CORRECT 'BusinessAccount' tests with 'ServiceImages' - GET_MANY action", () => {

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
      it("Should correctly populate the 'Service' models if linked 'ServiceImage' models are present", () =>{
        for (const service of fetchedServices) {
          if (service.images.length > 0) {
            for (const serviceImage of service.images) {
              const linkedImage = serviceImage as IServiceImage;
              expect(linkedImage.businessAccountId).to.be.an("string");
              expect(linkedImage.serviceId).to.be.an("string");
              expect(linkedImage.imagePath).to.be.a("string");
              expect(linkedImage.absolutePath).to.be.a("string");
              expect(linkedImage.url).to.be.a("string");
              expect(linkedImage.fileName).to.be.a("string");
              expect(linkedImage.createdAt).to.be.an("string");
              expect(linkedImage.editedAt).to.be.an("string");

            }
          }
        }
      });
      it("Should NOT alter anything within 'ServiceImage' models in the database", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServiceImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

    });
    // END TEST GET GET_MANY action correct BusinessAccount //
    
    // TEST GET GET_ONE action correct BusinessAccount //
    describe("GET '/api/services/:serviceId' - CORRECT 'BusinessAccount' tests with 'ServiceImages' - GET_ONE action", () => {

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
      it("Should return the correct 'Service' model and correctly populate the 'ServiceImage' model subarray", () => {
        expect(service.images.length).to.equal(firstAdminsServiceImgTotal);
        for (const serviceImg of service.images as IServiceImage[]) {
          expect(serviceImg.businessAccountId).to.be.an("string");
          expect(serviceImg.serviceId).to.be.an("string");
          expect(serviceImg.imagePath).to.be.a("string");
          expect(serviceImg.absolutePath).to.be.a("string");
          expect(serviceImg.url).to.be.a("string");
          expect(serviceImg.fileName).to.be.a("string");
          expect(serviceImg.createdAt).to.be.an("string");
          expect(serviceImg.editedAt).to.be.an("string");
        }
      });
      it("Should NOT alter any 'ServiceImage' models in the database", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServiceImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter the number of 'ServiceImage' models in the queried 'Service' model", (done) => {
        Service.findOne({ _id: firstAdminsService._id }).exec()
          .then((service) => {
            expect(service!.images.length).to.equal(firstAdminsServiceImgTotal);
            done();
          })
          .catch((error) => {
            done(error);
          })
      });
    });
    // END TEST GET_ONE action correct BusinessAccount //
   
  
  });
 
});