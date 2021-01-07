// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import { Types } from "mongoose";
import fs, { readdirSync } from "fs";
import path from "path";
// server import /
import server from "../../../server";
// models and model interfaces //
import ProductImage, { IProductImage } from "../../../models/ProductImage";
import Product, { IProduct } from "../../../models/Product";
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { generateMockProductData } from "../../helpers/data_generation/productsDataGeneration"; 
import { loginAdmins, setupProdControllerTests } from "./helpers/setupProdControllerTest";
import { cleanUpProductImgControllerTests } from "../product_images_controller/helpers/setupProdImgControllerTest";
import { createProductImages } from "../../helpers/data_generation/productImageDataGeneration";
import { IAdministrator } from "../../../models/Administrator";

chai.use(chaiHTTP);

type ImageDirectoryDetails = {
  imageModel: string;
  imageDirectories: string[];
  imageSubDirectories: string[];
  imageFiles: string[];
  totalImageDirectories: number;
  totalImageSubdirectories: number;
  totalImageFiles: number;
}
const getImageUploadData = (...paths: string []): ImageDirectoryDetails => {
  const firstString = paths[0].split("_")[0]; 
  const modelName = firstString[0].toUpperCase() + firstString.substr(1) + "Image";
  //
  const imageUplPath = path.join(path.resolve(), "public", "uploads", ...paths);
  const imageUplSubdirectories: string[] = [];
  const imageFiles: string[] = [];

  try {
    const imageUplDirectories = fs.readdirSync(imageUplPath).map((dir) => {
      return path.join(imageUplPath, dir);
    });

    for (const imgUplDirectory of imageUplDirectories) {
      const subdirectories = fs.readdirSync(imgUplDirectory).map((subdir) => {
        return path.join(imgUplDirectory, subdir);
      })
      imageUplSubdirectories.push(...subdirectories);
    }

    for (const imgUplSubdirectory of imageUplSubdirectories) {
      const files = readdirSync(imgUplSubdirectory);
      imageFiles.push(...files);
    }

    return {
      imageModel: modelName,
      imageDirectories: imageUplDirectories,
      imageSubDirectories: imageUplSubdirectories,
      imageFiles: imageFiles,
      totalImageDirectories: imageUplDirectories.length,
      totalImageSubdirectories: imageUplSubdirectories.length,
      totalImageFiles: imageFiles.length
    };
  } catch (error) {
    throw error;
  }
  
};
/**
 * This test suite tests mostly the effect of 'ProductController' methods on linked 'ProductImage' models,
 * making sure actions are correctly populating and removing images when appropriate
 * For detailed 'ProductController' action tests, another test suite handles other detailed test cases regarding the 'Product' model.
 */

