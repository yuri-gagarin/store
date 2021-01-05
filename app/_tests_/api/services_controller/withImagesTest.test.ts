// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import { Types } from "mongoose";
import fs, { readdirSync } from "fs";
import path from "path";
// server import /
import server from "../../../server";
// models and model interfaces //
import BusinessAccount from "../../../models/BusinessAccount";
import { ServiceData } from "../../../controllers/services_controller/type_declarations/servicesControllerTypes";
import ServiceImage, { IServiceImage } from "../../../models/ServiceImage";
import { IAdministrator } from "../../../models/Administrator";
import Service, { IService } from "../../../models/Service";
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { generateMockServiceData } from "../../helpers/data_generation/serviceDataGeneration"; 
import { setupServiceControllerTests } from "./helpers/setupServiceControllerTests";
import { cleanUpServiceImgControllerTests } from "../service_images_controller/helpers/setupServiceImgControllerTests";
import { createServiceImages } from "../../helpers/data_generation/serviceImageDataGeneration";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";
import { image } from "faker";

chai.use(chaiHTTP);
/**
 * This test suite tests mostly the effect of 'ServiceController' methods on linked 'ServiceImage' models,
 * making sure actions are correctly populating and removing images when appropriate
 * For detailed 'ServiceController' action tests, another test suite handles other detailed test cases
 */

