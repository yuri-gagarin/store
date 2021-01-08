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
import { IAdministrator } from "../../../models/Administrator";
import StoreImage, { IStoreImage } from "../../../models/StoreImage";
import Store, { IStore } from "../../../models/Store";
// additional type definitions //
import { StoreData } from "../../../controllers/stores_controller/type_declarations/storesControllerTypes";
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { generateMockStoreData } from "../../helpers/data_generation/storesDataGeneration"; 
import { setupStoreControllerTests } from "./_helpers/storeContTestHelpers";
import { cleanUpStoreImgControllerTests } from "../store_images_controller/helpers/setupStoreImageControllerTest";
import { createStoreImages } from "../../helpers/data_generation/storeImageDataGeneration";
import { getImageUploadData } from "../../helpers/testHelpers";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";

chai.use(chaiHTTP);

/**
 * This test suite tests mostly the effect of 'StoreController' methods on linked 'StoreImage' models,
 * making sure actions are correctly populating and removing images when appropriate
 * For detailed 'StoreController' action tests, another test suite handles other detailed test cases regarding the 'Store' model.
 */

describe("StoresController - LOGGED IN -  WITH  BusinessAccount ID - tests with 'StoreImage' models present - GET/POST/PATCH/DELETE  - API tests", () => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;
  // store models //
  let store: IStore;
  let fetchedStores: IStore[];
  let createdStore: IStore;
  let firstAdminsStore: IStore, secondAdminsStore: IStore;
  let firstAdminsStoresArr: IStore[], secondAdminsStoresArr: IStore[];
  let firstAdminsStoreImages: IStoreImage[];
  //
  let firstToken: string, secondToken: string;
  let firstAdminsStoreImgTotal: number;
  let totalStoreImages: number;
  let totalStores: number;
  // mockData //
  // 
  let numberOfStoreImageDirectories: number = 0;    // <path>/public/uploads/store_images/<businessAccountId> //
  let numberOfStoreImageSubDirectories: number = 0; // <path>/public/uploads/store_images/<businessAccountId>/<storeId> //
  let numberOfStoreImageFiles: number = 0;

  // database and model data setup //
  // logins and jwtTokens //
  before((done) => {
    setupStoreControllerTests()
      .then((response) => {
        ({ firstAdmin, secondAdmin } = response.admins);
        ({ firstAdminsStore, secondAdminsStore, firstAdminsStoresArr, secondAdminsStoresArr } = response.stores);
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = response.busAccountIds);
        return loginAdmins(chai, server, [ firstAdmin, secondAdmin ]);
      })
      .then((tokensArr) => {
        ([ firstToken, secondToken ] = tokensArr);
        const storeImgPromises: Promise<IStoreImage[]>[] = [];
        for (const store of firstAdminsStoresArr) {
          const createPromises = createStoreImages(5, store);
          storeImgPromises.push(createPromises)
        }
        for (const store of secondAdminsStoresArr) {
          const createPromises = createStoreImages(5, store);
          storeImgPromises.push(createPromises)
        }
        return Promise.all(storeImgPromises);
      })
      .then((_) => {
        return StoreImage.find({ businessAccountId: firstAdminBusAcctId }).exec()
      })
      .then((storeImages) => {
        firstAdminsStoreImages = storeImages;
        return Promise.all([
          Store.countDocuments().exec(),
          StoreImage.countDocuments().exec(),
          StoreImage.countDocuments({ storeId: firstAdminsStore._id }).exec()
        ]);
      })
      .then((countsArray) => {
        [ totalStores, totalStoreImages, firstAdminsStoreImgTotal ] = countsArray;
        try {
          const data = getImageUploadData("store_images");
          numberOfStoreImageDirectories = data.totalImageDirectories;
          numberOfStoreImageSubDirectories = data.totalImageSubdirectories;
          numberOfStoreImageFiles = data.totalImageFiles;
          done();
        } catch (error) {
          done(error);
        }
      })
      .catch((err) => {
        done(err);
      });
  });
  
  after((done) => {
    Promise.all([
      clearDB(),
      cleanUpStoreImgControllerTests(firstAdminBusAcctId, secondAdminBusAcctId)
    ])
    .then(() => {
      done();
    })
    .catch((error) => {
      done(error);
    });
  });

  // CONTEXT admin logged in but incorrect business account //
  context("Admin WITH an  INCORRECT 'BusinessAccount' set up, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {

    // TEST GET_ONE action with correct BusinessAccount //
    describe("GET '/api/stores/:storeId' - INCORRECT 'BusinessAccount' tests with 'StoreImages' - GET_ONE action", () => {
    
      it("Should NOT fetch 'Store' model and return a correct error response", (done) => {
        chai.request(server)
          .get("/api/stores/" + (firstAdminsStore._id as Types.ObjectId))
          .set({ "Authorization": secondToken })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.store).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything within 'StoreImage' models in the database", (done) => {
        StoreImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStoreImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'StoreImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("store_images");
          expect(totalImageDirectories).to.equal(numberOfStoreImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfStoreImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfStoreImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST GET_ONE action with a correct BusinessAccount //

    // TEST PATCH EDIT  action with a correct BusinessAccount //
    describe("PATCH '/api/stores/update/:storeId' - INCORRECT 'BusinessAccount' tests with 'StoreImages' - UPDATE action", () => {

      it("Should NOT update 'Store' model and return a correct error response", (done) => {
        const mockStore = generateMockStoreData(1);
        chai.request(server)
          .patch("/api/stores/update/" + (firstAdminsStore._id as Types.ObjectId))
          .set({ "Authorization": secondToken })
          .send(...mockStore)
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.editedStore).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything within 'StoreImage' models in the database", (done) => {
        StoreImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStoreImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'StoreImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("store_images");
          expect(totalImageDirectories).to.equal(numberOfStoreImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfStoreImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfStoreImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST PATCH EDIT action with a corect BusinessAccount //

    // TEST DELETE DELETE action correct BusinessAccount //
    describe("DELETE '/api/stores/delete/:storeId' - CORRECT 'BusinessAccount' tests with 'StoreImages' - DELETE action", () => {
    
      it("Should deleted the 'Store' model and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/stores/delete/" + String(firstAdminsStore._id))
          .set({ "Authorization": secondToken })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.deletedStore).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove correct 'StoreImage' models in the database", (done) => {
        StoreImage.find({ storeId: firstAdminsStore._id }).exec()
          .then((stores) => {
            expect(stores.length).to.equal(firstAdminsStoreImgTotal);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT decrement the 'StoreImage' models in the database by a correct number", (done) => {
        StoreImage.countDocuments().exec() 
          .then((count) => {
            expect(count).to.equal(totalStoreImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT remove any StoreImages from upload directories and leave the upload files untouched", () => {
       
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("store_images");
          expect(totalImageDirectories).to.equal(numberOfStoreImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfStoreImageSubDirectories );
          expect(totalImageFiles).to.equal(numberOfStoreImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST DELETE DELETE action correct BusinessAccount //
    
  });
  // END CONTEXT tests with a correct business accound id //

  // TEST CONTEXT admin logged in and correct business account //
  context("Admin WITH a CORRECT 'BusinessAccount' set up, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {

    // TEST GET GET_MANY action correct BusinessAccount //
    describe("GET '/api/stores' - CORRECT 'BusinessAccount' tests with 'StoreImages' - GET_MANY action", () => {
      it("Should fetch 'Store' models and return a correct response", (done) => {
        chai.request(server)
          .get("/api/stores")
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            fetchedStores = res.body.stores;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.stores).to.be.an("array");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly populate the 'Store' models if linked 'StoreImage' models are present", () =>{
        for (const store of fetchedStores) {
          if (store.images.length > 0) {
            for (const storeImage of store.images) {
              const linkedImage = storeImage as IStoreImage;
              expect(linkedImage.businessAccountId).to.be.an("string");
              expect(linkedImage.storeId).to.be.an("string");
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
      it("Should NOT alter anything within 'StoreImage' models in the database", (done) => {
        StoreImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStoreImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'StoreImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("store_images");
          expect(totalImageDirectories).to.equal(numberOfStoreImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfStoreImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfStoreImageFiles);
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST GET GET_MANY action correct BusinessAccount //

    // TEST GET_ONE action with correct BusinessAccount //
    describe("GET '/api/stores/:storeId' - CORRECT 'BusinessAccount' tests with 'StoreImages' - GET_MANY action", () => {
    
      it("Should fetch 'Store' models and return a correct response", (done) => {
        chai.request(server)
          .get("/api/stores/" + (firstAdminsStore._id as Types.ObjectId))
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            store = res.body.store;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.store).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly populate the 'Store' model's <images> subarray with the 'StoreImage' models", () =>{
        for (const storeImage of store.images as IStoreImage[]) {
          expect(storeImage.businessAccountId).to.be.an("string");
          expect(storeImage.storeId).to.be.an("string");
          expect(storeImage.imagePath).to.be.a("string");
          expect(storeImage.absolutePath).to.be.a("string");
          expect(storeImage.url).to.be.a("string");
          expect(storeImage.fileName).to.be.a("string");
          expect(storeImage.createdAt).to.be.an("string");
          expect(storeImage.editedAt).to.be.an("string");
        }
      });
      it("Should NOT alter anything within 'StoreImage' models in the database", (done) => {
        StoreImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStoreImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'StoreImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("store_images");
          expect(totalImageDirectories).to.equal(numberOfStoreImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfStoreImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfStoreImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST GET_ONE action with a correct BusinessAccount //

    // TEST POST CREATE action with a correct BusinessAccount //
    describe("POST '/api/stores/create' - CORRECT 'BusinessAccount' tests with 'StoreImages' - CREATE action", () => {

      it("Should create a 'Store' model and return a correct response", (done) => {
        const mockStore = generateMockStoreData(1);
        chai.request(server)
          .post("/api/stores/create")
          .set({ "Authorization": firstToken })
          .send( ...mockStore )
          .end((err, res) => {
            if (err) done(err);
            createdStore = res.body.newStore;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.newStore).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything within 'StoreImage' models in the database", (done) => {
        StoreImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStoreImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'StoreImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("store_images");
          expect(totalImageDirectories).to.equal(numberOfStoreImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfStoreImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfStoreImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST POST CREATE action with a corect BusinessAccount //

    // TEST PATCH EDIT  action with a correct BusinessAccount //
    describe("PATCH '/api/stores/update/:storeId' - CORRECT 'BusinessAccount' tests with 'StoreImages' - PATCH action", () => {

      it("Should update 'Store' model and return a correct response", (done) => {
        const mockStore = generateMockStoreData(1);
        chai.request(server)
          .patch("/api/stores/update/" + (firstAdminsStore._id as Types.ObjectId))
          .set({ "Authorization": firstToken })
          .send(...mockStore)
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.editedStore).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything within 'StoreImage' models in the database", (done) => {
        StoreImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalStoreImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'StoreImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("store_images");
          expect(totalImageDirectories).to.equal(numberOfStoreImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfStoreImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfStoreImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST PATCH EDIT action with a corect BusinessAccount //

    // TEST DELETE DELETE action correct BusinessAccount //
    describe("DELETE '/api/stores/delete/:storeId' - CORRECT 'BusinessAccount' tests with 'StoreImages' - DELETE action", () => {
    
      it("Should deleted the 'Store' model and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/stores/delete/" + String(firstAdminsStore._id))
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.deletedStore).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should remove correct 'StoreImage' models in the database", (done) => {
        StoreImage.find({ storeId: firstAdminsStore._id }).exec()
          .then((stores) => {
            expect(stores.length).to.equal(0);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should decrement the 'StoreImage' models in the database by a correct number", (done) => {
        StoreImage.countDocuments().exec() 
          .then((count) => {
            expect(count).to.equal(totalStoreImages - firstAdminsStoreImgTotal);
            totalStoreImages -= firstAdminsStoreImgTotal;
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should remove the 'StoreImage' directories for the queried 'StoreItem'", () => {
        const storeImgDirectory = firstAdminsStoreImages[0].imagePath;
        try {
          fs.accessSync(storeImgDirectory);
        } catch(error) {
          expect(error.code).to.equal("ENOENT");
        }
      });
      it("Should correctly handle image file removal, remove appropriate files and directories only", () => {
        // store images are uploaded to <path>/public/uploads/store_images/<businessAccounId>/<storeId> //
        // a removed store should remove its linked uploaded images in <path>/public/uploads/store_images/<businessAccounId>/<storeId> directory //
        // it should also remove the <storeId> directory but leave all other directories untouched //
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("store_images");
          expect(totalImageDirectories).to.equal(numberOfStoreImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfStoreImageSubDirectories - 1);
          expect(totalImageFiles).to.equal(numberOfStoreImageFiles - firstAdminsStoreImgTotal);
          numberOfStoreImageDirectories = totalImageDirectories;
          numberOfStoreImageSubDirectories = totalImageSubdirectories;
          numberOfStoreImageFiles = totalImageFiles;
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST DELETE DELETE action correct BusinessAccount //
    
  });
  // END CONTEXT tests with a correct business accound id //

  
});