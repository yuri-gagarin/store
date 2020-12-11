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
// helpers //
import { isEmptyObj } from "../../../controllers/helpers/queryHelpers";
import { clearDB } from "../../helpers/dbHelpers";
import { IAdministrator } from "../../../models/Administrator";

chai.use(chaiHTTP);

describe("StoreImagesUplController - NOT LOGGED IN - POST/DELETE API tests", () => {
  let firstAdmin: IAdministrator;
  let firstAdminsStore: IStore;
  let firstAdminsStoreImage: IStoreImage;
  let storeImageModelCount: number;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;

  before((done) => {
    setupStoreImgControllerTests()
      .then(({ admins, busAccountIds, stores, storeImages }) => {
        ({ firstAdmin } = admins);
        ({ firstAdminsStore } = stores);
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = busAccountIds);
        [ firstAdminsStoreImage ] = storeImages.firstAdminsStoreImgs;
        return StoreImage.countDocuments().exec();
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
  
  context("POST/DELETE  'StoreImgUplController' API tests - NOT LOGGED IN - CREATE_IMAGE, DELETE_IMAGE actions", () => {
    // TEST POST 'StoreImagesController' no login CREATE_IMAGE  action //
    describe("POST '/api/store_images/upload' - NO LOGIN - Multer Upload and CREATE_IMAGE action", () => {

      it("Should NOT  upload and create StoreImage model", (done) => {
        const testImgPath = path.join(path.resolve(), "app", "_tests_", "api", "test_images", "test.jpg");
        
        chai.request(server)
          .post("/api/uploads/store_images/" + firstAdminsStore._id)
          .set({ "Authorization": "" })
          .attach("storeImage", fs.readFileSync(testImgPath), "test.jpg")
          .end((err, response) => {
            if (err) { console.error(err); done(err); }
            expect(response.status).to.equal(401);
            expect(response.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(response.body)).to.equal(true);
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
      it("Should NOT INCREASE the number of {StoreImage(s)} by 1", (done) => {
        StoreImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(storeImageModelCount);
            done();
          })
          .catch((err) => {
            done(err); 
          });
      });
      it("Should NOT INCREASE the number of images in the queried Store model", (done) => {
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
    // END TEST POST 'StoreImagesController' no login CREATE_IMAGE  action //

    // TEST DELETE 'StoreImagesController' DELETE_IMAGE action wihout login //
    describe("DELETE '/api/store_images/upload' - NO LOGIN -  DELETE_IMAGE action", () => {

      it("Should NOT allow successfully remove an image and destroy the StoreImage model", (done) => {
        chai.request(server)
          .delete("/api/uploads/store_images/" + (firstAdminsStoreImage._id) + "/" + firstAdminsStore._id)
          .end((err, response) => {
            if (err) done(err);
            // assert correct reponse //
            expect(response.status).to.equal(401);
            expect(isEmptyObj(response.body)).to.equal(true);
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
      it("Should NOT remove the StoreImage id from the queried 'Store' model", (done) => {
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
    // END TEST DELETE 'StoreImagesController' DELETE_IMAGE action wihout login //
  });
  // END CONTEXT //

});