describe("ServicesController - Logged In WITH CORRECT BusinessAccount ID - tests with 'ServiceImage' models present - GET/POST/PATCH/DELETE  - API tests", () => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;
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
  // 
  let numberOfServiceImageDirectories: number = 0;    // <path>/public/uploads/service_images/<businessAccountId> //
  let numberOfServiceImageSubDirectories: number = 0; // <path>/public/uploads/service_images/<businessAccountId>/<serviceId> //
  let numberOfServiceImageFiles: number = 0;

  // database and model data setup //
  // logins and jwtTokens //
  before((done) => {
    setupServiceControllerTests()
      .then((response) => {
        ({ firstAdmin, secondAdmin } = response.admins);
        ({ firstAdminsService, secondAdminsService } = response.services);
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = response.busAccountIds);
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
        try {
          const directories = fs.readdirSync(path.join(path.resolve(), "public", "uploads", "service_images"));
          const subDirectories: string[] = [];
          const createdImageFiles: string[] = [];
          for (const directory of directories) {
            const subdirs: string[] = fs.readdirSync(path.join(path.resolve(), 'public', 'uploads', 'service_images', directory));
            for (const subdir of subdirs) {
              subDirectories.push(path.join(path.resolve(), "public", "uploads", "service_images", directory, subdir));
            }
          }
          for (const subDir of subDirectories) {
            const files = fs.readdirSync(subDir);
            createdImageFiles.push(...files);
          }
          numberOfServiceImageDirectories = directories.length;
          numberOfServiceImageSubDirectories = subDirectories.length;
          numberOfServiceImageFiles = createdImageFiles.length;
          done();
        } catch (error) {
          done(error);
        }
      })
      .catch((err) => {
        done(err);
      });
  });
  before(() => {
    [ newServiceData, updateServiceData ] = generateMockServiceData(2);
  });
  after((done) => {
    Promise.all([
      clearDB(),
      cleanUpServiceImgControllerTests(firstAdminBusAcctId, secondAdminBusAcctId)
    ])
    .then(() => {
      done();
    })
    .catch((error) => {
      done(error);
    });
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

    // TEST GET_ONE action with correct BusinessAccount //
    describe("GET '/api/services/:serviceId' - CORRECT 'BusinessAccount' tests with 'ServiceImages' - GET_MANY action", () => {

      it("Should fetch 'Service' models and return a correct response", (done) => {
        chai.request(server)
          .get("/api/services/" + (firstAdminsService._id as Types.ObjectId))
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
      it("Should correctly populate the 'Service' model's <images> subarray with the 'ServiceImage' models", () =>{
        for (const serviceImage of service.images as IServiceImage[]) {
          expect(serviceImage.businessAccountId).to.be.an("string");
          expect(serviceImage.serviceId).to.be.an("string");
          expect(serviceImage.imagePath).to.be.a("string");
          expect(serviceImage.absolutePath).to.be.a("string");
          expect(serviceImage.url).to.be.a("string");
          expect(serviceImage.fileName).to.be.a("string");
          expect(serviceImage.createdAt).to.be.an("string");
          expect(serviceImage.editedAt).to.be.an("string");
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
      it("Should NOT remove any 'ServiceImage' files belonging to queried 'Service' model", () => {
        const imgDirectory = firstAdminsServiceImages[0].imagePath;
        try {
          const imageFiles = fs.readdirSync(imgDirectory);
          expect(imageFiles.length).to.equal(firstAdminsServiceImgTotal);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST GET_ONE action with a correct BusinessAccount //

    // TEST POST CREATE action with a correct BusinessAccount //
    describe("POST '/api/services/create' - CORRECT 'BusinessAccount' tests with 'ServiceImages' - CREATE action", () => {

      it("Should create a 'Service' model and return a correct response", (done) => {
        const mockService = generateMockServiceData(1);
        chai.request(server)
          .post("/api/services/create")
          .set({ "Authorization": firstToken })
          .send( ...mockService )
          .end((err, res) => {
            if (err) done(err);
            createdService = res.body.newService;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.newService).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
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
      it("Should NOT create any new 'ServiceImage; directories nor alter eny existing directories", () => {
        try {
          const imgDirectories = fs.readdirSync(path.join(path.resolve(), "public", "uploads", "service_images"));
          const absoluteImgDirectories: string[] = [];
          const imageFiles: string[] = [];
          for (const directory of imgDirectories) {
            const subdirs = fs.readdirSync(path.join(path.resolve(), "public", "uploads", "service_images", directory));
            for (const subdir of subdirs) {
              absoluteImgDirectories.push(path.join(path.resolve(), "public", "uploads", "service_images", directory, subdir));
            }
          }
          for (const absDirectory of absoluteImgDirectories) {
            const files = fs.readdirSync(absDirectory);
            imageFiles.push(...files);
          }
          expect(imgDirectories.length).to.equal(numberOfServiceImageDirectories);
          expect(absoluteImgDirectories.length).to.equal(numberOfServiceImageSubDirectories);
          expect(imageFiles.length).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });

    // END TEST POST CREATE action with a corect BusinessAccount //

    // TEST DELETE DELETE action correct BusinessAccount //
    describe("DELETE '/api/services/delete/:serviceId' - CORRECT 'BusinessAccount' tests with 'ServiceImages' - DELETE action", () => {

      it("Should deleted the  'Service' model and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/services/delete/" + String(firstAdminsService._id))
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            service = res.body.service;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.deletedService).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should remove correct 'ServiceImage' models in the database", (done) => {
        ServiceImage.find({ serviceId: firstAdminsService._id }).exec()
          .then((services) => {
            expect(services.length).to.equal(0);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should decrement the 'ServiceImage' models in the database by a correct number", (done) => {
        ServiceImage.countDocuments().exec() 
          .then((count) => {
            expect(count).to.equal(totalServiceImages - firstAdminsServiceImgTotal);
            totalServiceImages -= firstAdminsServiceImgTotal;
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should remove the 'ServiceImage' directories for the queried 'ServiceItem'", () => {
        const serviceImgDirectory = firstAdminsServiceImages[0].imagePath;
        try {
          fs.accessSync(serviceImgDirectory);
        } catch(error) {
          expect(error.code).to.equal("ENOENT");
        }
      });
      it("Should correctly handle image file removal, remove appropriate files and directories only", () => {
        // service images are uploaded to <path>/public/uploads/service_images/<businessAccounId>/<serviceId> //
        // a removed service should remove its linked uploaded images in <path>/public/uploads/service_images/<businessAccounId>/<serviceId> directory //
        // it should also remove the <serviceId> directory but leave all other directories untouched //
        const imgDirectories = fs.readdirSync(path.join(path.resolve(), "public", "uploads", "service_images"));
        const absoluteImgSubdirectories: string[] = [];
        const imageFiles: string[] = [];
        try {
          for (const directory of imgDirectories) {
            const subdirs = fs.readdirSync(path.join(path.resolve(), "public", "uploads", "service_images", directory));
            for (const subdir of subdirs) {
              absoluteImgSubdirectories.push(path.join(path.resolve(), "public", "uploads", "service_images", directory, subdir));
            }
          }
          for (const absoluteImgSubDirectory of absoluteImgSubdirectories) {
            const imgFiles = readdirSync(absoluteImgSubDirectory);
            imageFiles.push(...imgFiles);
          }
          // assert correct reponse //
          // image directory should not be deleted, only the subdirectory belonging to queried account model //
          expect(imgDirectories.length).to.equal(numberOfServiceImageDirectories);
          expect(absoluteImgSubdirectories.length).to.equal(numberOfServiceImageSubDirectories - 1);
          expect(imageFiles.length).to.equal(numberOfServiceImageFiles - firstAdminsServiceImgTotal);
        } catch (error) {
          throw error;
        }
      })
    });
    // END TEST DELETE DELETE action correct BusinessAccount //

   
    
  });
 
});