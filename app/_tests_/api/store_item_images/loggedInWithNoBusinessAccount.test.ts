import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// node dependencies //
import fs from "fs";
import path from "path";
// server import //
import server from "../../../server";
// models and model interfaces //
import StoreItem, { IStoreItem } from "../../../models/StoreItem";
import StoreItemImage, { IStoreItemImage } from "../../../models/StoreItemImage";
// setup helpers //
import { setupStoreItemImgControllerTests, cleanUpStoreItemImgControllerTests } from "./helpers/testSetupAndCleanup";
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

describe("StoreItemImagesUplController - LOGGED IN - NO BUSINESS ACCOUNT SET UP - POST/DELETE API tests", () => {
  let thirdAdmin: IAdministrator;
  let thirdAdminToken: string;
  let firstAdminsStoreItem: IStoreItem;
  let firstAdminsStoreItemImage: IStoreItemImage;
  let storeItemImageModelCount: number;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;

  before((done) => {
    setupStoreItemImgControllerTests()
      .then(({ admins, busAccountIds, storeItems, storeItemImages }) => {
        ({ thirdAdmin } = admins);
        ({ firstAdminsStoreItem } = storeItems);
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = busAccountIds);
        [ firstAdminsStoreItemImage ] = storeItemImages.firstAdminsStoreItemImgs;

        return StoreItemImage.countDocuments().exec();
      })
      .then((number) => {
        storeItemImageModelCount = number;
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
    cleanUpStoreItemImgControllerTests(firstAdminBusAcctId, secondAdminBusAcctId)
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
  
  context("POST/DELETE  'StoreItemImgUplController' API tests - LOGGED IN - NO BUSINESS ACCOUNT - CREATE_IMAGE, DELETE_IMAGE actions", () => {
    // TEST POST 'StoreItemImagesController' with login no business acount CREATE_IMAGE  action //
    describe("POST '/api/uploads/store_images/:storeItemId' - WITH LOGIN - NO BUSINESS ACCOUNT - Multer Upload and CREATE_IMAGE action", () => {

      it("Should NOT upload and create a 'StoreItemImage' model, send back correct response", (done) => {
        const testImgPath = path.join(path.resolve(), "app", "_tests_", "api", "test_images", "test.jpg");
        
        chai.request(server)
          .post("/api/uploads/store_item_images/" + (firstAdminsStoreItem._id as string)) 
          .set({ "Authorization": thirdAdminToken })
          .attach("storeItemImage", fs.readFileSync(testImgPath), "test.jpg")
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            expect(response.body.newStoreItemImage).to.be.undefined;
            expect(response.body.updatedStoreItem).to.be.undefined;
            done();
          });
      });
      it("Should NOT place the queried image into the upload directory", (done) => {
        let imageDirectory = path.join(path.resolve(), "public", "uploads", "store_item_images", firstAdminBusAcctId, firstAdminsStoreItem._id.toString())
        fs.readdir(imageDirectory, (err, files) => {
          if(err) done(err);
          expect(err).to.equal(null);
          expect(files.length).to.equal(1);
          done();
        });
      });
      it("Should NOT INCREASE the number of 'StoreItemImage' models in the database", (done) => {
        StoreItemImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(storeItemImageModelCount);
            done();
          })
          .catch((err) => {
            done(err); 
          });
      });
      it("Should NOT INCREASE the number of images in the queried 'StoreItem' model", (done) => {
        StoreItem.findOne({ _id: firstAdminsStoreItem._id }).exec()
          .then((foundStoreItem) => {
            expect(foundStoreItem!.images.length).to.equal(firstAdminsStoreItem.images.length);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST POST 'StoreItemImagesController' with login no bus account CREATE_IMAGE  action //
    
    // TEST DELETE 'StoreItemImagesController' DELETE_IMAGE action with login no bus account //
    describe("DELETE '/api/uploads/storeItem_images/:storeItemId/:storeItemImgId' - WITH LOGIN - NO BUSINESS ACCOUNT -  DELETE_IMAGE action", () => {

      it("Should NOT delete an image from files and send back a correct response", (done) => {
        const storeItemId = firstAdminsStoreItem._id as string;
        const storeItemImgId = firstAdminsStoreItemImage._id as string;
        chai.request(server)
          .delete(`/api/uploads/store_item_images/${storeItemId}/${storeItemImgId}`)
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
            expect(response.body.newStoreItemImage).to.be.undefined;
            expect(response.body.updatedStoreItem).to.be.undefined;
            done();
          });
      });
      it("Should NOT delete the image from its directory", (done) => {
        const imagePath = firstAdminsStoreItemImage.absolutePath
        fs.access(imagePath, fs.constants.F_OK, (err) => {
          expect(err).to.be.null;
          done();
        });
      });
      it("Should NOT remove the 'StoreItemImage' model from the database", (done) => {
        StoreItemImage.exists({ _id: firstAdminsStoreItemImage._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT DECREASE the number of 'StoreItemImage' model by 1", (done) => {
        StoreItemImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(storeItemImageModelCount);
            done();
          })
          .catch((err) => { 
            done(err); 
          });
      });
      it("Should NOT remove the 'StoreItemImage' id from the queried 'StoreItem' model", (done) => {
        StoreItem.findOne({ _id: firstAdminsStoreItem._id }).exec()
          .then((storeItem) => {
            const imgId = storeItem!.images.filter((imgId) => String(imgId) === String(firstAdminsStoreItemImage._id));
            expect(imgId.length).to.equal(1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST DELETE 'StoreItemImagesController' DELETE_IMAGE action with login and no business account //
  });
  // END CONTEXT //
});