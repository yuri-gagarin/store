// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import { Types } from "mongoose";
import fs, { readdirSync } from "fs";
import path from "path";
// server import /
import server from "../../../server";
// models and model interfaces //
import { IAdministrator } from "../../../models/Administrator";
import StoreImage, { IStoreImage } from "../../../models/StoreImage";
import Store, { IStore } from "../../../models/Store";
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

describe("StoresController - NOT LOGGED IN or NO BUSINESS ACCOUNT - tests with 'StoreImage' models present - GET/POST/PATCH/DELETE  - API tests", () => {
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;
  let thirdAdmin: IAdministrator;
  let thirdAdminsToken: string;
  // service models //
  let firstAdminsStore: IStore;
  let firstAdminsStoresArr: IStore[], secondAdminsStoresArr: IStore[];
  //
  let totalStoreImages: number;
  let queriedStoreImagesTotal: number;
  // 
  let numberOfStoreImageDirectories: number = 0;    // <path>/public/uploads/service_images/<businessAccountId> //
  let numberOfStoreImageSubDirectories: number = 0; // <path>/public/uploads/service_images/<businessAccountId>/<serviceId> //
  let numberOfStoreImageFiles: number = 0;

  // database and model data setup //
  // logins and jwtTokens //
  before((done) => {
    setupStoreControllerTests()
      .then((response) => {
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = response.busAccountIds);
        ({ thirdAdmin } = response.admins );
        ({ firstAdminsStoresArr, secondAdminsStoresArr, firstAdminsStore } = response.stores);

        const serviceImgPromises: Promise<IStoreImage[]>[] = [];
        for (const service of firstAdminsStoresArr) {
          const createPromises = createStoreImages(5, service);
          serviceImgPromises.push(createPromises)
        }
        for (const service of secondAdminsStoresArr) {
          const createPromises = createStoreImages(5, service);
          serviceImgPromises.push(createPromises)
        }
        return Promise.all(serviceImgPromises);
      })
      .then((_) => {
        return loginAdmins(chai, server, [ thirdAdmin ]);
      })
      .then((adminsTokenArray) => {
        [ thirdAdminsToken ] = adminsTokenArray;
        return Promise.all([
          StoreImage.countDocuments().exec(),
          StoreImage.countDocuments({ storeId: firstAdminsStore._id }).exec()
        ]);
      })
      .then((countsArray) => {
        [ totalStoreImages, queriedStoreImagesTotal ] = countsArray;
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
  
  // TEST CONTEXT Admin is logged in 'StoresController' actions tests no business account //
  context("Admin NOT LOGGED IN GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {

    // TEST GET GET_MANY action not logged in //
    describe("GET '/api/stores' - NOT LOGGED IN - tests with 'StoreImages' - GET_MANY action", () => {
      it("Should NOT fetch 'Store' models and return a correct error response", (done) => {
        chai.request(server)
          .get("/api/stores")
          .set({ "Authorization": "" })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.stores).to.be.undefined;
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
    // END TEST GET GET_MANY not logged in //
    
    // TEST GET_ONE action not logged in //
    describe("GET '/api/stores/:storeId' - NOT LOGGED IN - tests with 'StoreImages' - GET_MANY action", () => {
    
      it("Should NOT fetch 'Store' models and return a correct error response", (done) => {
        chai.request(server)
          .get("/api/stores/" + (firstAdminsStore._id as Types.ObjectId))
          .set({ "Authorization": "" })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.store).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'StoreImage' models from the queried 'Store' model", (done) => {
        StoreImage.find({ storeId: firstAdminsStore._id }).exec()
          .then((storeImages) => {
            expect(storeImages.length).to.equal(queriedStoreImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
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
    // END TEST GET_ONE action not logged in //
    
    // TEST POST CREATE not ogged in  //
    describe("POST '/api/stores/create' - NOT LOGGED IN - tests with 'StoreImages' - CREATE action", () => {

      it("Should NOT create a 'Store' model and return a correct error response", (done) => {
        const mockStore = generateMockStoreData(1);
        chai.request(server)
          .post("/api/stores/create")
          .set({ "Authorization": "" })
          .send( ...mockStore )
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.newStore).to.be.undefined;
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
    // END TEST POST CREATE action not logged in //
    
    // TEST PATCH EDIT  action not logged in //
    describe("PATCH '/api/stores/update/:storeId' - NOT LOGGED IN - tests with 'StoreImages' - EDIT action", () => {

      it("Should NOT update 'Store' model and return a correct response", (done) => {
        const mockStore = generateMockStoreData(1);
        chai.request(server)
          .patch("/api/stores/update/" + (firstAdminsStore._id as Types.ObjectId))
          .set({ "Authorization": "" })
          .send(...mockStore)
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.editedStore).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'StoreImage' models from the queried 'Store' model", (done) => {
        StoreImage.find({ storeId: firstAdminsStore._id }).exec()
          .then((storeImages) => {
            expect(storeImages.length).to.equal(queriedStoreImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
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
    // END TEST PATCH EDIT action not logged in //
    
    // TEST DELETE DELETE action not logged in //
    describe("DELETE '/api/stores/delete/:storeId' - LOGGED IN no ACCOUNT - tests with 'StoreImages' - DELETE action", () => {
    
      it("Should NOT delete the 'Store' model and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/stores/delete/" + String(firstAdminsStore._id))
          .set({ "Authorization": "" })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.deletedStore).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'StoreImage' models from the queried 'Store' model", (done) => {
        StoreImage.find({ storeId: firstAdminsStore._id }).exec()
          .then((storeImages) => {
            expect(storeImages.length).to.equal(queriedStoreImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
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
    // END TEST DELETE DELETE action correct BusinessAccount //
    
  });
  // END TEST CONTEXT Admin is logged in no account 'StoresController' actions tests //
  
  // TEST CONTEXT Admin is logged in 'StoresController' actions tests no business account //
  context("Admin LOGGED IN no BUSINESS ACCOUNT, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {

    // TEST GET GET_MANY action  logged in no account //
    describe("GET '/api/stores' - LOGGED IN no ACCOUNT' - tests with 'StoreImages' - GET_MANY action", () => {
      it("Should NOT fetch 'Store' models and return a correct error response", (done) => {
        chai.request(server)
          .get("/api/stores")
          .set({ "Authorization": thirdAdminsToken })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.stores).to.be.undefined;
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
    // END TEST GET GET_MANY logged in no account //

    // TEST GET_ONE action logged in no account //
    describe("GET '/api/stores/:storeId' - LOGGED IN no ACCOUNT - tests with 'StoreImages' - GET_MANY action", () => {
    
      it("Should NOT fetch 'Store' models and return a correct error response", (done) => {
        chai.request(server)
          .get("/api/stores/" + (firstAdminsStore._id as Types.ObjectId))
          .set({ "Authorization": thirdAdminsToken })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.store).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'StoreImage' models from the queried 'Store' model", (done) => {
        StoreImage.find({ storeId: firstAdminsStore._id }).exec()
          .then((storeImages) => {
            expect(storeImages.length).to.equal(queriedStoreImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
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
    // END TEST GET_ONE action logged in no account //

    // TEST POST CREATE logged in no account //
    describe("POST '/api/stores/create' - LOGGED IN no ACCOUNT - tests with 'StoreImages' - CREATE action", () => {

      it("Should NOT create a 'Store' model and return a correct error response", (done) => {
        const mockStore = generateMockStoreData(1);
        chai.request(server)
          .post("/api/stores/create")
          .set({ "Authorization": thirdAdminsToken })
          .send( ...mockStore )
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.newStore).to.be.undefined;
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
    // END TEST POST CREATE action logged in no account //

    // TEST PATCH EDIT  action logged in no account //
    describe("PATCH '/api/stores/update/:storeId' - LOGGED IN no ACCOUNT - tests with 'StoreImages' - EDIT action", () => {

      it("Should NOT update 'Store' model and return a correct response", (done) => {
        const mockStore = generateMockStoreData(1);
        chai.request(server)
          .patch("/api/stores/update/" + (firstAdminsStore._id as Types.ObjectId))
          .set({ "Authorization": thirdAdminsToken })
          .send(...mockStore)
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.editedStore).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'StoreImage' models from the queried 'Store' model", (done) => {
        StoreImage.find({ storeId: firstAdminsStore._id }).exec()
          .then((storeImages) => {
            expect(storeImages.length).to.equal(queriedStoreImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
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
    // END TEST PATCH EDIT action logged in no account //

    // TEST DELETE DELETE action logged in no account //
    describe("DELETE '/api/stores/delete/:storeId' - LOGGED IN no ACCOUNT - tests with 'StoreImages' - DELETE action", () => {
    
      it("Should NOT delete the 'Store' model and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/stores/delete/" + String(firstAdminsStore._id))
          .set({ "Authorization": thirdAdminsToken })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.deletedStore).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'StoreImage' models from the queried 'Store' model", (done) => {
        StoreImage.find({ storeId: firstAdminsStore._id }).exec()
          .then((storeImages) => {
            expect(storeImages.length).to.equal(queriedStoreImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
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
    // END TEST DELETE DELETE action correct BusinessAccount //
    
  });
  // END TEST CONTEXT Admin is logged in no account 'StoresController' actions tests //
  
});