// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server import /
import server from "../../../server";
// models and model interfaces //
import { ProductData } from "../../../controllers/products_controller/type_declarations/productsControllerTypes";
import { IAdministrator } from "../../../models/Administrator";
import Product, { IProduct } from "../../../models/Product";
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { generateMockProductData } from "../../helpers/dataGeneration"; 
import { setupProdControllerTests, loginAdmins } from "./helpers/setupProdControllerTest";
import { doesNotMatch } from "assert";

chai.use(chaiHTTP);

describe("ProductsController - Logged In WITH CORRECT BusinessAccount ID - VALID DATA  - API tests", () => {
  let firstAdmin: IAdministrator;
  let createdProduct: IProduct;
  let productToUpdate: IProduct;
  let firstToken: string;
  let totalProducts: number;
  // mockData //
  let newProductData: ProductData;
  let updateProductData: ProductData;

  // database and model data setup //
  // logins and jwtTokens //
  before((done) => {
    setupProdControllerTests()
      .then((response) => {
        ({ firstAdmin } = response.admins);
        ({ productToUpdate } = response.products);
        return loginAdmins(chai, server, [ firstAdmin ]);
      })
      .then((tokensArr) => {
        ([ firstToken ] = tokensArr);
        return Product.countDocuments().exec();
      })
      .then((number) => {
        totalProducts = number;
        done();
      })
      .catch((err) => {
        done(err);
      });
      
  });
  before(() => {
    [ newProductData, updateProductData ] = generateMockProductData(2);
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });

  context("Admin WITH a 'BusinessAccount' set up, CREATE, EDIT, DELETE actions", () => {
    // TEST POST CREATE action Correct BusinessAccount - Invalid Data //
    describe("POST '/api/producs/create' - CORRECT 'BusinessAccount' - VALID DATA", () => {
      it("Should create a new 'Product' model, send back correct response", (done) => {
        chai.request(server)
          .post("/api/products/create")
          .set({ "Authorization": firstToken })
          .send({ ...newProductData })
          .end((err, res) => {
            if (err) done(err);
            createdProduct = res.body.newProduct;
            // asssert correct response //
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.newProduct).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly set all properties on a new 'Product' model", () => {
        expect(String(createdProduct.businessAccountId)).to.equal(String(firstAdmin.businessAccountId));
        expect(createdProduct.name).to.equal(newProductData.name);
        expect(createdProduct.price.toString()).to.equal(parseInt((newProductData.price as string)).toString());
        expect(createdProduct.description).to.equal(newProductData.description);
        expect(createdProduct.details).to.equal(newProductData.details);
        expect(createdProduct.images).to.be.an("array");
        expect(createdProduct.images.length).to.equal(0);
        expect(createdProduct.createdAt).to.be.a("string");
        expect(createdProduct.editedAt).to.be.a("string");
      });
      it("Should save the new 'Product' model in the database", (done) => {
        Product.exists({ _id: createdProduct._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should INCREASE the number of 'Product' models in the database by 1", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProducts + 1);
            totalProducts = number;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST POST CREATE action Correct BusinessAccount - Invalid Data //
    /*
    // TEST PATCH EDIT action Correct BusinessAccount - Invalid Data //
    describe("PATCH '/api/producs/update/:productId' - CORRECT 'BusinessAccount' - INVALID DATA", () => {
      it("Should NOT update an existing 'Product' model without a 'name' property", (done) => {
        chai.request(server)
          .patch("/api/products/update/" + String(productToUpdate._id ))
          .set({ "Authorization": firstToken })
          .send({
            ...newProductData,
            name: ""
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.errorMessages[0]).to.be.a("string");
            expect(res.body.editedProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT update an existing 'Product' model without a 'price' property", (done) => {
        chai.request(server)
          .patch("/api/products/update/" + String(productToUpdate._id ))
          .set({ "Authorization": firstToken })
          .send({
            ...newProductData,
            price: ""
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.errorMessages[0]).to.be.a("string");
            expect(res.body.editedProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT update an existing 'Product' model without a 'description' property", (done) => {
        chai.request(server)
          .patch("/api/products/update/" + String(productToUpdate._id ))
          .set({ "Authorization": firstToken })
          .send({
            ...newProductData,
            description: ""
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.errorMessages[0]).to.be.a("string");
            expect(res.body.editedProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT update an existing 'Product' model without a 'details' property", (done) => {
        chai.request(server)
          .patch("/api/products/update/" + String(productToUpdate._id ))
          .set({ "Authorization": firstToken })
          .send({
            ...newProductData,
            details: ""
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.errorMessages[0]).to.be.a("string");
            expect(res.body.editedProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT update an existing 'Product' model with all empty properties", (done) => {
        chai.request(server)
          .patch("/api/products/update/" + String(productToUpdate._id ))
          .set({ "Authorization": firstToken })
          .send({})
          .end((err, res) => {
            if (err) done(err);
            const errorsArr: string[] = res.body.errorMessages;
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(4);
            expect(res.body.editedProduct).to.be.undefined;
            for (const errorMsg of errorsArr) {
              expect(errorMsg).to.be.a("string");
            }
            done();
          });
      });
      it("Should NOT alter the 'Product' model in question in any way", (done) => {
        Product.findOne({ _id: productToUpdate._id }).exec()
          .then((product) => {
            expect(JSON.stringify(product)).to.equal(JSON.stringify(productToUpdate));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number 'Product' models in the database", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    })
    // END TEST PATCH EDIT action Correct BusinessAccount - Invalid Data //
    */
  });
 
});