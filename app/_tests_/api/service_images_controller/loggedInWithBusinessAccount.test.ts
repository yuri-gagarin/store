import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// node dependencies //
import fs from "fs";
import path from "path";
// server import //
import server from "../../../server";
// models and model interfaces //
import Service, { IService } from "../../../models/Service";
import ServiceImage, { IServiceImage } from "../../../models/ServiceImage";
// setup helpers //
import { setupServiceImgControllerTests, cleanUpServiceImgControllerTests } from "./helpers/setupServiceImgControllerTests";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { IAdministrator } from "../../../models/Administrator";

chai.use(chaiHTTP);
/**
 * Scenario when an Admin is registered and logged in AND has a correct BusinessAccount allowing them to edit Service in question and CREATDELETE ServiceImages.
 * In this scenario  'passport' middleware allows further access
 * {checkImgUploudCredentials} custom middleware should intercept this request and process access rights
 *
 * If admin.businessAccountId === service.businessAccountId then {checkImgUpload} middleware should pass on to
 * 'ServiceImgUplConroller' and allow CREATE_IMAGE and DELETE_IMAGE actions.
 * Otherwise if admin.businessAccountId !== service.businessAccountId then {checlImgUpload} middleware should bock access and
 * return the appropiate response.
 * response options include:
 * 
 * SUCCESSFUL response should return:
 * {
 *   responseMsg: string;
 *   newServiceImage: IServiceImage;
 *   updatedService: IService;
 * }
 * UNSUCCCESSFUL response should return"
 * {
 *   responseMsg: string;
 *   error: 'Object' | Error;
 *   errorMessages: string[];
 * }
 * 
 */

