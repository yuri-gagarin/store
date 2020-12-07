// testing dependencies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server import //
import server from "../../../server";
// models and model interfaces //
import Product, { IProduct } from "../../../models/Product";
// helpers and data generators //
import { setupProdControllerTests } from "./helpers/setupProdControllerTest";
import { isEmptyObj } from "../../../controllers/helpers/queryHelpers";
import { clearDB } from "../../helpers/dbHelpers";

chai.use(chaiHTTP);

describe("ProductsController - NOT LOGGED IN - API tests", () => {
  let productToUpdate: IProduct;
  let numberOfProducts: number;

  before((done) => {
    setupProdControllerTests()
      .then((response) => {
        ({ productToUpdate } = response.products);
        return Product.countDocuments().exec();
      })
      .then((number) => {
        numberOfProducts = number;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  // CONTEXT 'ProductsController' API tests Admin not logged in //
  context("'ProductsController' API tests - ADMIN NOT LOGGED IN (NO JWT token)", () => {
    // TEST GET INDEX action admin not logged in //
    describe("GET '/api/products - NO LOGIN - INDEX action", () => {

      it("Should not return any 'Product' models and send the correct response", (done) => {
        chai.request(server)
          .get("/api/products")
          .set({ "Authorization": "" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(res.body)).to.equal(true);
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST GET INDEX action admin not logged in //

    // TEST GET GET action admin not logged in //
    describe("GET '/api/products/:productId - NO LOGIN - GET action", () => {
      it("Should not return a 'Product' model and send the correct response", (done) => {
        chai.request(server)
          .get("/api/products")
          .set({ "Authorization": "" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(res.body)).to.equal(true);
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST GET GET action admin not logged in //

    // TEST POST CREATE action admin not logged in //
    describe("POST '/api/products/create - NO LOGIN - CREATE action", () => {
      it("Should not return a 'Product' model and send the correct response", (done) => {
        chai.request(server)
          .post("/api/products/create")
          .set({ "Authorization": "" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(res.body)).to.equal(true);
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST GET GET action admin not logged in //

    // TEST PATCH EDIT action admin not logged in //
    describe("PATCH '/api/products/update/:producdId - NO LOGIN - EDIT action", () => {
      it("Should not return a 'Product' model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/products/update/" + String(productToUpdate._id))
          .set({ "Authorization": "" })
          .send({ ...productToUpdate, name: "newProductName" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(res.body)).to.equal(true);
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT edit the 'Product' model in question", (done) => {
        Product.findOne({ _id: productToUpdate._id }).exec()
          .then((product) => {
            expect(JSON.stringify(product)).to.equal(JSON.stringify(productToUpdate));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST PATCH EDIT action admin not logged in //

    // TEST DELETE DELETE action admin not logged in //
    describe("DELETE'/api/products/delete/:producdId - NO LOGIN - DELETE action", () => {
      it("Should not return a 'Product' model and send the correct response", (done) => {
        chai.request(server)
          .delete("/api/products/delete/" + String(productToUpdate._id))
          .set({ "Authorization": "" })
          .send({ ...productToUpdate, name: "newProductName" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.error.text).to.equal("Unauthorized");
            expect(isEmptyObj(res.body)).to.equal(true);
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT remove the 'Product' model in question", (done) => {
        Product.exists({ _id: productToUpdate._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST DELETE DELETE action admin not logged in //
  });
  // END CONTEXT 'ProductsController' API tests Admin not logged in //

});