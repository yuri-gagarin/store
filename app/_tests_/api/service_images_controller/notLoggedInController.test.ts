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
// helpers //
import { isEmptyObj } from "../../../controllers/_helpers/queryHelpers";
import { clearDB } from "../../helpers/dbHelpers";

chai.use(chaiHTTP);

/**
 * Scenario when an Admin is not logged.
 * In this scenarion 'passport' middleware does not allow further access.
 * response should return:
 * {
 *   status: 401;
 *   error: Error;
 * }
 */

describe("ServiceImagesUplController - NOT LOGGED IN - POST/DELETE API tests", () => {
  let firstAdminsService: IService;
  let firstAdminsServiceImage: IServiceImage;
  let serviceImageModelCount: number;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;

  before((done) => {
    setupServiceImgControllerTests()
      .then(({ admins, busAccountIds, services, serviceImages }) => {
        ({ firstAdminsService } = services);
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = busAccountIds);
        [ firstAdminsServiceImage ] = serviceImages.firstAdminsServiceImgs;
        return ServiceImage.countDocuments().exec();
      })
      .then((number) => {
        serviceImageModelCount = number;
        done();
      })
      .catch((err) => {
        done(err);
      })
  });

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
  
  context("POST/DELETE  'ServiceImgUplController' API tests - NOT LOGGED IN - CREATE_IMAGE, DELETE_IMAGE actions", () => {
    // TEST POST 'ServiceImagesController' no login CREATE_IMAGE  action //
    describe("POST '/api/uploads/service_images/:serviceId' - NO LOGIN - Multer Upload and CREATE_IMAGE action", () => {

      it("Should NOT upload and create a 'ServiceImage' model", (done) => {
        const testImgPath = path.join(path.resolve(), "app", "_tests_", "api", "test_images", "test.jpg");
        
        chai.request(server)
          .post("/api/uploads/service_images/" + firstAdminsService._id)
          .set({ "Authorization": "" })
          .attach("serviceImage", fs.readFileSync(testImgPath), "test.jpg")
          .end((err, response) => {
            if (err) { console.error(err); done(err); }
            expect(response.status).to.equal(401);
            expect(response.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(response.body)).to.equal(true);
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
      it("Should NOT INCREASE the number of 'ServiceImage' models by 1", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(serviceImageModelCount);
            done();
          })
          .catch((err) => {
            done(err); 
          });
      });
      it("Should NOT INCREASE the number of images in the queried Service model", (done) => {
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
    // END TEST POST 'ServiceImagesController' no login CREATE_IMAGE  action //

    // TEST DELETE 'ServiceImagesController' DELETE_IMAGE action wihout login //
    describe("DELETE '/api/uploads/service_images/:serviceId/:serviceImgId' - NO LOGIN -  DELETE_IMAGE action", () => {

      it("Should NOT remove an image and destroy the ServiceImage model, send back correct response", (done) => {
        const serviceId = firstAdminsService._id as string;
        const serviceImgId = firstAdminsServiceImage._id as string;
        chai.request(server)
          .delete(`/api/uploads/service_images/${serviceId}/${serviceImgId}`)
          .end((err, response) => {
            if (err) done(err);
            // assert correct reponse //
            expect(response.status).to.equal(401);
            expect(isEmptyObj(response.body)).to.equal(true);
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
    // END TEST DELETE 'ServiceImagesController' DELETE_IMAGE action wihout login //
  });
  // END CONTEXT //

});