// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import { Types } from "mongoose";
// server import /
import server from "../../../server";
// models and model interfaces //
import BusinessAccount, { IBusinessAccount } from "../../../models/BusinessAccount";
import { ProductData } from "../../../controllers/products_controller/type_declarations/productsControllerTypes";
import { IAdministrator } from "../../../models/Administrator";
import Product, { IProduct } from "../../../models/Product";
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { generateMockProductData } from "../../helpers/data_generation/productsDataGeneration"; 
import { setupProdControllerTests, loginAdmins } from "./helpers/setupProdControllerTest";

chai.use(chaiHTTP);

describe("ProductsController - Logged In WITH CORRECT BusinessAccount ID - VALID DATA - GET/POST/PATCH/DELETE  - API tests", () => {
  let firstAdmin: IAdministrator; let firstAdminsBusinessAccount: IBusinessAccount;
  let fetchedProducts: IProduct[];
  let createdProduct: IProduct;
  let updatedProduct: IProduct;
  let deletedProduct: IProduct;
  let firstAdminsProduct: IProduct;
  let firstToken: string;
  let totalProducts: number;
  // mockData //
  let newProductData: ProductData;
  let updateProductData: ProductData;
  // 
  let linkedProductsTotal: number;

  // database and model data setup //
  // logins and jwtTokens //
  before((done) => {
    setupProdControllerTests()
      .then((response) => {
        ({ firstAdmin } = response.admins);
        ({ firstAdminsProduct } = response.products);
        return loginAdmins(chai, server, [ firstAdmin ]);
      })
      .then((tokensArr) => {
        ([ firstToken ] = tokensArr);
        return Product.countDocuments().exec();
      })
      .then((number) => {
        totalProducts = number;
        return BusinessAccount.findOne({ _id: firstAdmin.businessAccountId }).exec();
      })
      .then((foundAccount) => {
        firstAdminsBusinessAccount = foundAccount!;
        linkedProductsTotal = firstAdminsBusinessAccount.linkedProducts.length;
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

  context("Admin WITH a 'BusinessAccount' set up, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {
    // TEST GET GET_MANY action correct BusinessAccount //
    describe("GET '/api/products' - CORRECT 'BusinessAccount' - GET_MANY action", () => {

      it("Should fetch 'Product' models and return a correct response", (done) => {
        chai.request(server)
          .get("/api/products")
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            fetchedProducts = res.body.products;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.products).to.be.an("array");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should return only 'Product' models belonging to 'Admins' 'Business' account", () => {
        for (const product of fetchedProducts) {
          expect(String(product.businessAccountId)).to.equal(String(firstAdmin.businessAccountId));
        }
      });
      it("Should NOT add nor subtract any 'Product' models to the database", (done) => {
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
    // END TEST GET GET_MANY action correct BusinessAccount //
    
    // TEST GET GET_ONE action correct BusinessAccount //
    describe("GET '/api/products/:productId' - CORRECT 'BusinessAccount' - GET_ONE action", () => {
      let product: IProduct;

      it("Should fetch 'Product' models and return a correct response", (done) => {
        chai.request(server)
          .get("/api/products/" + String(firstAdminsProduct._id))
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            product = res.body.product;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.product).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should return the correct 'Product' model and corresponding data", () => {
        expect(JSON.stringify(product)).to.equal(JSON.stringify(firstAdminsProduct));
      });
      it("Should NOT alter in any way the 'Product' model in the database", (done) => {
        Product.findOne({ _id: firstAdminsProduct._id }).exec()
          .then((foundProduct) => {
            expect(JSON.stringify(foundProduct)).to.equal(JSON.stringify(firstAdminsProduct));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT add nor subtract any 'Product' models to the database", (done) => {
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
    // END TEST GET_ONE action correct BusinessAccount //

    // TEST POST CREATE action Correct BusinessAccount - valid Data //
    describe("POST '/api/producs/create' - CORRECT 'BusinessAccount' - VALID DATA - CREATE action", () => {
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
      it("Should update the 'BusinessAccount' model and add the newly created 'Product' model to it", (done) => {
        BusinessAccount.findOne({ _id: firstAdmin.businessAccountId }).exec()
          .then((foundAccount) => {
            const productsIds: string[] = foundAccount!.linkedProducts.map((prodId) => (prodId as Types.ObjectId).toHexString());
            const createdProductId: string = createdProduct._id;
            expect(productsIds.includes(createdProductId)).to.equal(true);
            expect(productsIds.length).to.equal(linkedProductsTotal + 1);
            linkedProductsTotal = productsIds.length;
            done();
          })
          .catch((error) => {
            done(error);
          })
      })

    });
    // END TEST POST CREATE action Correct BusinessAccount - VALID Data //
    
    // TEST PATCH EDIT action Correct BusinessAccount - VALID Data //
    describe("PATCH '/api/producs/update/:productId' - CORRECT 'BusinessAccount' - VALID DATA - EDIT action", () => {
      it("Should correctly update a 'Product' model, send back correct response", (done) => {
        chai.request(server)
          .patch("/api/products/update/" + (firstAdminsProduct._id))
          .set({ "Authorization": firstToken })
          .send({ ...updateProductData })
          .end((err, res) => {
            if (err) done(err);
            updatedProduct = res.body.editedProduct;
            // asssert correct response //
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.editedProduct).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly set all properties on an updated 'Product' model", () => {
        expect(String(updatedProduct.businessAccountId)).to.equal(String(firstAdmin.businessAccountId));
        expect(updatedProduct.name).to.equal(updateProductData.name);
        expect(updatedProduct.price.toString()).to.equal(parseInt((updateProductData.price as string)).toString());
        expect(updatedProduct.description).to.equal(updateProductData.description);
        expect(updatedProduct.details).to.equal(updateProductData.details);
        expect(updatedProduct.images).to.be.an("array");
        expect(updatedProduct.images.length).to.equal(0);
        expect(updatedProduct.createdAt).to.be.a("string");
        expect(updatedProduct.editedAt).to.be.a("string");
        expect(updatedProduct.createdAt).to.not.equal(updatedProduct.editedAt);
      });
      it("Should save the new 'Product' model in the database", (done) => {
        Product.exists({ _id: updatedProduct._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should correctly save all fields in database, edited Product", (done) => {
        Product.findOne({ _id: updatedProduct._id })
          .then((savedProduct) => {
            expect(JSON.stringify(savedProduct)).to.equal(JSON.stringify(updatedProduct));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT alter the number of 'Product' model in the database", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProducts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT remove <productId> NOR alter the <linkedProducts> subarray in the 'BusinessAccount' model", (done) => {
        BusinessAccount.findOne({ _id: firstAdmin.businessAccountId }).exec()
          .then((foundAccount) => {
            const productIds: string[] = foundAccount!.linkedProducts.map((productId) => (productId as Types.ObjectId).toHexString());
            const queriedProductId = (firstAdminsProduct._id as Types.ObjectId).toHexString();
            expect(productIds.includes(queriedProductId)).to.equal(true);
            expect(foundAccount!.linkedProducts.length).to.equal(linkedProductsTotal);
            done();
          })
          .catch((error) => {
            done(error);
          })
      })

    });
    
    // END TEST PATCH EDIT action Correct BusinessAccount - VALID Data //

    // TEST DELETE DELETE action Correct BusinessAccount - Valid Data //
    describe("DELETE '/api/producs/delete/:productId' - CORRECT 'BusinessAccount' - VALID DATA - DELETE action", () => {
      it("Should correctly delete a 'Product' model, send back correct response", (done) => {
        chai.request(server)
          .delete("/api/products/delete/" + (firstAdminsProduct._id))
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            deletedProduct = res.body.deletedProduct;
            // asssert correct response //
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.deletedProduct).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should remove the 'Product' model from the database", (done) => {
        Product.exists({ _id: deletedProduct._id })
          .then((exists) => {
            expect(exists).to.equal(false);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should DECREMENT number of 'Product' models in the database exactly by 1", (done) => {
        Product.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProducts - 1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should remove the deleted 'Product' model <_id> property from linked 'BusinessAccount' model <linkedProducts> subarray", (done) => {
        BusinessAccount.findOne({ _id: firstAdmin.businessAccountId }).exec()
          .then((foundAccount) => {
            const linkedProductIds: string [] = foundAccount!.linkedProducts.map((productId) => (productId as Types.ObjectId).toHexString());
            const deletedProductId: string = deletedProduct._id as string;
            expect(linkedProductIds.includes(deletedProductId)).to.equal(false);
            expect(foundAccount!.linkedProducts.length).to.equal(linkedProductsTotal - 1);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

    });
    // END TEST DELETE DELETE action Correct BusinessAccount - Valid Data //
    
  });
 
});