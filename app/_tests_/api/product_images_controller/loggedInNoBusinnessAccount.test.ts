import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// node dependencies //
import fs from "fs";
import path from "path";
// server import //
import server from "../../../server";
// models and model interfaces //
import Product, { IProduct } from "../../../models/Product";
import ProductImage, { IProductImage } from "../../../models/ProductImage";
// setup helpers //
import { setupProductImgControllerTests, cleanUpProductImgControllerTests } from "./helpers/setupProdImgControllerTest";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";
// helpers //
import { isEmptyObj } from "../../../controllers/helpers/queryHelpers";
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

describe("ProductImagesUplController - LOGGED IN - NO BUSINESS ACCOUNT SET UP - POST/DELETE API tests", () => {
  let thirdAdmin: IAdministrator;
  let thirdAdminToken: string;
  let firstAdminsProduct: IProduct;
  let firstAdminsProductImage: IProductImage;
  let productImageModelCount: number;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;

  before((done) => {
    setupProductImgControllerTests()
      .then(({ admins, busAccountIds, products, productImages }) => {
        ({ thirdAdmin } = admins);
        ({ firstAdminsProduct } = products);
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = busAccountIds);
        [ firstAdminsProductImage ] = productImages.firstAdminsProductImgs;

        return ProductImage.countDocuments().exec();
      })
      .then((number) => {
        productImageModelCount = number;
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
    cleanUpProductImgControllerTests(firstAdminBusAcctId, secondAdminBusAcctId)
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
  
  context("POST/DELETE  'ProductImgUplController' API tests - LOGGED IN - NO BUSINESS ACCOUNT - CREATE_IMAGE, DELETE_IMAGE actions", () => {
    // TEST POST 'ProductImagesController' with login no business acount CREATE_IMAGE  action //
    describe("POST '/api/uploads/product_images/:productId' - WITH LOGIN - NO BUSINESS ACCOUNT - Multer Upload and CREATE_IMAGE action", () => {

      it("Should NOT upload and create a 'ProductImage' model, send back correct response", (done) => {
        const testImgPath = path.join(path.resolve(), "app", "_tests_", "api", "test_images", "test.jpg");
        
        chai.request(server)
          .post("/api/uploads/product_images/" + firstAdminsProduct._id)
          .set({ "Authorization": thirdAdminToken })
          .attach("productImage", fs.readFileSync(testImgPath), "test.jpg")
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            expect(response.body.newProductImage).to.be.undefined;
            expect(response.body.updatedProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT place the queried image into the upload directory", (done) => {
        let imageDirectory = path.join(path.resolve(), "public", "uploads", "product_images", firstAdminBusAcctId, firstAdminsProduct._id.toString())
        fs.readdir(imageDirectory, (err, files) => {
          if(err) done(err);
          expect(err).to.equal(null);
          expect(files.length).to.equal(1);
          done();
        });
      });
      it("Should NOT INCREASE the number of 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(productImageModelCount);
            done();
          })
          .catch((err) => {
            done(err); 
          });
      });
      it("Should NOT INCREASE the number of images in the queried 'Product' model", (done) => {
        Product.findOne({ _id: firstAdminsProduct._id }).exec()
          .then((foundProduct) => {
            expect(foundProduct!.images.length).to.equal(firstAdminsProduct.images.length);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST POST 'ProductImagesController' with login no bus account CREATE_IMAGE  action //
    
    // TEST DELETE 'ProductImagesController' DELETE_IMAGE action with login no bus account //
    describe("DELETE '/api/uploads/product_images/:productImgId/:productId' - WITH LOGIN - NO BUSINESS ACCOUNT -  DELETE_IMAGE action", () => {

      it("Should NOT delete an image from files and send back a correct response", (done) => {
        chai.request(server)
          .delete("/api/uploads/product_images/" + (firstAdminsProductImage._id as string) + "/" + (firstAdminsProduct._id as string))
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
            expect(response.body.newProductImage).to.be.undefined;
            expect(response.body.updatedProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT delete the image from its directory", (done) => {
        const imagePath = firstAdminsProductImage.absolutePath
        fs.access(imagePath, fs.constants.F_OK, (err) => {
          expect(err).to.be.null;
          done();
        });
      });
      it("Should NOT remove the 'ProductImage' model from the database", (done) => {
        ProductImage.exists({ _id: firstAdminsProductImage._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT DECREASE the number of 'ProductImage' model by 1", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(productImageModelCount);
            done();
          })
          .catch((err) => { 
            done(err); 
          });
      });
      it("Should NOT remove the 'ProductImage' id from the queried 'Product' model", (done) => {
        Product.findOne({ _id: firstAdminsProduct._id }).exec()
          .then((product) => {
            const imgId = product!.images.filter((imgId) => String(imgId) === String(firstAdminsProductImage._id));
            expect(imgId.length).to.equal(1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST DELETE 'ProductImagesController' DELETE_IMAGE action with login and no business account //
  });
  // END CONTEXT //
});