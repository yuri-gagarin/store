import chai, { expect } from "chai"
import faker from "faker";
import chaiHTTP from "chai-http";
import { ProductData } from "../../../controllers/products_controller/type_declarations/productsControllerTypes";
import Administrator, { IAdministrator } from "../../../models/Administrator";
import Product, { IProduct } from "../../../models/Product";
import { createAdmins, createProducts } from "../../helpers/dataGeneration";
import { createBusinessAcccount } from "../../helpers/data_generations/businessAccontsGeneration";
import { clearDB, setupDB } from "../../helpers/dbHelpers";
import server from "../../../server";
import { doesNotMatch } from "assert";

chai.use(chaiHTTP);

describe("'ProductsController' - Logged In - API tests", () => {
  let newProductData: ProductData;
  let updateProductData: ProductData;
  let productToUpdate: IProduct;
  let updatedProduct: IProduct;
  let totalNumberOfProducts: number;
  // admin models first two have a 'BusinessAccount' set up, third does not //
  let firstAdmin: IAdministrator;
  let secondAdmin: IAdministrator;
  let thirdAdmin: IAdministrator;
  // login jwtTokens //
  let firstAdminToken: string;
  let secondAdminToken: string;
  let thirdAdminToken: string;
  // BusinessAccount ids //
  let firstAdminBusAcctId: string;
  let secondAdminBusAcctId: string;
  // setup DB, create models, count products //
  before((done) => {
    setupDB()
      .then(() => {
        return createAdmins(3);
      }) 
      .then((adminsArr) => {
        [ firstAdmin, secondAdmin, thirdAdmin ] = adminsArr;
        return Promise.all([
          createBusinessAcccount({ admins: [ firstAdmin ] }),
          createBusinessAcccount({ admins: [ secondAdmin ] })
        ]);
      })
      .then((busAccountArr) => {
        [ firstAdminBusAcctId, secondAdminBusAcctId ] = busAccountArr.map((acc) => String(acc._id));
        return Promise.all([
          createProducts(5, busAccountArr[0]),
          createProducts(5, busAccountArr[1])
        ]);
      })
      .then((products) => {
        productToUpdate = products[0][0];
        return Promise.all([
          Administrator.findOneAndUpdate({ _id: firstAdmin._id }, { $set: { businessAccountId: firstAdminBusAcctId } }, { new: true }),
          Administrator.findOneAndUpdate({ _id: secondAdmin._id }, { $set: { businessAccountId: secondAdminBusAcctId } }, { new: true })
        ]);
      })
      .then((updatedAdminArr) => {
        [ firstAdmin, secondAdmin ] = (updatedAdminArr as IAdministrator[]);
        return Product.countDocuments().exec();
      })
      .then((num) => {
        totalNumberOfProducts = num;
        done();
      })
      .catch((err) => {
        done(err)
      });
  });
  // login all admins and set the tokens //
  // yay callbacks //
  before((done) => {
    Promise.all([
      chai.request(server)
        .post("/api/admins/login")
        .send({ email: firstAdmin.email, password: "password" })
        .then((res) => {
          firstAdminToken = res.body.jwtToken.token;
        }),
      chai.request(server)
        .post("/api/admins/login")
        .send({ email: secondAdmin.email, password: "password" })
        .then((res) => {
          secondAdminToken = res.body.jwtToken.token;
        }),
      chai.request(server)
        .post("/api/admins/login")
        .send({ email: thirdAdmin.email, password: "password" })
        .then((res) => {
          thirdAdminToken = res.body.jwtToken.token;
      }),
    ])
    .then((_) => {
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
  })
  /*
  // CONTEXT 'ProductsController' CREATE EDIT DELETE actions without 'BusinessAccount' set up //
  context("User without a 'BusinessAccount' set up, CREATE, EDIT, DELETE actions", () => {
    describe("POST '/api/products/create' - NO 'BusinessAccount' - CREATE action", () => {
      it("Should NOT allow CREATE of a 'Product' if admin does not have a 'BusinessAccount' set up", (done) => {
        chai.request(server)
          .post("/api/products/create/")
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
      
    });
  });
  // END CONTEXT 'ProductsController' CREATE EDIT DELETE actions without 'BusinessAccount' set up //
  */
  // CONTEXT 'ProductsController' EDIT DELETE actions with wrong 'BusinessAccount //
  context("User with a wrong 'BusinessAccount' set up EDIT, DELETE actions", () => {
    // TEST Admin with wrong business account EDIT action //
    describe("PATCH '/api/products/update/:productId' - WRONG 'BusinessAccount' - EDIT action", () => {
      it("Should NOT allow EDIT of a 'Product' if Admin's  'BusinessAccount' _id doesnt match 'Product'", (done) => {
        chai.request(server)
          .patch("/api/products/update/" + String(productToUpdate._id))
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
        Product.findOne({ _id: productToUpdate._id }).exec()
          .then((foundProduct) => {
            expect(JSON.stringify(foundProduct)).to.equal(JSON.stringify(productToUpdate));
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
    
    describe("DELETE '/api/products/update/:productId' - WRONG 'BusinessAccount' - DELETE action", () => {
      it("Should NOT allow DELETE of a 'Product' if Admin's  'BusinessAccount' _id doesnt match 'Product'", (done) => {
        chai.request(server)
          .delete("/api/products/delete/" + String(productToUpdate._id))
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
        Product.exists({ _id: productToUpdate._id })
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