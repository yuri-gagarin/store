import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import faker from "faker";
// server, models //
import server from "../../server";
import Product, { IProduct} from "../../models/Product";
import { ProductParams } from "../../controllers/ProductsController";
// helpers //
import { setupDB, clearDB } from "../helpers/dbHelpers";
import { createAdmins, createProducts } from "../helpers/dataGeneration";

chai.use(chaiHttp);

describe ("'ProductsController' API tests", () => {
  let totalProducts: number;

  before((done) => {
    setupDB()
      .then(() => {
        return createAdmins(2);
      })
      .then((createdAdmins) => {
        return Promise.all([ createProducts(5, createdAdmins[0]), createProducts(5, createdAdmins[1]) ]);
      })
      .then(() => Product.countDocuments().exec())
      .then((number) => { totalProducts = number; done(); })
      .catch((error) => { done(error); });
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  // generic GET request tests //
  context("GET Request generic", () => {
    describe("GET { '/api/products' }", () => {
      let products: IProduct[], responseMsg: string;

      it("Should GET all products", (done) => {
        chai.request(server)
          .get("/api/products")
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            products = response.body.products;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(products).to.be.an("array");
      });
      it("Should return a default number of Products", () => {
        expect(products.length).to.equal(10);
      });
    });
  });
  // END generic GET requests tests //
  // GET Requests with queries tests //
  context("GET Requests with specific query options", () => {
    describe("GET { '/api/products?price=x' }", () => {
      let products: IProduct[], responseMsg: string;
      const price = "asc";
      it("Should GET all products", (done) => {
        chai.request(server)
          .get(`/api/products?price=${price}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            products = response.body.products;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(products).to.be.an("array");
      });
      it("Should return a default number of Products", () => {
        expect(products.length).to.equal(10);
      });
      it(`Should correctly sort Products by price=${price.toUpperCase()}`, () => {
        for (let i = 0; i < products.length - 1; i ++) {
          const firstProdPrice = products[i].price;
          const secondProdPrice = products[i + 1].price
          expect(firstProdPrice <= secondProdPrice).to.equal(true);
        }
      });
    });

    describe("GET { '/api/products?price=x&limit=x' }", () => {
      let products: IProduct[], responseMsg: string;
      const price = "desc"; const limit = 5;
      it("Should GET all products", (done) => {
        chai.request(server)
          .get(`/api/products?price=${price}&limit=${limit}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            products = response.body.products;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(products).to.be.an("array");
      });
      it(`Should return a correct number=${limit} of Products`, () => {
        expect(products.length).to.equal(limit);
      });
      it(`Should correctly sort Products by price=${price.toUpperCase()}`, () => {
        for (let i = 0; i < products.length - 1; i ++) {
          const firstProdPrice = products[i].price;
          const secondProdPrice = products[i + 1].price
          expect(firstProdPrice >= secondProdPrice).to.equal(true);
        }
      });
    });

    describe("GET { '/api/products?date=x' }", () => {
      let products: IProduct[], responseMsg: string;
      const date = "asc";
      it("Should GET all products", (done) => {
        chai.request(server)
          .get(`/api/products?date=${date}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            products = response.body.products;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(products).to.be.an("array");
      });
      it("Should return a default number of Products", () => {
        expect(products.length).to.equal(10);
      });
      it(`Should correctly sort Products by date=${date.toUpperCase()}`, () => {
        for (let i = 0; i < products.length - 1; i ++) {
          const firstProdDate = products[i].createdAt;
          const secondProdDate = products[i + 1].createdAt
          expect(firstProdDate <= secondProdDate).to.equal(true);
        }
      });
    });

    describe("GET { '/api/products?date=x&limit=x' }", () => {
      let products: IProduct[], responseMsg: string;
      const date = "asc"; const limit = 5;
      it("Should GET all products", (done) => {
        chai.request(server)
          .get(`/api/products?date=${date}&limit=${limit}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            products = response.body.products;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(products).to.be.an("array");
      });
      it(`Should return a correct number=${limit} of Products`, () => {
        expect(products.length).to.equal(limit);
      });
      it(`Should correctly sort Products by date=${date.toUpperCase()}`, () => {
        for (let i = 0; i < products.length - 1; i ++) {
          const firstProdDate = products[i].createdAt;
          const secondProdDate = products[i + 1].createdAt;
          expect(firstProdDate <= secondProdDate).to.equal(true);
        }
      });
    });

    describe("GET { '/api/products?name=x' }", () => {
      let products: IProduct[], responseMsg: string;
      const name = "asc";
      it("Should GET all products", (done) => {
        chai.request(server)
          .get(`/api/products?name=${name}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            products = response.body.products;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(products).to.be.an("array");
      });
      it("Should return a default number of Products", () => {
        expect(products.length).to.equal(10);
      });
      it(`Should correctly sort Products by name=${name.toUpperCase()}`, () => {
        for (let i = 0; i < products.length - 1; i ++) {
          const firstProdName = products[i].name;
          const secondProdName = products[i + 1].name;
          expect(firstProdName <= secondProdName).to.equal(true);
        }
      });
    });

    describe("GET { '/api/products?name=x&limit=x' }", () => {
      let products: IProduct[], responseMsg: string;
      const name = "asc"; const limit = 5;
      it("Should GET all products", (done) => {
        chai.request(server)
          .get(`/api/products?name=${name}&limit=${limit}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            products = response.body.products;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(products).to.be.an("array");
      });
      it(`Should return a CORRECT number=${limit} of Products`, () => {
        expect(products.length).to.equal(limit);
      });
      it(`Should correctly sort Products by name=${name.toUpperCase()}`, () => {
        for (let i = 0; i < products.length - 1; i ++) {
          const firstProdName = products[i].name;
          const secondProdName = products[i + 1].name;
          expect(firstProdName <= secondProdName).to.equal(true);
        }
      });
    });
  })
  // END GET requests with queries tests //
  // GET request for specific product tests //
  // CONTEXT TEST PRODUCT CRUD without login credentials //
  context("'ProductsController' CRUD API tets without login credentials", () => {
    before(() => {

    })
    describe("POST '/api/products/create/' - CREATE action WITHOUT a proper login", () => {
      it("Should not not allow the 'ProductsController' CREATE action and respond properly", (done) => {
        chai.request(server)
          .post("/api/products/create")
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.newProduct).to.be.undefined;
            expect(response.body.error.message).to.equal("Unauthorized");
            done();
          });
      })
    });
    describe("PATCH '/api/products/update/:productId' - UPDATE action without a proper login", () => {

    });
    describe("DELETE '/api/products/delete/:productId - DELETE action without a proper login", () => {

    })
  });
  // END  CONTEXT TEST PRODUCT CRUD without login credentials //
  /*
  context("GET Request for specific Product", () => {
    describe("GET { '/api/products/:_id }", () => {
      let product: IProduct, requestedProduct: IProduct; 

      before((done) => {
        Product.find().limit(1)
          .then((foundProducts) => {
            product = foundProducts[0];
            done();
          })
          .catch((error) => { done(error); });
      });

      it("Should GET a specific product", (done) => {
        chai.request(server)
          .get("/api/products/" + product._id)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.product).to.be.an("object");
            requestedProduct = response.body.product;
            done();
          });
      });
      it("Should return the correct {Product}", (done) => {
        expect(String(requestedProduct._id)).to.equal(String(product._id));
        expect(requestedProduct.name).to.equal(product.name);
        expect(requestedProduct.description).to.equal(product.description);
        done();
      });
    });
  });
  // END GET requests for specific product tests //
  // POST Requests tests //
  context("POST Request CREATE", () => {
    describe("POST { '/api/products/create' }", ()=> {

      const newData: ProductParams = {
        name: faker.lorem.word(),
        description: faker.lorem.paragraphs(1),
        details: faker.lorem.paragraphs(2),
        price: 100,
        images: []
      };
      let createdProduct: IProduct;

      it("Should create a new {Product}", (done) => {
        chai.request(server)
          .post("/api/products/create")
          .send(newData)
          .end((err, response) => {
            if (err) done(err);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.newProduct).to.be.an("object");
            createdProduct = response.body.newProduct;
            done();
          });
      });
      it("Should return the created {Product} and correct data", (done) => {
        expect(createdProduct.name).to.equal(newData.name);
        expect(createdProduct.description).to.equal(newData.description);
        expect(createdProduct.price).to.equal(newData.price);
        done();
      });
      it("Should INCREASE the number of {Product(s)} by 1", (done) => {
        Product.countDocuments()
          .then((number) => {
            expect(number).to.equal(totalProducts + 1);
            totalProducts = number;
            done();
          })
          .catch((err) => { done(err); });
      });
    });
  });
  // END POST requests tests //
  // PATCH requests tests //
  context("PATCH Request UPDATE", () => {
    describe("PATCH { '/api/products/update/:_id' }", () => {

      let product: IProduct, editedProduct: IProduct;
      const updateData: ProductParams = {
        name: faker.lorem.word(),
        description: faker.lorem.paragraphs(1),
        details: faker.lorem.paragraphs(2),
        price: 200,
        images: []
      };

      before((done) => {
        Product.find().limit(1)
          .then((products) => {
            product = products[0];
            done();
          })
          .catch((error) => { done(error); });
      });

      it("Should update an existing {Product}", (done) => {
        chai.request(server)
          .patch("/api/products/update/" + product._id)
          .send(updateData)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.editedProduct).to.be.an("object");
            editedProduct = res.body.editedProduct;
            done();
          });
      });
      it("Should return the updated {Product} and the updated data", (done) => {
        expect(String(editedProduct._id)).to.equal(String(product._id));
        expect(editedProduct.name).to.equal(updateData.name);
        expect(editedProduct.description).to.equal(updateData.description);
        expect(editedProduct.price).to.equal(updateData.price);
        done();
      });
      it("Should NOT INCREASE the number of {Product(s)}", (done) => {
        Product.countDocuments()
          .then((number) => {
            expect(number).to.equal(totalProducts);
            done();
          })
          .catch((err) => { done(err); });
      });

    });
  });
  // END PATCH requests tests //
  // DELETE requests tests //
  context("DELETE Request REMOVE", () => {
    describe("DELETE { '/api/products/delete/:_id' }", () => {
      let product: IProduct, deletedProduct: IProduct;

      before((done) => {
        Product.find().limit(1)
          .then((products) => {
            product = products[0];
            done();
          })
          .catch((err) => { done(err); });
      });

      it("Should successfully delete a {Product}", (done) => {
        chai.request(server)
          .delete("/api/products/delete/" + product._id)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.deletedProduct).to.be.an("object");
            deletedProduct = res.body.deletedProduct;
            done();
          });
      });
      it("Should return the deleted {Product} and its data", (done) => {
        expect(String(deletedProduct._id)).to.equal(String(product._id));
        done();
      });
      it("Should DECREASE the number of {Product(s)} by 1", (done) => {
        Product.countDocuments()
          .then((number) => {
            expect(number).to.equal(totalProducts - 1);
            done();
          })
          .catch((err) => { done(err); });
      });
    });
  })
  // END DELETE requests tests //
  */
});
