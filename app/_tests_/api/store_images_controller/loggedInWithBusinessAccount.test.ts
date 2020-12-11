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
import { isEmptyObj } from "../../../controllers/helpers/queryHelpers";
import { clearDB } from "../../helpers/dbHelpers";
import { IAdministrator } from "../../../models/Administrator";
import { response } from "express";

chai.use(chaiHTTP);
/**
 * // Scenario when an Admin is registered and logged in AND has a correct BusinessAccount allowing them to edit Store in questin and CREATE/DELETE StoreImages. //
 * // In this scenario  'passport' middleware allows further access //
 * // {checkImgUploudCredentials} custom middleware should intercept this request and process access rights //
 * //
 * // If admin.businessAccountId === store.businessAccountId then {checkImgUpload} middleware should pass on to //
 * // 'StoreImgUplConroller' and allow CREATE_IMAGE and DELETE_IMAGE actions.
 * // Otherwise if admin.businessAccountId !== store.businessAccountId then {checlImgUpload} middleware should bock access and //
 * // return the appropiate response. //
 * // response options include: //
 * 
 * // SUCCESSFUL response should return:
 * // {
 * //   responseMsg: string;
 * //   newStoreImage: IStoreImage;
 * //   updatedStore: IStore;
 * // }
 * // UNSUCCCESSFUL response should return"
 * // {
 * //   responseMsg: string;
 * //   error: 'Object' | Error;
 * //   errorMessages: string[];
 * // }
 */