describe("ServiceImagesUplController - LOGGED IN - BUSINESS ACCOUNT SET UP - POST/DELETE API tests", () => {
  // admins, admin login tokens and admin business account ids //
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator;
  let firstAdminToken: string, secondAdminToken: string;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;
  // admin Service models //
  let firstAdminsService: IService;
  let secondAdminsService: IService;
  // admin ServiceImage models //
  let firstAdminsServiceImage: IServiceImage;
  let secondAdminsServiceImage: IServiceImage;
  // created and deleted images //
  let createdImage: IServiceImage;
  let deletedImage: IServiceImage;
  // aditonal variables //
  let serviceImageModelCount: number;

  before((done) => {
    setupServiceImgControllerTests()
      .then(({ admins, busAccountIds, services, serviceImages }) => {
        ({ firstAdmin, secondAdmin } = admins);
        ({ firstAdminsService, secondAdminsService } = services);
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = busAccountIds);
        [ firstAdminsServiceImage, secondAdminsServiceImage ] = serviceImages.firstAdminsServiceImgs;
        return ServiceImage.countDocuments().exec();
      })
      .then((number) => {
        serviceImageModelCount = number;
        return loginAdmins(chai, server, [ firstAdmin, secondAdmin ]);
      })
      .then((adminTokensArr) => {
        [ firstAdminToken, secondAdminToken ] = adminTokensArr;
        done();
      })
      .catch((err) => {
        done(err);
      })
  })
  after((done) => {
    cleanUpServiceImgControllerTests(firstAdminBusAcctId, secondAdminBusAcctId)
      .then(() => {
        return clearDB();
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });      
  });

  // CONTEXT POST/DELETE API tests with LOGIN and CORRECT business account //
  context("POST/DELETE  'ServiceImgUplController' API tests - LOGGED IN - CORRECT BUSINESS ACCOUNT - CREATE_IMAGE, DELETE_IMAGE actions", () => {

    // TEST POST 'ServiceImagesController' login and correct bus account CREATE_IMAGE  action //
    describe("POST '/api/uploads/service_images/:serviceId' - LOGGED IN and CORRECT BUSINESS ACCOUNT - Multer Upload and CREATE_IMAGE action", () => {

      it("Should upload and create 'ServiceImage model' send back apropriate response", (done) => {
        const testImgPath = path.join(path.resolve(), "app", "_tests_", "api", "test_images", "test.jpg");
        
        chai.request(server)
          .post("/api/uploads/service_images/" + (firstAdminsService._id as string)) 
          .set({ "Authorization": firstAdminToken })
          .attach("serviceImage", fs.readFileSync(testImgPath), "test.jpg")
          .end((err, response) => {
            if (err) done(err);
            createdImage = response.body.newServiceImage;
            // assert correct response //
            expect(response.status).to.equal(200);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.newServiceImage).to.be.an("object");
            expect(response.body.updatedService).to.be.an("object");
            // 
            expect(response.body.error).to.be.undefined;
            expect(response.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly set all fields in new 'ServiceImage' model", () => {
        expect(createdImage.businessAccountId).to.be.a("string");
        expect(createdImage.fileName).to.be.a("string");
        expect(createdImage.url).to.be.a("string");
        expect(createdImage.absolutePath).to.be.a("string");
        expect(createdImage.imagePath).to.be.a("string");
        expect(createdImage.createdAt).to.be.a("string");
      });
      it("Should correctly set the 'url' property on the 'ServiceImage' model", (done) => {
        chai.request(server)
          .get(createdImage.url)
          .end((err, response) => {
            if (err) done(err);
            expect(response.status).to.equal(200);
            expect(response.type).to.equal("image/jpeg");
            expect(response.header["content-type"]).to.equal("image/jpeg");
            done();
          });
      });
      it("Should correctly set the 'absolutePath' property on the 'ServiceImage' model", (done) => {
        fs.access(createdImage.absolutePath, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => {
          if (err) done (err);
          expect(err).to.be.null;
          done();
        }) 
      });
      it("Should place the image into the upload directory", (done) => {
        let imageDirectory = path.join(path.resolve(), "public", "uploads", "service_images", firstAdminBusAcctId, firstAdminsService._id.toString())
        fs.readdir(imageDirectory, (err, files) => {
          if(err) done(err);
          expect(err).to.equal(null);
          expect(files.length).to.equal(2);
          done();
        });
      });
      it("Should create a new 'ServiceImage' model in the database", (done) => {
        ServiceImage.exists({ _id: createdImage._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should INCREASE the number of 'ServiceImage' models by 1", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(serviceImageModelCount + 1);
            serviceImageModelCount = number;
            done();
          })
          .catch((err) => {
            done(err); 
          });
      });
      it("Should add the 'ServiceImage' to the 'Service' model 'images' subarray ", (done) => {
        Service.findOne({ _id: firstAdminsService._id }).exec()
          .then((foundService) => {
            const imgId = foundService!.images.filter((imgId) => String(imgId) === String(createdImage._id));
            expect(imgId.length).to.equal(1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should INCREASE the number of images in the queried Service model by 1", (done) => {
        Service.findOne({ _id: firstAdminsService._id }).exec()
          .then((foundService) => {
            expect(foundService!.images.length).to.equal(firstAdminsService.images.length + 1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST POST 'ServiceImagesController' no login CREATE_IMAGE  action //

    // TEST DELETE 'ServiceImagesController' DELETE_IMAGE action wih login  and correct bus account //
    describe("DELETE '/api/uploads/service_images/:serviceId/:serviceImgId' - WITH LOGIN and BUSINESS_ACCOUNT -  DELETE_IMAGE action", () => {

      it("Should successfully remove the 'ServiceImage' and respond with correct response", (done) => {
        const serviceId = firstAdminsService._id as string;
        const serviceImgId = createdImage._id as string;
        chai.request(server)
          .delete(`/api/uploads/service_images/${serviceId}/${serviceImgId}`)
          .set({ "Authorization": firstAdminToken })
          .end((err, response) => {
            if (err) done(err);
            deletedImage = response.body.deletedServiceImage;
            // assert correct reponse //
            expect(response.status).to.equal(200);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.deletedServiceImage).to.be.an("object");
            expect(response.body.updatedService).to.be.an("object");
            // 
            expect(response.body.error).to.be.undefined;
            expect(response.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should delete the image file from its directory", (done) => {
        const imagePath = deletedImage.absolutePath
        fs.access(imagePath, fs.constants.F_OK, (err) => {
          expect(err!.code === "ENOENT");
          done();
        });
      });
      it("Should remove the 'ServiceImage' model from the database", (done) => {
        ServiceImage.exists({ _id: deletedImage._id })
          .then((exists) => {
            expect(exists).to.equal(false);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should DECREASE the number of 'ServiceImage' model by 1", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(serviceImageModelCount - 1);
            serviceImageModelCount = number;
            done();
          })
          .catch((err) => { 
            done(err); 
          });
      });
      it("Should remove the ServiceImage id from the queried 'Service' model", (done) => {
        Service.findOne({ _id: firstAdminsService._id }).exec()
          .then((service) => {
            const imgId = service!.images.filter((imgId) => String(imgId) === String(deletedImage._id));
            expect(imgId.length).to.equal(0);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    
    });
    // END TEST DELETE 'ServiceImagesController' DELETE_IMAGE action wihout login //
    
  });
  // END CONTEXT POST/DELETE API tests with LOGIN and CORRECT business account //
  
  // CONTEXT POST/DELETE API tests with LOGIN but INCORRECT business account //
  context("POST/DELETE  'ServiceImgUplController' API tests - LOGGED IN  - INCORRECT BUSINESS ACCOUNT - CREATE_IMAGE, DELETE_IMAGE actions", () => {

    // TEST POST 'ServiceImagesController' login and incorrect bus account CREATE_IMAGE  action //
    describe("POST '/api/uploads/service_images/:serviceId' - LOGGED IN but INCORRECT BUSINESS ACCOUNT - Multer Upload and CREATE_IMAGE action", () => {

      it("Should NOT upload and create 'ServiceImage' model send back apropriate response", (done) => {
        const testImgPath = path.join(path.resolve(), "app", "_tests_", "api", "test_images", "test.jpg");
        
        chai.request(server)
          .post("/api/uploads/service_images/" + (firstAdminsService._id as string)) 
          .set({ "Authorization": secondAdminToken })
          .attach("serviceImage", fs.readFileSync(testImgPath), "test.jpg")
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            //
            expect(response.body.newServiceImage).to.be.undefined;
            expect(response.body.updatedService).to.be.undefined;
            done();
          });
      });
      it("Should NOT place the image into the upload directory", (done) => {
        let imageDirectory = path.join(path.resolve(), "public", "uploads", "service_images", firstAdminBusAcctId, firstAdminsService._id.toString())
        fs.readdir(imageDirectory, (err, files) => {
          if(err) done(err);
          expect(err).to.equal(null);
          expect(files.length).to.equal(1);
          done();
        });
      });
      it("Should NOT alter the number of 'ServiceImage' models in the database", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(serviceImageModelCount);
            done();
          })
          .catch((err) => {
            done(err); 
          });
      });
      it("Should NOT alter the number of images in the queried 'Service' model", (done) => {
        Service.findOne({ _id: firstAdminsService._id }).exec()
          .then((foundService) => {
            expect(foundService!.images.length).to.equal(firstAdminsService.images.length);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST POST 'ServiceImagesController' login and incorrect bus account CREATE_IMAGE  action //

    // TEST DELETE 'ServiceImagesController' logged in and inccorrect bus account DELETE_IMAGE action //
    describe("DELETE '/api/uploads/service_images/:createdImgId/:serviceId/' - WITH LOGIN and BUSINESS_ACCOUNT -  DELETE_IMAGE action", () => {

      it("Should NOT remove the 'ServiceImage' and respond with correct error response", (done) => {
        const serviceId = firstAdminsService._id as string;
        const serviceImgId = firstAdminsServiceImage._id as string;
        chai.request(server)
          .delete(`/api/uploads/service_images/${serviceId}/${serviceImgId}`)
          .set({ "Authorization": secondAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            //
            expect(response.body.newServiceImage).to.be.undefined;
            expect(response.body.updatedService).to.be.undefined;
            done();
          });
      });
      it("Should NOT delete the image from its directory", (done) => {
        const imagePath = firstAdminsServiceImage.absolutePath
        fs.access(imagePath, fs.constants.F_OK, (error) => {
          expect(error).to.be.null;
          done();
        });
      });
      it("Should NOT remove the 'ServiceImage' model from the database", (done) => {
        ServiceImage.exists({ _id: firstAdminsServiceImage._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT DECREASE the number of 'ServiceImage' model by 1", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(serviceImageModelCount);
            done();
          })
          .catch((err) => { 
            done(err); 
          });
      });
      it("Should NOT remove the ServiceImage id from the queried 'Service' model", (done) => {
        Service.findOne({ _id: firstAdminsService._id }).exec()
          .then((service) => {
            const imgId = service!.images.filter((imgId) => String(imgId) === String(firstAdminsServiceImage._id));
            expect(imgId.length).to.equal(1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    
    });
    // END TEST DELETE 'ServiceImagesController' logged in and incorrect bus account DELETE_IMAGE action //

  });
  // END CONTEXT POST/DELETE API tests with LOGIN but INCORRECT business account //
  
});