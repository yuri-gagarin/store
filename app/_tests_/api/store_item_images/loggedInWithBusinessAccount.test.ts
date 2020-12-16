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
 * Scenario when an Admin is registered and logged in AND has a correct BusinessAccount allowing them to edit StoreItem in question and CREATE TDELETE StoreItemImages.
 * In this scenario  'passport' middleware allows further access
 * <checkImgUploudCredentials> custom middleware should intercept this request and process access rights
 *
 * If <admin.businessAccountId> === <storeItem.businessAccountId> then <checkImgUploadCredentials> middleware should pass on to
 * 'StoreItemImgUplConroller' and allow CREATE_IMAGE and DELETE_IMAGE actions.
 * Otherwise if <admin.businessAccountId> !== <storeItem.businessAccountId> then <checkImgUploadCredentials> middleware should block access and
 * return the appropiate response.
 * response options include:
 * 
 * SUCCESSFUL response should return:
 * {
 *   responseMsg: string;
 *   newStoreItemImage: IStoreItemImage;
 *   updatedStoreItem: IStoreItem;
 * }
 * UNSUCCCESSFUL response should return"
 * {
 *   responseMsg: string;
 *   error: 'Object' | Error;
 *   errorMessages: string[];
 * }
 * 
 */

describe("StoreItemImagesUplController - LOGGED IN - BUSINESS ACCOUNT SET UP - POST/DELETE API tests", () => {
  // admins, admin login tokens and admin business account ids //
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator;
  let firstAdminToken: string, secondAdminToken: string;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;
  // admin StoreItem models //
  let firstAdminsStoreItem: IStoreItem;
  let secondAdminsStoreItem: IStoreItem;
  // admin StoreItemImage models //
  let firstAdminsStoreItemImage: IStoreItemImage;
  let secondAdminsStoreItemImage: IStoreItemImage;
  // created and deleted images //
  let createdImage: IStoreItemImage;
  let deletedImage: IStoreItemImage;
  // aditonal variables //
  let storeItemImageModelCount: number;

  before((done) => {
    setupStoreItemImgControllerTests()
      .then(({ admins, busAccountIds, storeItems, storeItemImages }) => {
        ({ firstAdmin, secondAdmin } = admins);
        ({ firstAdminsStoreItem, secondAdminsStoreItem } = storeItems);
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = busAccountIds);
        [ firstAdminsStoreItemImage ] = storeItemImages.firstAdminsStoreItemImgs;
        [ secondAdminsStoreItemImage ] = storeItemImages.secondAdminsStoreItemImgs;

        return StoreItemImage.countDocuments().exec();
      })
      .then((number) => {
        storeItemImageModelCount = number;
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
  /*
  // CONTEXT POST/DELETE API tests with LOGIN and CORRECT business account //
  context("POST/DELETE  'StoreItemImgUplController' API tests - LOGGED IN - CORRECT BUSINESS ACCOUNT - CREATE_IMAGE, DELETE_IMAGE actions", () => {

    // TEST POST 'StoreItemImagesController' login and correct bus account CREATE_IMAGE  action //
    describe("POST '/api/uploads/store_item_images/:storeItemId' - LOGGED IN and CORRECT BUSINESS ACCOUNT - Multer Upload and CREATE_IMAGE action", () => {

      it("Should upload and create 'StoreItemImage model' send back apropriate response", (done) => {
        const testImgPath = path.join(path.resolve(), "app", "_tests_", "api", "test_images", "test.jpg");
        
        chai.request(server)
          .post("/api/uploads/store_item_images/" + (firstAdminsStoreItem._id as string))
          .set({ "Authorization": firstAdminToken })
          .attach("storeItemImage", fs.readFileSync(testImgPath), "test.jpg")
          .end((err, response) => {
            if (err) done(err);
            createdImage = response.body.newStoreItemImage;
            // assert correct response //
            expect(response.status).to.equal(200);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.newStoreItemImage).to.be.an("object");
            expect(response.body.updatedStoreItem).to.be.an("object");
            // 
            expect(response.body.error).to.be.undefined;
            expect(response.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly set all fields in new 'StoreItemImage' model", () => {
        expect(createdImage.businessAccountId).to.be.a("string");
        expect(createdImage.fileName).to.be.a("string");
        expect(createdImage.url).to.be.a("string");
        expect(createdImage.absolutePath).to.be.a("string");
        expect(createdImage.imagePath).to.be.a("string");
        expect(createdImage.createdAt).to.be.a("string");
      });
      it("Should correctly set the 'url' property on the 'StoreItemImage' model", (done) => {
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
      it("Should correctly set the 'absolutePath' property on the 'StoreItemImage' model", (done) => {
        fs.access(createdImage.absolutePath, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => {
          if (err) done (err);
          expect(err).to.be.null;
          done();
        }) 
      });
      it("Should place the image into the upload directory", (done) => {
        let imageDirectory = path.join(path.resolve(), "public", "uploads", "store_item_images", firstAdminBusAcctId, firstAdminsStoreItem._id.toString())
        fs.readdir(imageDirectory, (err, files) => {
          if(err) done(err);
          expect(err).to.equal(null);
          expect(files.length).to.equal(2);
          done();
        });
      });
      it("Should create a new 'StoreItemImage' model in the database", (done) => {
        StoreItemImage.exists({ _id: createdImage._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should INCREASE the number of 'StoreItemImage' models by 1", (done) => {
        StoreItemImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(storeItemImageModelCount + 1);
            storeItemImageModelCount = number;
            done();
          })
          .catch((err) => {
            done(err); 
          });
      });
      it("Should add the 'StoreItemImage' to the 'StoreItem' model 'images' subarray ", (done) => {
        StoreItem.findOne({ _id: firstAdminsStoreItem._id }).exec()
          .then((foundStoreItem) => {
            const imgId = foundStoreItem!.images.filter((imgId) => String(imgId) === String(createdImage._id));
            expect(imgId.length).to.equal(1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should INCREASE the number of images in the queried StoreItem model by 1", (done) => {
        StoreItem.findOne({ _id: firstAdminsStoreItem._id }).exec()
          .then((foundStoreItem) => {
            expect(foundStoreItem!.images.length).to.equal(firstAdminsStoreItem.images.length + 1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST POST 'StoreItemImagesController' no login CREATE_IMAGE  action //
    
    // TEST DELETE 'StoreItemImagesController' DELETE_IMAGE action wih login  and correct bus account //
    describe("DELETE '/api/uploads/store_item_images/:storeItemId/:storeItemImgId' - WITH LOGIN and BUSINESS_ACCOUNT -  DELETE_IMAGE action", () => {

      it("Should successfully remove the 'StoreItemImage' and respond with correct response", (done) => {
        const storeItemId = firstAdminsStoreItem._id as string;
        const storeItemImgId = createdImage._id as string;
        chai.request(server)
          .delete(`/api/uploads/store_item_images/${storeItemId}/${storeItemImgId}`)
          .set({ "Authorization": firstAdminToken })
          .end((err, response) => {
            if (err) done(err);
            deletedImage = response.body.deletedStoreItemImage;
            // assert correct reponse //
            expect(response.status).to.equal(200);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.deletedStoreItemImage).to.be.an("object");
            expect(response.body.updatedStoreItem).to.be.an("object");
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
      it("Should remove the 'StoreItemImage' model from the database", (done) => {
        StoreItemImage.exists({ _id: deletedImage._id })
          .then((exists) => {
            expect(exists).to.equal(false);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should DECREASE the number of 'StoreItemImage' model by 1", (done) => {
        StoreItemImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(storeItemImageModelCount - 1);
            storeItemImageModelCount = number;
            done();
          })
          .catch((err) => { 
            done(err); 
          });
      });
      it("Should remove the StoreItemImage id from the queried 'StoreItem' model", (done) => {
        StoreItem.findOne({ _id: firstAdminsStoreItem._id }).exec()
          .then((storeItem) => {
            const imgId = storeItem!.images.filter((imgId) => String(imgId) === String(deletedImage._id));
            expect(imgId.length).to.equal(0);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    
    });
    // END TEST DELETE 'StoreItemImagesController' DELETE_IMAGE action wihout login //
    
  });
  // END CONTEXT POST/DELETE API tests with LOGIN and CORRECT business account //
  */
  // CONTEXT POST/DELETE API tests with LOGIN but INCORRECT business account //
  context("POST/DELETE  'StoreItemImgUplController' API tests - LOGGED IN  - INCORRECT BUSINESS ACCOUNT - CREATE_IMAGE, DELETE_IMAGE actions", () => {

    // TEST POST 'StoreItemImagesController' login and incorrect bus account CREATE_IMAGE  action //
    describe("POST '/api/uploads/store_item_images/:storeItemId' - LOGGED IN but INCORRECT BUSINESS ACCOUNT - Multer Upload and CREATE_IMAGE action", () => {

      it("Should NOT upload and create 'StoreItemImage' model send back apropriate response", (done) => {
        const testImgPath = path.join(path.resolve(), "app", "_tests_", "api", "test_images", "test.jpg");
        
        chai.request(server)
          .post("/api/uploads/store_item_images/" + (firstAdminsStoreItem._id as string))
          .set({ "Authorization": secondAdminToken })
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
            //
            expect(response.body.newStoreItemImage).to.be.undefined;
            expect(response.body.updatedStoreItem).to.be.undefined;
            done();
          });
      });
      it("Should NOT place the image into the upload directory", (done) => {
        let imageDirectory = path.join(path.resolve(), "public", "uploads", "store_item_images", firstAdminBusAcctId, firstAdminsStoreItem._id.toString())
        fs.readdir(imageDirectory, (err, files) => {
          if(err) done(err);
          expect(err).to.equal(null);
          expect(files.length).to.equal(1);
          done();
        });
      });
      it("Should NOT alter the number of 'StoreItemImage' models in the database", (done) => {
        StoreItemImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(storeItemImageModelCount);
            done();
          })
          .catch((err) => {
            done(err); 
          });
      });
      it("Should NOT alter the number of images in the queried 'StoreItem' model", (done) => {
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
    // END TEST POST 'StoreItemImagesController' login and incorrect bus account CREATE_IMAGE  action //

    // TEST DELETE 'StoreItemImagesController' logged in and inccorrect bus account DELETE_IMAGE action //
    describe("DELETE '/api/uploads/store_item_images/:storeItemId/:storeItemImgId' - WITH LOGIN and BUSINESS_ACCOUNT -  DELETE_IMAGE action", () => {

      it("Should NOT remove the 'StoreItemImage' and respond with correct error response", (done) => {
        const storeItemId = firstAdminsStoreItem._id as string;
        const storeItemImgId = firstAdminsStoreItemImage._id as string;
        chai.request(server)
          .delete(`/api/uploads/store_item_images/${storeItemId}/${storeItemImgId}`)
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
            expect(response.body.newStoreItemImage).to.be.undefined;
            expect(response.body.updatedStoreItem).to.be.undefined;
            done();
          });
      });
      it("Should NOT delete the image from its directory", (done) => {
        const imagePath = firstAdminsStoreItemImage.absolutePath
        fs.access(imagePath, fs.constants.F_OK, (error) => {
          expect(error).to.be.null;
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
      it("Should NOT remove the StoreItemImage id from the queried 'StoreItem' model", (done) => {
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
    // END TEST DELETE 'StoreItemImagesController' logged in and incorrect bus account DELETE_IMAGE action //

  });
  // END CONTEXT POST/DELETE API tests with LOGIN but INCORRECT business account //
  
});