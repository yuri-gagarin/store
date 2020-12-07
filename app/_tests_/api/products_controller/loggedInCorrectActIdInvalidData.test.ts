// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import faker from "faker";
// server import /
import server from "../../../server";
// models and model interfaces //
import { ProductData } from "../../../controllers/products_controller/type_declarations/productsControllerTypes";
import { IAdministrator } from "../../../models/Administrator";
import Product, { IProduct } from "../../../models/Product";
import { ValidationError } from "../../../controllers/helpers/errorHandlers"
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { generateMockProductData } from "../../helpers/dataGeneration"; 
import { setupProdControllerTests, loginAdmins } from "./helpers/setupProdControllerTest";

describe("ProductsController - Logged In WITH CORRECT BusinessAccount ID - INVALID DATA  - API tests", () => {
  let firstAdmin: IAdministrator;
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
    describe("POST '/api/producs/create' - CORRECT 'BusinessAccount' - INVALID DATA", () => {
      it("Should NOT create a new 'Product' model without a 'name' property", (done) => {
        chai.request(server)
          .post("/api/products/create")
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
            expect(res.body.newProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new 'Product' model without a 'price' property", (done) => {
        chai.request(server)
          .post("/api/products/create")
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
            expect(res.body.newProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new 'Product' model without a 'description' property", (done) => {
        chai.request(server)
          .post("/api/products/create")
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
            expect(res.body.newProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new 'Product' model without a 'details' property", (done) => {
        chai.request(server)
          .post("/api/products/create")
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
            expect(res.body.newProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new 'Product' model with all empty properties", (done) => {
        chai.request(server)
          .post("/api/products/create")
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
            expect(res.body.newProduct).to.be.undefined;
            for (const errorMsg of errorsArr) {
              expect(errorMsg).to.be.a("string");
            }
            done();
          });
      });
      it("Should NOT modify the number of 'Product' models in the database", (done) => {
        Product.countDocuments({}).exec()
          .then((number) => {
            expect(number).to.equal(totalProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST POST CREATE action Correct BusinessAccount - Invalid Data //

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

  })
 
})