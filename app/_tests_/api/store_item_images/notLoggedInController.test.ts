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

describe("StoreItemImagesUplController - NOT LOGGED IN - POST/DELETE API tests", () => {
  let firstAdminsStoreItem: IStoreItem;
  let firstAdminsStoreItemImage: IStoreItemImage;
  let storeImageModelCount: number;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;

  before((done) => {
    setupStoreItemImgControllerTests()
      .then(({ busAccountIds, storeItems, storeItemImages }) => {
        ({ firstAdminsStoreItem } = storeItems);
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = busAccountIds);
        [ firstAdminsStoreItemImage ] = storeItemImages.firstAdminsStoreItemImgs;
        return StoreItemImage.countDocuments().exec();
      })
      .then((number) => {
        storeImageModelCount = number;
        done();
      })
      .catch((err) => {
        done(err);
      })
  });

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
  
  context("POST/DELETE  'StoreItemImgUplController' API tests - NOT LOGGED IN - CREATE_IMAGE, DELETE_IMAGE actions", () => {
    // TEST POST 'StoreItemImagesController' no login CREATE_IMAGE  action //
    describe("POST '/api/uploads/store_item_images/:storeItemId' - NO LOGIN - Multer Upload and CREATE_IMAGE action", () => {

      it("Should NOT upload and create a 'StoreItemImage' model", (done) => {
        const testImgPath = path.join(path.resolve(), "app", "_tests_", "api", "test_images", "test.jpg");
        const storeItemId = firstAdminsStoreItem._id as string;
        chai.request(server)
          .post(`/api/uploads/store_item_images/${storeItemId}`)
          .set({ "Authorization": "" })
          .attach("storeItemImage", fs.readFileSync(testImgPath), "test.jpg")
          .end((err, response) => {
            if (err) { console.error(err); done(err); }
            expect(response.status).to.equal(401);
            expect(response.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(response.body)).to.equal(true);
            done();
          });
      });
      
      it("Should NOT place the image into the upload directory", (done) => {
        let imageDirectory = path.join(path.resolve(), "public", "uploads", "store_item_images", firstAdminBusAcctId, (firstAdminsStoreItem._id.toString()))
        fs.readdir(imageDirectory, (err, files) => {
          if(err) done(err);
          expect(err).to.equal(null);
          expect(files.length).to.equal(1);
          done();
        });
      });
      it("Should NOT INCREASE the number of 'StoreItemImage' models by 1", (done) => {
        StoreItemImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(storeImageModelCount);
            done();
          })
          .catch((err) => {
            done(err); 
          });
      });
      it("Should NOT INCREASE the number of images in the queried StoreItem model", (done) => {
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
    // END TEST POST 'StoreItemImagesController' no login CREATE_IMAGE  action //

    // TEST DELETE 'StoreItemImagesController' DELETE_IMAGE action wihout login //
    describe("DELETE '/api/uploads/store_item_images/:storeItemId/:storeItemImgId' - NO LOGIN -  DELETE_IMAGE action", () => {

      it("Should NOT remove an image and destroy the StoreItemImage model, send back correct response", (done) => {
        const storeItemId = firstAdminsStoreItem._id as string;
        const storeItemImgId = firstAdminsStoreItemImage._id as string;
        chai.request(server)
          .delete(`/api/uploads/store_item_images/${storeItemId}/${storeItemImgId}`)
          .end((err, response) => {
            if (err) done(err);
            // assert correct reponse //
            expect(response.status).to.equal(401);
            expect(isEmptyObj(response.body)).to.equal(true);
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
            expect(number).to.equal(storeImageModelCount);
            done();
          })
          .catch((err) => { 
            done(err); 
          });
      });
      it("Should NOT remove the StoreItemImage id from the queried 'StoreItem' model", (done) => {
        StoreItem.findOne({ _id: firstAdminsStoreItem._id }).exec()
          .then((store) => {
            const imgId = store!.images.filter((imgId) => String(imgId) === String(firstAdminsStoreItemImage._id));
            expect(imgId.length).to.equal(1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST DELETE 'StoreItemImagesController' DELETE_IMAGE action wihout login //
  });
  // END CONTEXT //

});