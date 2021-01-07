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

chai.use(chaiHTTP);

type ImageDirectoryDetails = {
  imageModel: string;
  imageDirectories: string[];
  imageSubDirectories: string[];
  imageFiles: string[];
  totalImageDirectories: number;
  totalImageSubdirectories: number;
  totalImageFiles: number;
}
const getImageUploadData = (...paths: string []): ImageDirectoryDetails => {
  const firstString = paths[0].split("_")[0]; 
  const modelName = firstString[0].toUpperCase() + firstString.substr(1) + "Image";
  //
  const imageUplPath = path.join(path.resolve(), "public", "uploads", ...paths);
  const imageUplSubdirectories: string[] = [];
  const imageFiles: string[] = [];

  try {
    const imageUplDirectories = fs.readdirSync(imageUplPath).map((dir) => {
      return path.join(imageUplPath, dir);
    });

    for (const imgUplDirectory of imageUplDirectories) {
      const subdirectories = fs.readdirSync(imgUplDirectory).map((subdir) => {
        return path.join(imgUplDirectory, subdir);
      })
      imageUplSubdirectories.push(...subdirectories);
    }

    for (const imgUplSubdirectory of imageUplSubdirectories) {
      const files = readdirSync(imgUplSubdirectory);
      imageFiles.push(...files);
    }

    return {
      imageModel: modelName,
      imageDirectories: imageUplDirectories,
      imageSubDirectories: imageUplSubdirectories,
      imageFiles: imageFiles,
      totalImageDirectories: imageUplDirectories.length,
      totalImageSubdirectories: imageUplSubdirectories.length,
      totalImageFiles: imageFiles.length
    };
  } catch (error) {
    throw error;
  }
  
};
/**
 * This test suite tests mostly the effect of 'ServiceController' methods on linked 'ServiceImage' models,
 * making sure actions are correctly populating and removing images when appropriate
 * For detailed 'ServiceController' action tests, another test suite handles other detailed test cases regarding the 'Service' model.
 */

describe("ServicesController - Logged In WITH CORRECT BusinessAccount ID - tests with 'ServiceImage' models present - GET/POST/PATCH/DELETE  - API tests", () => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;
  // service models //
  let service: IService;
  let fetchedServices: IService[];
  let createdService: IService;
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
          const data = getImageUploadData("service_images");
          numberOfServiceImageDirectories = data.totalImageDirectories;
          numberOfServiceImageSubDirectories = data.totalImageSubdirectories;
          numberOfServiceImageFiles = data.totalImageFiles;
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
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
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
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
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
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST POST CREATE action with a corect BusinessAccount //

    // TEST PATCH EDIT  action with a correct BusinessAccount //
    describe("POST '/api/services/update/:serviceId' - CORRECT 'BusinessAccount' tests with 'ServiceImages' - CREATE action", () => {

      it("Should update 'Service' model and return a correct response", (done) => {
        const mockService = generateMockServiceData(1);
        chai.request(server)
          .patch("/api/services/update/" + (firstAdminsService._id as Types.ObjectId))
          .set({ "Authorization": firstToken })
          .send(...mockService)
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.editedService).to.be.an("object");
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
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST PATCH EDIT action with a corect BusinessAccount //

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
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories - 1);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles - firstAdminsServiceImages.length);
          numberOfServiceImageDirectories = totalImageDirectories;
          numberOfServiceImageSubDirectories = totalImageSubdirectories;
          numberOfServiceImageFiles = totalImageFiles;
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST DELETE DELETE action correct BusinessAccount //
    
  });
  // END CONTEXT tests with a correct business accound id //
  
  // CONTEXT tests with incorrect business account id //
  context("Admin WITH a 'BusinessAccount' set up, accessing NOT OWN models GET_ONE, EDIT, DELETE actions", () => {
    // TEST GET_ONE action with wrong BusinessAccount //
    describe("GET '/api/services/:serviceId' - WRON 'BusinessAccount' tests with 'ServiceImages' - GET_ONE action", () => {

      it("Should NOT fetch 'Service' models and return a correct error response", (done) => {
        chai.request(server)
          .get("/api/services/" + (createdService._id as Types.ObjectId))
          .set({ "Authorization": secondToken })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object")
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.service).to.be.undefined;
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
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST GET_ONE action with a correct BusinessAccount //

    // TEST PATCH EDIT  action with a correct BusinessAccount //
    describe("PATCH '/api/services/update/:serviceId' - WRONG 'BusinessAccount' tests with 'ServiceImages' - EDIT action", () => {

      it("Should NOT update 'Service' model and return a correct error response", (done) => {
        const mockService = generateMockServiceData(1);
        chai.request(server)
          .patch("/api/services/update/" + (createdService._id as Types.ObjectId))
          .set({ "Authorization": secondToken })
          .send(...mockService)
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.editedService).to.be.undefined;
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
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST PATCH EDIT action with an incorect BusinessAccount //

    // TEST DELETE DELETE action with an incorrect BusinessAccount //
    describe("DELETE '/api/services/delete/:serviceId' - WRONG 'BusinessAccount' tests with 'ServiceImages' - DELETE action", () => {

      it("Should NOT delete the 'Service' model and return a correct error response", (done) => {
        chai.request(server)
          .delete("/api/services/delete/" + String(createdService._id))
          .set({ "Authorization": secondToken })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.deletedService).to.be.undefined;
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
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST DELETE DELETE action correct BusinessAccount //
  });
  // END CONTEXT //
  
});