describe("StoreImagesUplController - LOGGED IN - BUSINESS ACCOUNT SET UP - POST/DELETE API tests", () => {
  // admins, admin login tokens and admin business account ids //
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator;
  let firstAdminToken: string, secondAdminToken: string;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;
  // admin Store models //
  let firstAdminsStore: IStore;
  let secondAdminsStore: IStore;
  // admin StoreImage models //
  let firstAdminsStoreImage: IStoreImage;
  let secondAdminsStoreImage: IStoreImage;
  // created and deleted images //
  let createdImage: IStoreImage;
  let deletedImage: IStoreImage;
  // aditonal variables //
  let storeImageModelCount: number;

  before((done) => {
    setupStoreImgControllerTests()
      .then(({ admins, busAccountIds, stores, storeImages }) => {
        ({ firstAdmin, secondAdmin } = admins);
        ({ firstAdminsStore, secondAdminsStore } = stores);
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = busAccountIds);
        [ firstAdminsStoreImage, secondAdminsStoreImage ] = storeImages.firstAdminsStoreImgs;
        return StoreImage.countDocuments().exec();
      })
      .then((number) => {
        storeImageModelCount = number;
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
      
     done();
  });

  // CONTEXT POST/DELETE API tets with LOGIN and CORRECT business account //
  context("POST/DELETE  'StoreImgUplController' API tests - WITH LOGIN AND CORRECT BUSINESS ACCOUNT - CREATE_IMAGE, DELETE_IMAGE actions", () => {

    // TEST POST 'StoreImagesController' login and correct bus account CREATE_IMAGE  action //
    describe("POST '/api/store_images/upload' - WITH LOGIN - WITH BUSINESS ACCOUNT - Multer Upload and CREATE_IMAGE action", () => {

      it("Should correctly upload and create 'StoreImage model' ", (done) => {
        const testImgPath = path.join(path.resolve(), "app", "_tests_", "api", "test_images", "test.jpg");
        
        chai.request(server)
          .post("/api/uploads/store_images/" + firstAdminsStore._id)
          .set({ "Authorization": firstAdminToken })
          .attach("storeImage", fs.readFileSync(testImgPath), "test.jpg")
          .end((err, response) => {
            if (err) done(err);
            createdImage = response.body.newStoreImage;
            // assert correct response //
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.newStoreImage).to.be.an("object");
            expect(response.body.updatedStore).to.be.an("object");
            // 
            expect(response.body.error).to.be.undefined;
            expect(response.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly set all fields in new 'StoreImage' model", () => {
        expect(createdImage.businessAccountId).to.be.a("string");
        expect(createdImage.fileName).to.be.a("string");
        expect(createdImage.url).to.be.a("string");
        expect(createdImage.absolutePath).to.be.a("string");
        expect(createdImage.imagePath).to.be.a("string");
        expect(createdImage.createdAt).to.be.a("string");
      });
      it("Should correctly set the 'url' property on the 'StoreImage' model", (done) => {
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
      it("Should correctly set the 'absolutePath' property on the 'StoreImage' model", (done) => {
        fs.access(createdImage.absolutePath, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => {
          if (err) done (err);
          expect(err).to.be.null;
          done();
        }) 
      });
      it("Should place the image into the upload directory", (done) => {
        let imageDirectory = path.join(path.resolve(), "public", "uploads", "store_images", firstAdminBusAcctId, firstAdminsStore._id.toString())
        fs.readdir(imageDirectory, (err, files) => {
          if(err) done(err);
          expect(err).to.equal(null);
          expect(files.length).to.equal(2);
          done();
        });
      });
      it("Should create a new 'StoreImage' model in the database", (done) => {
        StoreImage.exists({ _id: createdImage._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should INCREASE the number of 'StoreImage' models by 1", (done) => {
        StoreImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(storeImageModelCount + 1);
            storeImageModelCount = number;
            done();
          })
          .catch((err) => {
            done(err); 
          });
      });
      it("Should add the 'StoreImage' to the 'Store' model 'images' subarray ", (done) => {
        Store.findOne({ _id: firstAdminsStore._id }).exec()
          .then((foundStore) => {
            const imgId = foundStore!.images.filter((imgId) => String(imgId) === String(createdImage._id));
            expect(imgId.length).to.equal(1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should INCREASE the number of images in the queried Store model by 1", (done) => {
        Store.findOne({ _id: firstAdminsStore._id }).exec()
          .then((foundStore) => {
            expect(foundStore!.images.length).to.equal(firstAdminsStore.images.length + 1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST POST 'StoreImagesController' no login CREATE_IMAGE  action //
    
    // TEST DELETE 'StoreImagesController' DELETE_IMAGE action wih login  and correct bus account //
    describe("DELETE '/api/store_images/upload' - WITH LOGIN and BUSINESS_ACCOUNT -  DELETE_IMAGE action", () => {

      it("Should successfully remove the 'StoreImage' and respond with correct response", (done) => {
        chai.request(server)
          .delete("/api/uploads/store_images/" + (createdImage._id as string) + "/" + (firstAdminsStore._id as string))
          .set({ "Authorization": firstAdminToken })
          .end((err, response) => {
            if (err) done(err);
            deletedImage = response.body.deletedStoreImage;
            // assert correct reponse //
            expect(response.status).to.equal(200);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.deletedStoreImage).to.be.an("object");
            expect(response.body.updatedStore).to.be.an("object");
            // 
            expect(response.body.error).to.be.undefined;
            expect(response.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should delete the image from its directory", (done) => {
        const imagePath = deletedImage.absolutePath
        fs.access(imagePath, fs.constants.F_OK, (err) => {
          expect(err!.code === "ENOENT");
          done();
        });
      });
      it("Should remove the 'StoreImage' model from the database", (done) => {
        StoreImage.exists({ _id: deletedImage._id })
          .then((exists) => {
            expect(exists).to.equal(false);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should DECREASE the number of 'StoreImage' model by 1", (done) => {
        StoreImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(storeImageModelCount - 1);
            storeImageModelCount = number;
            done();
          })
          .catch((err) => { 
            done(err); 
          });
      });
      it("Should remove the StoreImage id from the queried 'Store' model", (done) => {
        Store.findOne({ _id: firstAdminsStore._id }).exec()
          .then((store) => {
            const imgId = store!.images.filter((imgId) => String(imgId) === String(deletedImage._id));
            expect(imgId.length).to.equal(0);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    
    });
    // END TEST DELETE 'StoreImagesController' DELETE_IMAGE action wihout login //
    
  });
  // END CONTEXT POST/DELETE API tets with LOGIN and CORRECT business account //

});