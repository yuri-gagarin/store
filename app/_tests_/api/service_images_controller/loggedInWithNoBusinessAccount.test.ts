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
 * Scenario when an Admin is registered and logged in but has no BusinessAccount set up.
 * In this scenarion 'passport' middleware allows further access but the Admin should be further restricted until they set up a BusinessAccount.
 * {checkImgUploudCredentials} custom middleware should intercept this request and return 401 Not Allowed
 * response should return:
 * {
 *   responseMsg: string;
 *   error: Error;
 *   errorMessages: string[];
 * }
 */

describe("ServiceImagesUplController - LOGGED IN - NO BUSINESS ACCOUNT SET UP - POST/DELETE API tests", () => {
  let thirdAdmin: IAdministrator;
  let thirdAdminToken: string;
  let firstAdminsService: IService;
  let firstAdminsServiceImage: IServiceImage;
  let serviceImageModelCount: number;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;

  before((done) => {
    setupServiceImgControllerTests()
      .then(({ admins, busAccountIds, services, serviceImages }) => {
        ({ thirdAdmin } = admins);
        ({ firstAdminsService } = services);
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = busAccountIds);
        [ firstAdminsServiceImage ] = serviceImages.firstAdminsServiceImgs;

        return ServiceImage.countDocuments().exec();
      })
      .then((number) => {
        serviceImageModelCount = number;
        return loginAdmins(chai, server, [ thirdAdmin ]);
      })
      .then((adminTokensArr) => {
        [ thirdAdminToken ] = adminTokensArr;
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
  
  context("POST/DELETE  'ServiceImgUplController' API tests - LOGGED IN - NO BUSINESS ACCOUNT - CREATE_IMAGE, DELETE_IMAGE actions", () => {
    // TEST POST 'ServiceImagesController' with login no business acount CREATE_IMAGE  action //
    describe("POST '/api/uploads/service_images/:serviceId' - WITH LOGIN - NO BUSINESS ACCOUNT - Multer Upload and CREATE_IMAGE action", () => {

      it("Should NOT upload and create a 'ServiceImage' model, send back correct response", (done) => {
        const testImgPath = path.join(path.resolve(), "app", "_tests_", "api", "test_images", "test.jpg");
        
        chai.request(server)
          .post("/api/uploads/service_images/" + (firstAdminsService._id as string)) 
          .set({ "Authorization": thirdAdminToken })
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
            expect(response.body.newServiceImage).to.be.undefined;
            expect(response.body.updatedService).to.be.undefined;
            done();
          });
      });
      it("Should NOT place the queried image into the upload directory", (done) => {
        let imageDirectory = path.join(path.resolve(), "public", "uploads", "service_images", firstAdminBusAcctId, firstAdminsService._id.toString())
        fs.readdir(imageDirectory, (err, files) => {
          if(err) done(err);
          expect(err).to.equal(null);
          expect(files.length).to.equal(1);
          done();
        });
      });
      it("Should NOT INCREASE the number of 'ServiceImage' models in the database", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(serviceImageModelCount);
            done();
          })
          .catch((err) => {
            done(err); 
          });
      });
      it("Should NOT INCREASE the number of images in the queried 'Service' model", (done) => {
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
    // END TEST POST 'ServiceImagesController' with login no bus account CREATE_IMAGE  action //
    
    // TEST DELETE 'ServiceImagesController' DELETE_IMAGE action with login no bus account //
    describe("DELETE '/api/uploads/service_images/:serviceImgId/:serviceId' - WITH LOGIN - NO BUSINESS ACCOUNT -  DELETE_IMAGE action", () => {

      it("Should NOT delete an image from files and send back a correct response", (done) => {
        chai.request(server)
          .delete("/api/uploads/service_images/" + (firstAdminsServiceImage._id as string) + "/" + (firstAdminsService._id as string))
          .set({ "Authorization": thirdAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct reponse //
            expect(response.status).to.equal(401);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            expect(response.body.newServiceImage).to.be.undefined;
            expect(response.body.updatedService).to.be.undefined;
            done();
          });
      });
      it("Should NOT delete the image from its directory", (done) => {
        const imagePath = firstAdminsServiceImage.absolutePath
        fs.access(imagePath, fs.constants.F_OK, (err) => {
          expect(err).to.be.null;
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
      it("Should NOT remove the 'ServiceImage' id from the queried 'Service' model", (done) => {
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
    // END TEST DELETE 'ServiceImagesController' DELETE_IMAGE action with login and no business account //
  });
  // END CONTEXT //
});