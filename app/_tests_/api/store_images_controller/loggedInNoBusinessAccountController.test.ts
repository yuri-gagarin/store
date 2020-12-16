import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import { Types } from "mongoose";
// node dependencies //
import fs from "fs";
import path from "path";
// server import //
import server from "../../../server";
// models and model interfaces //
import Store, { IStore } from "../../../models/Store";
import StoreImage, { IStoreImage } from "../../../models/StoreImage";
// setup helpers //
import { setupStoreImgControllerTests,cleanUpStoreImgControllerTests } from "./helpers/setupStoreImageControllerTest";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";
// helpers //
import { isEmptyObj } from "../../../controllers/_helpers/queryHelpers";
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

describe("StoreImagesUplController - LOGGED IN - NO BUSINESS ACCOUNT SET UP - POST/DELETE API tests", () => {
  let thirdAdmin: IAdministrator;
  let thirdAdminToken: string;
  let firstAdminsStore: IStore;
  let firstAdminsStoreImage: IStoreImage;
  let storeImageModelCount: number;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;

  before((done) => {
    setupStoreImgControllerTests()
      .then(({ admins, busAccountIds, stores, storeImages }) => {
        ({ thirdAdmin } = admins);
        ({ firstAdminsStore } = stores);
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = busAccountIds);
        [ firstAdminsStoreImage ] = storeImages.firstAdminsStoreImgs;

        return StoreImage.countDocuments().exec();
      })
      .then((number) => {
        storeImageModelCount = number;
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
    cleanUpStoreImgControllerTests(firstAdminBusAcctId, secondAdminBusAcctId)
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
  
  context("POST/DELETE  'StoreImgUplController' API tests - LOGGED IN - NO BUSINESS ACCOUNT - CREATE_IMAGE, DELETE_IMAGE actions", () => {
    // TEST POST 'StoreImagesController' with login no business acount CREATE_IMAGE  action //
    describe("POST '/api/uploads/store_images/:storeId' - WITH LOGIN - NO BUSINESS ACCOUNT - Multer Upload and CREATE_IMAGE action", () => {

      it("Should NOT upload and create StoreImage model, send back correct response", (done) => {
        const testImgPath = path.join(path.resolve(), "app", "_tests_", "api", "test_images", "test.jpg");
        
        chai.request(server)
          .post("/api/uploads/store_images/" + firstAdminsStore._id)
          .set({ "Authorization": thirdAdminToken })
          .attach("storeImage", fs.readFileSync(testImgPath), "test.jpg")
          .end((err, response) => {
            if (err) done(err);
            // ssert correct 
            expect(response.status).to.equal(401);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            expect(response.body.newStoreImage).to.be.undefined;
            expect(response.body.updatedStore).to.be.undefined;
            done();
          });
      });
      it("Should NOT place the image into the upload directory", (done) => {
        let imageDirectory = path.join(path.resolve(), "public", "uploads", "store_images", firstAdminBusAcctId, firstAdminsStore._id.toString())
        fs.readdir(imageDirectory, (err, files) => {
          if(err) done(err);
          expect(err).to.equal(null);
          expect(files.length).to.equal(1);
          done();
        });
      });
      it("Should NOT INCREASE the number of 'StoreImage' models in the database", (done) => {
        StoreImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(storeImageModelCount);
            done();
          })
          .catch((err) => {
            done(err); 
          });
      });
      it("Should NOT INCREASE the number of images in the queried 'Store' model", (done) => {
        Store.findOne({ _id: firstAdminsStore._id }).exec()
          .then((foundStore) => {
            expect(foundStore!.images.length).to.equal(firstAdminsStore.images.length);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST POST 'StoreImagesController' with login no bus account CREATE_IMAGE  action //
    
    // TEST DELETE 'StoreImagesController' DELETE_IMAGE action with login no bus account //
    describe("DELETE '/api/uploads/store_images/:storeImgId/:storeId' - WITH LOGIN - NO BUSINESS ACCOUNT -  DELETE_IMAGE action", () => {

      it("Should NOT delete an image from files and send back a correct response", (done) => {
        const storeId = firstAdminsStore._id as string;
        const storeImageId = firstAdminsStoreImage._id as string;;
        chai.request(server)
          .delete(`/api/uploads/store_images/${storeId}/${storeImageId}`)
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
            expect(response.body.newStoreImage).to.be.undefined;
            expect(response.body.updatedStore).to.be.undefined;
            done();
          });
      });
      it("Should NOT delete the image from its directory", (done) => {
        const imagePath = firstAdminsStoreImage.absolutePath
        fs.access(imagePath, fs.constants.F_OK, (err) => {
          expect(err).to.be.null;
          done();
        });
      });
      it("Should NOT remove the 'StoreImage' model from the database", (done) => {
        StoreImage.exists({ _id: firstAdminsStoreImage._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT DECREASE the number of 'StoreImage' model by 1", (done) => {
        StoreImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(storeImageModelCount);
            done();
          })
          .catch((err) => { 
            done(err); 
          });
      });
      it("Should NOT remove the 'StoreImage' id from the queried 'Store' model", (done) => {
        Store.findOne({ _id: firstAdminsStore._id }).exec()
          .then((store) => {
            const imgId = store!.images.filter((imgId) => String(imgId) === String(firstAdminsStoreImage._id));
            expect(imgId.length).to.equal(1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST DELETE 'StoreImagesController' DELETE_IMAGE action with login and no business account //
  });
  // END CONTEXT //
});