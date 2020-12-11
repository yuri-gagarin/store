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
import { setupProductImgControllerTests,cleanUpProductImgControllerTests } from "./helpers/setupProdImgControllerTest";
// helpers //
import { isEmptyObj } from "../../../controllers/helpers/queryHelpers";
import { clearDB } from "../../helpers/dbHelpers";
import { IAdministrator } from "../../../models/Administrator";

chai.use(chaiHTTP);

/**
 * 
 */


describe("ProductImagesUplController - NOT LOGGED IN - POST/DELETE API tests", () => {
  let firstAdmin: IAdministrator;
  let firstAdminsProduct: IProduct;
  let firstAdminsProductImage: IProductImage;
  let productImageModelCount: number;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;

  before((done) => {
    setupProductImgControllerTests()
      .then(({ admins, busAccountIds, products, productImages }) => {
        ({ firstAdmin } = admins);
        ({ firstAdminsProduct } = products);
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = busAccountIds);
        [ firstAdminsProductImage ] = productImages.firstAdminsProductImgs;
        return ProductImage.countDocuments().exec();
      })
      .then((number) => {
        productImageModelCount = number;
        done();
      })
      .catch((err) => {
        done(err);
      })
  });

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
  
  context("POST/DELETE  'ProductImgUplController' API tests - NOT LOGGED IN - CREATE_IMAGE, DELETE_IMAGE actions", () => {
    // TEST POST 'ProductImagesController' no login CREATE_IMAGE  action //
    describe("POST '/api/product_images/upload' - NO LOGIN - Multer Upload and CREATE_IMAGE action", () => {

      it("Should NOT upload and create a 'ProductImage' model", (done) => {
        const testImgPath = path.join(path.resolve(), "app", "_tests_", "api", "test_images", "test.jpg");
        
        chai.request(server)
          .post("/api/uploads/product_images/" + firstAdminsProduct._id)
          .set({ "Authorization": "" })
          .attach("productImage", fs.readFileSync(testImgPath), "test.jpg")
          .end((err, response) => {
            if (err) { console.error(err); done(err); }
            expect(response.status).to.equal(401);
            expect(response.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(response.body)).to.equal(true);
            done();
          });
      });
      
      it("Should NOT place the image into the upload directory", (done) => {
        let imageDirectory = path.join(path.resolve(), "public", "uploads", "product_images", firstAdminBusAcctId, firstAdminsProduct._id.toString())
        fs.readdir(imageDirectory, (err, files) => {
          if(err) done(err);
          expect(err).to.equal(null);
          expect(files.length).to.equal(1);
          done();
        });
      });
      it("Should NOT INCREASE the number of 'ProductImage' models by 1", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(productImageModelCount);
            done();
          })
          .catch((err) => {
            done(err); 
          });
      });
      it("Should NOT INCREASE the number of images in the queried Product model", (done) => {
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
    // END TEST POST 'ProductImagesController' no login CREATE_IMAGE  action //

    // TEST DELETE 'ProductImagesController' DELETE_IMAGE action wihout login //
    describe("DELETE '/api/product_images/upload' - NO LOGIN -  DELETE_IMAGE action", () => {

      it("Should NOT remove an image and destroy the ProductImage model, send back correct response", (done) => {
        chai.request(server)
          .delete("/api/uploads/product_images/" + (firstAdminsProductImage._id) + "/" + firstAdminsProduct._id)
          .end((err, response) => {
            if (err) done(err);
            // assert correct reponse //
            expect(response.status).to.equal(401);
            expect(isEmptyObj(response.body)).to.equal(true);
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
      it("Should NOT remove the ProductImage id from the queried 'Product' model", (done) => {
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
    // END TEST DELETE 'ProductImagesController' DELETE_IMAGE action wihout login //
  });
  // END CONTEXT //

});