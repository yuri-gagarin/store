import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import faker from "faker";
// server, models //
import server from "../../server";
import Product, { IProduct} from "../../models/Product";
import { ProductParams } from "../../controllers/products_controller/ProductsController";
// helpers //
import { setupDB, clearDB } from "../helpers/dbHelpers";
import { createAdmins, createProducts } from "../helpers/dataGeneration";
import { createBusinessAcccount } from "../helpers/data_generations/businessAccontsGeneration";
import Administrator, { IAdministrator } from "../../models/Administrator";
import { ProductData } from "../../controllers/products_controller/type_declarations/productsControllerTypes";
chai.use(chaiHttp);

describe ("'ProductsController' API tests", () => {
  let totalProducts: number;
  let firstAdmin: IAdministrator;
  let secondAdmin: IAdministrator;
  let thirdAdmin: IAdministrator;
  ///
  let firstAccountId: string;
  let secondAccountId: string;

  before((done) => {
    setupDB()
      .then(() => {
        return createAdmins(3);
      })
      .then((createdAdmins) => {
        firstAdmin = createdAdmins[0];
        secondAdmin = createdAdmins[1];
        thirdAdmin = createdAdmins[2];

        return Promise.all([
          createBusinessAcccount({ admins: [ firstAdmin ] }),
          createBusinessAcccount({ admins: [ secondAdmin ] })
        ]);
      })
      .then((busAcccounts) => {
        firstAccountId = busAcccounts[0]._id as string;
        secondAccountId = busAcccounts[1]._id as string;

        return Promise.all([
          createProducts(5, busAcccounts[0]),
          createProducts(5, busAcccounts[1])
        ]);
      })
      .then(() => {
        return Promise.all([
          Administrator.findOneAndUpdate({ _id: firstAdmin.id }, { $set: { businessAccountId: firstAccountId } }),
          Administrator.findOneAndUpdate({ _id: secondAdmin.id }, { $set: { businessAccountId: secondAccountId } })
        ]);
      })
      .then((_) => Product.countDocuments().exec())
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
  context("'ProductsController' CRUD API tets WITHOUT login credentials", () => {
    let product: IProduct;

    before((done) => {
      Product.findOne({})
        .then((foundProduct) => {
          product = foundProduct!;
          done();
        })
        .catch((err) => done(err));
    });

    describe("POST '/api/products/create/' - CREATE action WITHOUT a proper login", () => {
      it("Should not not allow the 'ProductsController' CREATE action and respond properly", (done) => {
        chai.request(server)
          .post("/api/products/create")
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.error.text).to.equal("Unauthorized");
            expect(response.body.createdProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT increase the number of 'Product' models in the database", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    describe("PATCH '/api/products/update/:productId' - UPDATE action without a proper login", () => {
      it("Should NOT allow the 'ProductsController' EDIT action and respond properly", (done) => {
        chai.request(server)
          .patch("/api/products/update/" + String(product._id))
          .send({
            firstName: "newname"
          })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.error.text).to.equal("Unauthorized");
            expect(response.body.editedProduct).to.be.undefined;
            done();
        });
      });
      it("Should NOT alter the 'Product' model in the database", (done) => {
        Product.findOne({ _id: product._id }).exec()
          .then((foundProduct) => {
            expect(JSON.stringify(foundProduct)).to.equal(JSON.stringify(product));
            done();
          })
          .catch((err) => done(err));
      });
      it("Should NOT modify the number of 'Product' model in the database", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProducts);
            done();
          })
          .catch((err) => done(err));
      });
    });
    describe("DELETE '/api/products/delete/:productId - DELETE action without a proper login", () => {
      it("Should NOT allow the 'ProductsController' EDIT action and respond properly", (done) => {
        chai.request(server)
          .delete("/api/products/delete/" + String(product._id))
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.error.text).to.equal("Unauthorized");
            expect(response.body.createdProduct).to.be.undefined;
            done();
        });
      });
      it("Should NOT remove the 'Product' model from the database", (done) => {
        Product.exists({ _id: product._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => done(err));
      });
      it("Should NOT modify the number of 'Product' model in the database", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProducts);
            done();
          })
          .catch((err) => done(err));
      });
    });
  });
  // END  CONTEXT TEST PRODUCT CRUD without login credentials //
  // TEST CONTEXT TEST PRODUCT CRUD with proper login credentials //
  context("'ProductsController' CRUD API tests with proper login credentials", () => {
    let newProduct: ProductData;
    let productUpdate: ProductData;
    let tokenWithAccount: string;
    let tokenWithoutAccount: string;
    let productToUpdate: IProduct;


    before((done) => {
      newProduct = {
        name: faker.commerce.product(),
        price: faker.commerce.price(10, 100),
        description: faker.lorem.paragraph(),
        details: faker.lorem.paragraph()
      };
      productUpdate = {
        name: "new name",
        price: "999",
        description: "a new description",
        details: "a new details paragraph"
      };

      chai.request(server)
        .post("/api/admins/login")
        .send({
          email: firstAdmin.email,
          password: "password"
        })
        .end((err, response) => {
          if (err) done(err);
          ({ token : tokenWithAccount } = response.body.jwtToken);
          done();
        });
    });
    // set a token for an admin without a BusinessAccount //
    before((done) => {
      chai.request(server) 
        .post("/api/admins/login")
        .send({
          email: thirdAdmin.email,
          password: "password"
        })
        .end((err, response) => {
          if (err) done(err);
          ({ token: tokenWithoutAccount } = response.body.jwtToken);
          done();
        });
    });
    before((done) => {
      Product.findOne({ businessAccountId: firstAccountId })
        .then((foundProduct) => {
          productToUpdate = foundProduct!;
          done();
        })
        .catch((err) => done(err));
    });

    /*
    describe("'ProductsController' CRUD actions on a 'Product' a user IS able to EDIT with INVALID data input", () => {
      
      // TEST POST '/api/products/create' CREATE action with invalid 'Product' data //
      describe("POST '/api/products/create' CREATE action with invalid 'Product' data", () => {
        
        it("Should NOT create a new product WITHOUT a 'name' property", (done) => {
          chai.request(server)
            .post("/api/products/create")
            .set({ "Authorization": tokenWithAccount })
            .send({
              ...newProduct,
              name: ""
            })
            .end((err, response) => {
              if (err) done(err);
              // assert correct response //
              expect(response.status).to.equal(422);
              expect(response.body.newProduct).to.be.undefined;
              expect(response.body.responseMsg).to.be.a("string");
              expect(response.body.error).to.be.an("object");
              expect(response.body.errorMessages).to.be.an("array");
              expect(response.body.errorMessages[0]).to.be.a("string");
              done();
            });
        });
        it("Should NOT create a new product WITHOUT a 'price' property", (done) => {
          chai.request(server)
            .post("/api/products/create")
            .set({ "Authorization": tokenWithAccount })
            .send({
              ...newProduct,
              price: ""
            })
            .end((err, response) => {
              if (err) done(err);
              // assert correct response //
              expect(response.status).to.equal(422);
              expect(response.body.newProduct).to.be.undefined;
              expect(response.body.responseMsg).to.be.a("string");
              expect(response.body.error).to.be.an("object");
              expect(response.body.errorMessages).to.be.an("array");
              expect(response.body.errorMessages[0]).to.be.a("string");
              done();
            });
        });
        it("Should NOT create a new product WITHOUT a 'description' property", (done) => {
          chai.request(server)
            .post("/api/products/create")
            .set({ "Authorization": tokenWithAccount })
            .send({
              ...newProduct,
              description: ""
            })
            .end((err, response) => {
              if (err) done(err);
              // assert correct response //
              expect(response.status).to.equal(422);
              expect(response.body.newProduct).to.be.undefined;
              expect(response.body.responseMsg).to.be.a("string");
              expect(response.body.error).to.be.an("object");
              expect(response.body.errorMessages).to.be.an("array");
              expect(response.body.errorMessages[0]).to.be.a("string");
              done();
            });
        });
        it("Should NOT create a new product WITHOUT a 'details' property", (done) => {
          chai.request(server)
            .post("/api/products/create")
            .set({ "Authorization": tokenWithAccount })
            .send({
              ...newProduct,
              details: ""
            })
            .end((err, response) => {
              if (err) done(err);
              // assert correct response //
              expect(response.status).to.equal(422);
              expect(response.body.newProduct).to.be.undefined;
              expect(response.body.responseMsg).to.be.a("string");
              expect(response.body.error).to.be.an("object");
              expect(response.body.errorMessages).to.be.an("array");
              expect(response.body.errorMessages[0]).to.be.a("string");
              done();
            });
        });
        it("Should NOT create a new product if aLL properties are empty", (done) => {
          chai.request(server)
            .post("/api/products/create")
            .set({ "Authorization": tokenWithAccount })
            .send({})
            .end((err, response) => {
              if (err) done(err);
              // assert correct response //
              let errorMessages: string[];
              errorMessages = response.body.errorMessages as string[];
              expect(response.status).to.equal(422);
              expect(response.body.newProduct).to.be.undefined;
              expect(response.body.responseMsg).to.be.a("string");
              expect(response.body.error).to.be.an("object");
              expect(response.body.errorMessages).to.be.an("array");
              for( const message of errorMessages) {
                expect(message).to.be.a("string");
              }
              done();
            });
        });
        it("Should NOT add a new 'Product' to the database", (done) => {
          Product.countDocuments().exec()
            .then((number) => {
              expect(number).to.equal(totalProducts);
              done()
            })
            .catch((err) => done(err));
        });
      });
      // END TEST POST '/api/products/create' CREATE action with invalid 'Product' data //
      // TEST PATCH '/api/products/update/:productId action with invalid 'Product' data //
      describe("PATCH '/api/products/update/:productId' EDIT action with invalid 'Product' data", () => {
        
        it("Should NOT update a 'Product' WITHOUT a 'name' property", (done) => {
          chai.request(server)
            .patch("/api/products/update/" + String(productToUpdate._id))
            .set({ "Authorization": tokenWithAccount })
            .send({
              ...productUpdate,
              name: ""
            })
            .end((err, response) => {
              if (err) done(err);
              // assert correct response //
              expect(response.status).to.equal(422);
              expect(response.body.editedProduct).to.be.undefined;
              expect(response.body.responseMsg).to.be.a("string");
              expect(response.body.error).to.be.an("object");
              expect(response.body.errorMessages).to.be.an("array");
              expect(response.body.errorMessages[0]).to.be.a("string");
              done();
            });     
        });
        it("Should NOT update a 'Product' WITHOUT a 'price' property", (done) => {
          chai.request(server)
            .patch("/api/products/update/" + String(productToUpdate._id))
            .set({ "Authorization": tokenWithAccount })
            .send({
              ...productUpdate,
              price: ""
            })
            .end((err, response) => {
              if (err) done(err);
              // assert correct response //
              expect(response.status).to.equal(422);
              expect(response.body.editedProduct).to.be.undefined;
              expect(response.body.responseMsg).to.be.a("string");
              expect(response.body.error).to.be.an("object");
              expect(response.body.errorMessages).to.be.an("array");
              expect(response.body.errorMessages[0]).to.be.a("string");
              done();
            });     
        });
        it("Should NOT update a 'Product' WITHOUT a 'description' property", (done) => {
          chai.request(server)
            .patch("/api/products/update/" + String(productToUpdate._id))
            .set({ "Authorization": tokenWithAccount })
            .send({
              ...productUpdate,
              description: ""
            })
            .end((err, response) => {
              if (err) done(err);
              // assert correct response //
              expect(response.status).to.equal(422);
              expect(response.body.editedProduct).to.be.undefined;
              expect(response.body.responseMsg).to.be.a("string");
              expect(response.body.error).to.be.an("object");
              expect(response.body.errorMessages).to.be.an("array");
              expect(response.body.errorMessages[0]).to.be.a("string");
              done();
            });     
        });
        it("Should NOT update a 'Product' WITHOUT a 'details' property", (done) => {
          chai.request(server)
            .patch("/api/products/update/" + String(productToUpdate._id))
            .set({ "Authorization": tokenWithAccount })
            .send({
              ...productUpdate,
              details: ""
            })
            .end((err, response) => {
              if (err) done(err);
              // assert correct response //
              expect(response.status).to.equal(422);
              expect(response.body.editedProduct).to.be.undefined;
              expect(response.body.responseMsg).to.be.a("string");
              expect(response.body.error).to.be.an("object");
              expect(response.body.errorMessages).to.be.an("array");
              expect(response.body.errorMessages[0]).to.be.a("string");
              done();
            });     
        });
        it("Should NOT update a 'Product' WITHOUT ANY properties", (done) => {
          chai.request(server)
            .patch("/api/products/update/" + String(productToUpdate._id))
            .set({ "Authorization": tokenWithAccount })
            .send({})
            .end((err, response) => {
              if (err) done(err);
              // assert correct response //
              const errorMessages: string[] = response.body.errorMessages  || [];
              expect(response.status).to.equal(422);
              expect(response.body.editedProduct).to.be.undefined;
              expect(response.body.responseMsg).to.be.a("string");
              expect(response.body.error).to.be.an("object");
              expect(response.body.errorMessages).to.be.an("array");
              expect(response.body.errorMessages.length).to.equal(4);

              for (const message of errorMessages) {
                expect(message).to.be.a("string");
              }
              done();
            });     
        });
        it("Should NOT alter the 'Product' model in any way", (done) => {
          Product.findOne({ _id: productToUpdate._id }).exec()
            .then((foundProduct) => {
              expect(JSON.stringify(foundProduct)).to.equal(JSON.stringify(productToUpdate));
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

      });
      // END TEST PATCH '/api/products/update/:productId action with invalid 'Product' data //
      
    })
    */
  })
  // END TEST CONTEXT TEST PRODUCT CRUD with proper login credentials //
  
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
