// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import faker from "faker";
// server import //
import server from "../../../server";
// models and model interfaces //
import { ProductData } from "../../../controllers/products_controller/type_declarations/productsControllerTypes";
import { IAdministrator } from "../../../models/Administrator";
import Product, { IProduct } from "../../../models/Product";
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { setupProdControllerTests, loginAdmins } from "./helpers/setupProdControllerTest";

chai.use(chaiHTTP);

describe("ProductsController - Logged In WITH WRONG or MISSING BusinessAccount ID - GET/POST/PATCH/DELETE - API tests", () => {
  let newProductData: ProductData;
  let updateProductData: ProductData;
  // product models //
  let firstAdminsProduct: IProduct;
  let secondAdminsProduct: IProduct;
  // admin models first two have a 'BusinessAccount' set up, third does not //
  let firstAdmin: IAdministrator;
  let secondAdmin: IAdministrator;
  let thirdAdmin: IAdministrator;
  // login jwtTokens //
  let firstAdminToken: string;
  let secondAdminToken: string;
  let thirdAdminToken: string;
  // total number of Product models in database //
  let totalNumberOfProducts: number;
  // setup DB, create models, count products //
  before((done) => {
    setupProdControllerTests()
      .then((response) => {
        const { admins, products } = response;
        ({ firstAdmin, secondAdmin, thirdAdmin } = admins);
        ({ firstAdminsProduct, secondAdminsProduct } = products);
        return Product.countDocuments().exec();
      })
      .then((number) => {
        totalNumberOfProducts = number;
        done();
      })
      .catch((err) => {
        done(err);
      })
  });
  // login all admins and set the tokens //
  // yay callbacks //
  before((done) => {
    loginAdmins(chai, server, [ firstAdmin, secondAdmin, thirdAdmin ])
    .then((tokensArr) => {
      [ firstAdminToken, secondAdminToken, thirdAdminToken ] = tokensArr;
      done();
    })
    .catch((err) => {
      done(err);
    })
  });
  // generate mock data for CREATE EDIT actions //
  before(() => {
    newProductData = {
      name: faker.commerce.product(),
      price: faker.commerce.price(100),
      description: faker.lorem.paragraph(),
      details: faker.lorem.paragraph()
    };
    updateProductData = {
      name: "updatedName",
      price: "200",
      description: "updated description",
      details: "updated details"
    };
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  
  // CONTEXT 'ProductsController' GET_MANY GET_ONE CREATE EDIT DELETE actions without 'BusinessAccount' set up //
  context("Admin without a 'BusinessAccount' set up, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {

    // TEST GET with no business account GET_MANY action //
    describe("GET '/api/products - NO 'NO BusinessAccount' - GET_MANY action", () => {

      it("Should NOT allow the GET_MANY action of 'ProductsController' and return correct response", (done) => {
        chai.request(server)
          .get("/api/products")
          .set({ "Authorization": thirdAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.products).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT modify anything in the 'Product' models in the database", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST GET with no business account GET_MANY action //

    // TEST GET with no business account GET_ONE action //
    describe("GET '/api/products/:productId' - NO 'BusinessAccont' - GET_ONE action", () => {

      it("Should NOT allow the GET_ONE action of 'ProductsController' and return correct response", (done) => {
        chai.request(server)
          .get("/api/products/" + (firstAdminsProduct._id as string))
          .set({ "Authorization": thirdAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.product).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT edit the 'Product' in question in any way", (done) => {
        Product.findOne({ _id: firstAdminsProduct._id })
          .then((foundProduct) => {
            expect(JSON.stringify(foundProduct)).to.equal(JSON.stringify(firstAdminsProduct));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Product' model in the database", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST GET with no business acount GET_ONE action //
    
    // TEST Admin with no business account CREATE action //
    describe("POST '/api/products/create' - NO 'BusinessAccount' - CREATE action", () => {

      it("Should NOT allow CREATE of a 'Product' if admin does not have a 'BusinessAccount' set up", (done) => {
        chai.request(server)
          .post("/api/products/create")
          .set({ "Authorization": thirdAdminToken })
          .send({
            ...newProductData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newProduct).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT add a new 'Product' model to the database", (done) => {
        Product.countDocuments().exec()
         .then((number) => {
          expect(number).to.equal(totalNumberOfProducts);
          done();
         })
         .catch((err) => {
           done(err);
         });
      });

    });
    // END TEST Admin with no business account CREATE action //

    // TEST Admin with no Business account EDIT action //
    describe("PATCH '/api/products/edit/:productId' - NO 'BusinessAccount' - EDIT action", () => {

      it("Should NOT allow EDIT of a 'Product' if admin does not have a 'BusinessAccount' set up", (done) => {
        chai.request(server)
          .patch("/api/products/update/" + String(firstAdminsProduct._id))
          .set({ "Authorization": thirdAdminToken })
          .send({
            ...updateProductData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newProduct).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT alter the 'Product' model in question in the database", (done) => {
        Product.findOne({ _id: firstAdminsProduct._id }).exec()
          .then((product) => {
            expect(JSON.stringify(product)).to.equal(JSON.stringify(firstAdminsProduct));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Product' models in the database", (done) => {
        Product.countDocuments().exec()
          .then((val) => {
            expect(val).to.equal(totalNumberOfProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST Admin with no Busniess accoint EDIT action //

    // TEST Admin with no Busniess account DELETE action //
    describe("DELETE '/api/products/delete/:productId' - NO 'BusinessAccount' - DELETE action", () => {

      it("Should NOT allow DELETE of a 'Product' if admin does not have a 'BusinessAccount' set up", (done) => {
        chai.request(server)
          .delete("/api/products/delete/" + String(firstAdminsProduct._id))
          .set({ "Authorization": thirdAdminToken })
          .send({
            ...updateProductData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newProduct).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT alter the 'Product' model in question in the database", (done) => {
        Product.findOne({ _id: firstAdminsProduct._id }).exec()
          .then((product) => {
            expect(JSON.stringify(product)).to.equal(JSON.stringify(firstAdminsProduct));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Product' models in the database", (done) => {
        Product.countDocuments().exec()
          .then((val) => {
            expect(val).to.equal(totalNumberOfProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST Admin with no Busniess account DELETE action //
    
  });
  // END CONTEXT 'ProductsController' INDEX GET CREATE EDIT DELETE actions without 'BusinessAccount' set up //

  // CONTEXT 'ProductsController' GET_ONE GET EDIT DELETE actions with wrong 'BusinessAccount //
  context("Admin with a wrong 'BusinessAccount' set up GET_ONE, EDIT, DELETE actions", () => {
    // TEST GET GET_ONE controller action with wrong 'BusinesAccount' //
    describe("GET '/api/products/:productId' - WRONG 'BusinessAccount' - GET_ONE action", () => {

      it("Should NOT return a 'Product' model which belongs to another account", (done) => {
        chai.request(server)
          .get("/api/products/" + String(firstAdminsProduct._id) )
          .set({ "Authorization": secondAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            // console.log(response)
            expect(response.status).to.equal(401);
            expect(response.body.product).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT edit a 'Product' model in the database in any way", (done) => {
        Product.findOne({ _id: firstAdminsProduct._id }).exec()
          .then((product) => {
            expect(JSON.stringify(product)).to.equal(JSON.stringify(firstAdminsProduct));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Product' models in the database", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    
    });
    // END TEST GET GET_ONE controller action with wrong 'BusinessAccount' //
    
    // TEST Admin with wrong business account EDIT action //
    describe("PATCH '/api/products/update/:productId' - WRONG 'BusinessAccount' - EDIT action", () => {
      it("Should NOT allow EDIT of a 'Product' if Admin's  'BusinessAccount' _id doesnt match 'Product'", (done) => {
        chai.request(server)
          .patch("/api/products/update/" + String(firstAdminsProduct._id))
          .set({ "Authorization": secondAdminToken })
          .send({
            ...newProductData
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newProduct).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT edit the 'Product' in question in ANY way", (done) => {
        Product.findOne({ _id: firstAdminsProduct._id }).exec()
          .then((foundProduct) => {
            expect(JSON.stringify(foundProduct)).to.equal(JSON.stringify(firstAdminsProduct));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Product' models in the database", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST Admin with wrong business account EDIT action //
    
    // TEST Admin with wrong BusinessAccount DELETE action //
    describe("DELETE '/api/products/delete/:productId' - WRONG 'BusinessAccount' - DELETE action", () => {
      it("Should NOT allow DELETE of a 'Product' if Admin's  'BusinessAccount' _id doesnt match 'Product'", (done) => {
        chai.request(server)
          .delete("/api/products/delete/" + String(firstAdminsProduct._id))
          .set({ "Authorization": secondAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.newProduct).to.be.undefined;
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages[0]).to.be.a("string");
            done();
          });
      });
      it("Should NOT delete the 'Product' from the database", (done) => {
        Product.exists({ _id: firstAdminsProduct._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Product' models in the database", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalNumberOfProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST Admin with wrong BusinessAccount DELETE action //
    
  });
  // END CONTEXT 'ProductsController' EDIT DELETE actions with wrong 'BusinessAcccount //
  
});