describe("ProductsController - NOT LOGGED IN or NO BUSINESS ACCOUNT - tests with 'ProductImage' models present - GET/POST/PATCH/DELETE  - API tests", () => {
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;
  let thirdAdmin: IAdministrator;
  let thirdAdminsToken: string;
  // product models //
  let firstAdminsProduct: IProduct;
  let firstAdminsProductsArr: IProduct[], secondAdminsProductsArr: IProduct[];
  //
  let totalProductImages: number;
  let queriedProductImagesTotal: number;
  // 
  let numberOfProductImageDirectories: number = 0;    // <path>/public/uploads/product_images/<businessAccountId> //
  let numberOfProductImageSubDirectories: number = 0; // <path>/public/uploads/product_images/<businessAccountId>/<productId> //
  let numberOfProductImageFiles: number = 0;

  // database and model data setup //
  // logins and jwtTokens //
  before((done) => {
    setupProdControllerTests()
      .then((response) => {
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = response.busAccountIds);
        ({ thirdAdmin } = response.admins );
        ({ firstAdminsProductsArr, secondAdminsProductsArr, firstAdminsProduct } = response.products);
        const productImgPromises: Promise<IProductImage[]>[] = [];
        for (const product of firstAdminsProductsArr) {
          const createPromises = createProductImages(5, product);
          productImgPromises.push(createPromises)
        }
        for (const product of secondAdminsProductsArr) {
          const createPromises = createProductImages(5, product);
          productImgPromises.push(createPromises)
        }
        return Promise.all(productImgPromises);
      })
      .then((_) => {
        return loginAdmins(chai, server, [ thirdAdmin ]);
      })
      .then((adminsTokenArray) => {
        [ thirdAdminsToken ] = adminsTokenArray;
        return Promise.all([
          ProductImage.countDocuments().exec(),
          ProductImage.countDocuments({ productId: firstAdminsProduct._id }).exec()
        ]);
      })
      .then((countsArray) => {
        [ totalProductImages, queriedProductImagesTotal ] = countsArray;
        try {
          const data = getImageUploadData("product_images");
          numberOfProductImageDirectories = data.totalImageDirectories;
          numberOfProductImageSubDirectories = data.totalImageSubdirectories;
          numberOfProductImageFiles = data.totalImageFiles;
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
      cleanUpProductImgControllerTests(firstAdminBusAcctId, secondAdminBusAcctId)
    ])
    .then(() => {
      done();
    })
    .catch((error) => {
      done(error);
    });
  });
  // TEST CONTEXT Admin is not logged in 'ProductsController' actions tests //
  context("Admin NOT LOGGED IN, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {

    // TEST GET GET_MANY action  not logged in //
    describe("GET '/api/products' - NOT LOGGED IN' tests with 'ProductImages' - GET_MANY action", () => {
      it("Should NOT fetch 'Product' models and return a correct error response", (done) => {
        chai.request(server)
          .get("/api/products")
          .set({ "Authorization": "" })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(401);
            // expect(res.body.responseMsg).be.a("string");
            // expect(res.body.error).to.be.an("object");
            // expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.products).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything within 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProductImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ProductImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("product_images");
          expect(totalImageDirectories).to.equal(numberOfProductImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfProductImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfProductImageFiles);
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST GET GET_MANY action not logged in //

    // TEST GET_ONE action not logged in //
    describe("GET '/api/products/:productId' - NOT LOGGED IN - tests with 'ProductImages' - GET_MANY action", () => {
    
      it("Should NOT fetch 'Product' models and return a correct error response", (done) => {
        chai.request(server)
          .get("/api/products/" + (firstAdminsProduct._id as Types.ObjectId))
          .set({ "Authorization": "" })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(401);
            // expect(res.body.responseMsg).be.a("string");
            // expect(res.body.error).to.be.an("object");
            // expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.product).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'ProductImage' models from the queried 'Product' model", (done) => {
        ProductImage.find({ productId: firstAdminsProduct._id }).exec()
          .then((products) => {
            expect(products.length).to.equal(queriedProductImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter anything within 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProductImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ProductImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("product_images");
          expect(totalImageDirectories).to.equal(numberOfProductImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfProductImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfProductImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST GET_ONE action not logged in //

    // TEST POST CREATE not logged in //
    describe("POST '/api/products/create' - NOT LOGGED IN - tests with 'ProductImages' - CREATE action", () => {

      it("Should NOT create a 'Product' model and return a correct error response", (done) => {
        const mockProduct = generateMockProductData(1);
        chai.request(server)
          .post("/api/products/create")
          .set({ "Authorization": "" })
          .send( ...mockProduct )
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(401);
            // expect(res.body.responseMsg).be.a("string");
            // expect(res.body.error).to.be.an("object");
            // expect(res.body.errorMessages).to.be.an("object");
            expect(res.body.newProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything within 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProductImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ProductImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("product_images");
          expect(totalImageDirectories).to.equal(numberOfProductImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfProductImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfProductImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST POST CREATE action not logged in //

    // TEST PATCH EDIT  action not logged in //
    describe("PATCH '/api/products/update/:productId' - NOT LOGGED IN - tests with 'ProductImages' - EDIT action", () => {

      it("Should NOT update 'Product' model and return a correct response", (done) => {
        const mockProduct = generateMockProductData(1);
        chai.request(server)
          .patch("/api/products/update/" + (firstAdminsProduct._id as Types.ObjectId))
          .set({ "Authorization": "" })
          .send(...mockProduct)
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(401);
            // expect(res.body.responseMsg).be.a("string");
            // expect(res.body.error).to.be.an("object");
            // expect(res.body.errorMessages).to.be.an("object");
            expect(res.body.editedProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'ProductImage' models from the queried 'Product' model", (done) => {
        ProductImage.find({ productId: firstAdminsProduct._id }).exec()
          .then((products) => {
            expect(products.length).to.equal(queriedProductImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter anything within 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProductImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ProductImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("product_images");
          expect(totalImageDirectories).to.equal(numberOfProductImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfProductImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfProductImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST PATCH EDIT action not logged in //

    // TEST DELETE DELETE action not logged in //
    describe("DELETE '/api/products/delete/:productId' - NOT LOGGED IN - tests with 'ProductImages' - DELETE action", () => {
    
      it("Should NOT delete the 'Product' model and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/products/delete/" + String(firstAdminsProduct._id))
          .set({ "Authorization": "" })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(401);
            // expect(res.body.responseMsg).be.a("string");
            // expect(res.body.error).to.be.an("object");
            // expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.deletedProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'ProductImage' models from the queried 'Product' model", (done) => {
        ProductImage.find({ productId: firstAdminsProduct._id }).exec()
          .then((products) => {
            expect(products.length).to.equal(queriedProductImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter anything within 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProductImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ProductImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("product_images");
          expect(totalImageDirectories).to.equal(numberOfProductImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfProductImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfProductImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST DELETE DELETE action correct BusinessAccount //
    
  });
  // END TEST CONTEXT Admin is not logged in 'ProductsController' actions tests //
  
  // TEST CONTEXT Admin is logged in 'ProductsController' actions tests no business account //
  context("Admin LOGGED IN no BUSINESS ACCOUNT, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {

    // TEST GET GET_MANY action  logged in no account //
    describe("GET '/api/products' - LOGGED IN no ACCOUNT' - tests with 'ProductImages' - GET_MANY action", () => {
      it("Should NOT fetch 'Product' models and return a correct error response", (done) => {
        chai.request(server)
          .get("/api/products")
          .set({ "Authorization": thirdAdminsToken })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.products).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything within 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProductImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ProductImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("product_images");
          expect(totalImageDirectories).to.equal(numberOfProductImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfProductImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfProductImageFiles);
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST GET GET_MANY logged in no account //

    // TEST GET_ONE action logged in no account //
    describe("GET '/api/products/:productId' - LOGGED IN no ACCOUNT - tests with 'ProductImages' - GET_MANY action", () => {
    
      it("Should NOT fetch 'Product' models and return a correct error response", (done) => {
        chai.request(server)
          .get("/api/products/" + (firstAdminsProduct._id as Types.ObjectId))
          .set({ "Authorization": thirdAdminsToken })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.product).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'ProductImage' models from the queried 'Product' model", (done) => {
        ProductImage.find({ productId: firstAdminsProduct._id }).exec()
          .then((products) => {
            expect(products.length).to.equal(queriedProductImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter anything within 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProductImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ProductImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("product_images");
          expect(totalImageDirectories).to.equal(numberOfProductImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfProductImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfProductImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST GET_ONE action logged in no account //

    // TEST POST CREATE logged in no account //
    describe("POST '/api/products/create' - LOGGED IN no ACCOUNT - tests with 'ProductImages' - CREATE action", () => {

      it("Should NOT create a 'Product' model and return a correct error response", (done) => {
        const mockProduct = generateMockProductData(1);
        chai.request(server)
          .post("/api/products/create")
          .set({ "Authorization": thirdAdminsToken })
          .send( ...mockProduct )
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.newProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything within 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProductImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ProductImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("product_images");
          expect(totalImageDirectories).to.equal(numberOfProductImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfProductImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfProductImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST POST CREATE action logged in no account //

    // TEST PATCH EDIT  action logged in no account //
    describe("PATCH '/api/products/update/:productId' - LOGGED IN no ACCOUNT - tests with 'ProductImages' - EDIT action", () => {

      it("Should NOT update 'Product' model and return a correct response", (done) => {
        const mockProduct = generateMockProductData(1);
        chai.request(server)
          .patch("/api/products/update/" + (firstAdminsProduct._id as Types.ObjectId))
          .set({ "Authorization": thirdAdminsToken })
          .send(...mockProduct)
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.editedProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'ProductImage' models from the queried 'Product' model", (done) => {
        ProductImage.find({ productId: firstAdminsProduct._id }).exec()
          .then((products) => {
            expect(products.length).to.equal(queriedProductImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter anything within 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProductImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ProductImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("product_images");
          expect(totalImageDirectories).to.equal(numberOfProductImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfProductImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfProductImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST PATCH EDIT action logged in no account //

    // TEST DELETE DELETE action logged in no account //
    describe("DELETE '/api/products/delete/:productId' - LOGGED IN no ACCOUNT - tests with 'ProductImages' - DELETE action", () => {
    
      it("Should NOT delete the 'Product' model and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/products/delete/" + String(firstAdminsProduct._id))
          .set({ "Authorization": thirdAdminsToken })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.deletedProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'ProductImage' models from the queried 'Product' model", (done) => {
        ProductImage.find({ productId: firstAdminsProduct._id }).exec()
          .then((products) => {
            expect(products.length).to.equal(queriedProductImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter anything within 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProductImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ProductImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("product_images");
          expect(totalImageDirectories).to.equal(numberOfProductImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfProductImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfProductImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST DELETE DELETE action correct BusinessAccount //
    
  });
  // END TEST CONTEXT Admin is logged in no account 'ProductsController' actions tests //

});