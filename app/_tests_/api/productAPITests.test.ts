import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import faker from "faker";
// server, models //
import server from "../../server";
import Product, { IProduct} from "../../models/Product";
import { ProductParams } from "../../controllers/ProductsController";
// helpers //
import { setupDB, clearDB } from "../helpers/dbHelpers";
import { createProducts } from "../helpers/dataGeneration";

chai.use(chaiHttp);

describe ("Product API tests", () => {
  let totalProducts: number;

  before((done) => {
    setupDB()
      .then(() => createProducts(10))
      .then(() => Product.countDocuments())
      .then((number) => { totalProducts = number; done() })
      .catch((error) => { done(error) });
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err))
  });
  
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
  });

  describe("GET { '/api/products/:_id }", () => {
    let product: IProduct, requestedProduct: IProduct; 
    let responseMsg: string;

    before((done) => {
      Product.find().limit(1)
        .then((foundProducts) => {
          product = foundProducts[0];
          done();
        })
        .catch((error) => { done(error) });
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
          responseMsg = response.body.responseMsg;
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

  describe("POST { '/api/products/create' }", ()=> {

    const newData: ProductParams = {
      name: faker.lorem.word(),
      description: faker.lorem.paragraphs(1),
      details: faker.lorem.paragraphs(2),
      price: "100",
      productImages: []
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
      expect(createdProduct.price).to.equal(newData.price)
      done();
    });
    it("Should INCREASE the number of {Product(s)} by 1", (done) => {
      Product.countDocuments()
        .then((number) => {
          expect(number).to.equal(totalProducts + 1);
          totalProducts = number;
          done();
        })
        .catch((err) => { done(err) });
    });

  });

  describe("PATCH { '/api/products/update/:_id' }", () => {

    let product: IProduct, editedProduct: IProduct;
    const updateData: ProductParams = {
      name: faker.lorem.word(),
      description: faker.lorem.paragraphs(1),
      details: faker.lorem.paragraphs(2),
      price: "200",
      productImages: []
    };

    before((done) => {
      Product.find().limit(1)
        .then((products) => {
          product = products[0];
          done()
        })
        .catch((error) => { done(error) });
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
        .catch((err) => { done(err) });
    });

  });
  
  describe("DELETE { '/api/products/delete/:_id' }", () => {
    let product: IProduct, deletedProduct: IProduct;

    before((done) => {
      Product.find().limit(1)
        .then((products) => {
          product = products[0];
          done();
        })
        .catch((err) => { done(err) });
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
        .catch((err) => { done(err) });
    });
  });
  
});
