// testing dependencies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import { Types } from "mongoose";
import fs from "fs";
// server import //
import server from "../../../server";
// models and model interfaces //
import Administrator, { IAdministrator } from "../../../models/Administrator";
import BusinessAccount, { IBusinessAccount } from "../../../models/BusinessAccount";
import Store, { IStore } from "../../../models/Store";
import StoreImage, { IStoreImage } from "../../../models/StoreImage";
import StoreItem from "../../../models/StoreItem";
import StoreItemImage, { IStoreItemImage } from "../../../models/StoreItemImage";
import Service, { IService } from "../../../models/Service";
import ServiceImage, { IServiceImage } from "../../../models/ServiceImage";
import Product, { IProduct } from "../../../models/Product";
import ProductImage, { IProductImage } from "../../../models/ProductImage";
// helpers and test setup methods //
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";
import { setupBusinessAccountControllerTests, populateBusinessAccount, setupPopulatedBusinessActDeleteTest, cleanupBusinessAccountTestImages } from "./helpers/testSetupAndBreakdown";
import { isEmptyObj } from "../../../controllers/_helpers/queryHelpers";
import { clearDB } from "../../helpers/dbHelpers";


chai.use(chaiHTTP);

/**
 * NOTES 
 * DELETE action for 'BusinessAccountsController' needs to be thouroughly tested for a populated account
 */

describe("BusinessAccountsController - LOGGED IN - WITH ACCOUNT - ACCESSING OWN ACCOUNT - DETAILED API tests for PATCH/DELETE methods", () => {
  // firstAdmin and secondAdmin have mock acccounts, thirdAdmin and fourthAdmin do not //
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator, fourthAdmin: IAdministrator;
  let firstAdminsBusinessAccount: IBusinessAccount, secondAdminsBusinessAccount: IBusinessAccount;
  let populatedBusinessAccount: IBusinessAccount;
  let numberOfBusinessAccounts: number;
  //
  let editedAccount: IBusinessAccount;
  let deletedBusinessAccount: IBusinessAccount;
  //
  let firstAdminsToken: string, secondAdminsToken: string, thirdAdminsToken: string, fourthAdminsToken: string;
  // data for DELETE action tests //
  let totalStoresCount: number, totalStoreImagesCount: number;
  let totalStoreItemsCount: number, totalStoreItemImagesCount: number;
  let totalServicesCount: number, totalServiceImagesCount: number;
  let totalProductsCount: number, totalProductImagesCount: number;
  let accountsStoreImages: IStoreImage[];
  let accountsStoreItemImages: IStoreItemImage[];
  let accountsServiceImages: IServiceImage[];
  let accountsProductImages: IProductImage[];

  before(function(done) {
    // neeed a longer timeout to 
    this.timeout(30000);
    setupBusinessAccountControllerTests()
      .then(({ admins, businessAccounts }) => {
        ({ firstAdmin, secondAdmin, thirdAdmin, fourthAdmin } = admins);
        ({ firstAdminsBusinessAccount, secondAdminsBusinessAccount } = businessAccounts);
        return BusinessAccount.countDocuments().exec();
      })
      .then((number) => {
        numberOfBusinessAccounts = number;
        return loginAdmins(chai, server, [ firstAdmin, secondAdmin ]);
      })
      .then((adminsArr) => {
        [ firstAdminsToken, secondAdminsToken, thirdAdminsToken, fourthAdminsToken ] = adminsArr;
        return populateBusinessAccount({
          businessAccountId: firstAdminsBusinessAccount._id,
          numOfStores: 2,
          numOfStoreImagesPerStore: 2,
          numOfStoreItemsPerStore: 2,
          numOfStoreItemImgsPerStoreItem: 2,
          numOfServices: 2,
          numOfServiceImgsPerService: 2,
          numOfProducts: 2,
          numOfProductImgsPerProduct: 2
        });
      })
      .then(({ populatedBusinessAcct }) => {
        populatedBusinessAccount =  populatedBusinessAcct;
        return setupPopulatedBusinessActDeleteTest(populatedBusinessAccount);
      })
      .then((response) => {
        const { accountData, databaseCounts } = response;
        (
          { totalStoresCount, totalStoreImagesCount, totalStoreItemsCount, totalStoreItemImagesCount,
            totalServicesCount, totalServiceImagesCount, totalProductsCount, totalProductImagesCount
          } = databaseCounts 
        );
        ({ accountsStoreImages, accountsStoreItemImages, accountsServiceImages, accountsProductImages } = accountData);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  after((done) => {
    clearDB()
      .then(() => {
        const busAcctId: Types.ObjectId = firstAdminsBusinessAccount._id;
        return cleanupBusinessAccountTestImages(String(busAcctId));
      })
      .then((_) => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  // CONTEXT 'BusinessAccountsController' API tests admin is logged in with a business account accessing their own account //
  context("'BusinessAccountsController' API tets - ADMIN LOGGED IN - WITH BUSINESS ACCOUNT - Accessing own account - detailed PATCH tests", () => {
  
    // TEST PATCH EDIT ACTION admin logged in with business account add a single admin //
    describe("PATCH '/api/business_accounts/edit/:businessAcctId' - EDIT action on own account - Adding A single 'Admin' to account who doesnt have an account", () => {
      
      it("Should correctly update, return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/business_accounts/edit/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": firstAdminsToken })
          .send({
            newAdmins: [ thirdAdmin._id ]
          })
          .end((err, res) => {
            if(err) done(err);
            // assert correct rendering //
            editedAccount = res.body.editedBusinessAccount;
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.editedBusinessAccount).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should return correctly linked 'editedBusinessAccount' in response", () => {
        const { linkedAdmins, linkedStores, linkedProducts, linkedServices } = editedAccount;
        expect(linkedAdmins.length).to.equal(2);
        expect(linkedStores.length).to.equal(populatedBusinessAccount.linkedStores.length);
        expect(linkedServices.length).to.equal(populatedBusinessAccount.linkedServices.length);
        expect(linkedProducts.length).to.equal(populatedBusinessAccount.linkedProducts.length);
      });
      it("Should return correct data in linked 'editedBusinessAccount' in response", () => {
        const { linkedStores, linkedProducts, linkedServices } = editedAccount;
        for (const store of linkedStores as IStore[]) {
          expect(store).to.be.an("object");
        }
        for (const product of linkedProducts) {
          expect(product).to.be.an("object");
        }
        for (const service of linkedServices) {
          expect(service).to.be.an("object");
        }
      });
      it("Should correctly update the 'BusinessAccount' model in the database", (done) => {
        BusinessAccount.findOne({ _id: firstAdminsBusinessAccount._id }).exec()
          .then((businessAccount) => {
            expect(businessAccount!.linkedAdmins.length).to.equal(2);
            expect(businessAccount!.linkedAdmins.includes(firstAdmin._id)).to.equal(true);
            expect(businessAccount!.linkedAdmins.includes(thirdAdmin._id)).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should correctly update the queried 'Administrator' model in the database", (done) => {
        Administrator.findOne({ _id: thirdAdmin._id }).exec()
          .then((foundAdmin) => {
            expect(foundAdmin!.businessAccountId).to.be.an("object");
            expect(foundAdmin!.businessAccountId).to.eql(firstAdminsBusinessAccount._id);
            done();
          })
          .catch((error) => {
            done(error);
          });
      })
      it("Should NOT change the number 'BusinessAccount' models in the database", (done) => {
        BusinessAccount.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfBusinessAccounts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST EDIT ACTION admin logged in with business account add a single admin //

    // TEST PATCH EDIT ACTION admin logged in with business account own account adding an admin with account //
    describe("PATCH '/api/business_accounts/edit/:businessAcctId' - EDIT action on own account - Adding A single 'Admin' to account who DOES have an account", () => {
      
      it("Should NOT update, NOT return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/business_accounts/edit/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": firstAdminsToken })
          .send({
            newAdmins: [ secondAdmin._id ]
          })
          .end((err, res) => {
            if(err) done(err);
            // assert correct rendering //
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(2);
            expect(res.body.editedBusinessAccount).to.be.undefined;
            done();
          });
      });
      it("Should NOT update the 'BusinessAccount' model in the database", (done) => {
        BusinessAccount.findOne({ _id: firstAdminsBusinessAccount._id }).exec()
          .then((businessAccount) => {
            expect(businessAccount!.linkedAdmins.length).to.equal(2);
            expect(businessAccount!.linkedAdmins.includes(firstAdmin._id)).to.equal(true);
            expect(businessAccount!.linkedAdmins.includes(thirdAdmin._id)).to.equal(true);
            expect(businessAccount!.linkedAdmins.includes(secondAdmin._id)).to.equal(false);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT update the queried 'Administrator' model in the database", (done) => {
        Administrator.findOne({ _id: secondAdmin._id }).exec()
          .then((foundAdmin) => {
            expect(foundAdmin!.businessAccountId).to.be.an("object");
            expect(foundAdmin!.businessAccountId).to.eql(secondAdminsBusinessAccount._id);
            done();
          })
          .catch((error) => {
            done(error);
          });
      })
      it("Should NOT change the number 'BusinessAccount' models in the database", (done) => {
        BusinessAccount.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfBusinessAccounts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END PATCH EDIT ACTION admin logged in with business account own account adding an admin with account //

    // TEST PATCH EDIT ACTION admin logged in and removing an admin from business account //
    describe("PATCH '/api/business_accounts/edit/:businessAcctId' - EDIT action on own account - Removing an 'Admin' from 'BusinessAccount'", () => {
      
      it("Should correctly update, return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/business_accounts/edit/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": firstAdminsToken })
          .send({
            adminsToRemove: [ thirdAdmin._id ]
          })
          .end((err, res) => {
            if(err) done(err);
            // assert correct rendering //
            editedAccount = res.body.editedBusinessAccount;
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.editedBusinessAccount).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should return correctly linked 'editedBusinessAccount' in response", () => {
        const { linkedAdmins, linkedStores, linkedProducts, linkedServices } = editedAccount;
        expect(linkedAdmins.length).to.equal(1);
        expect(linkedStores.length).to.equal(populatedBusinessAccount.linkedStores.length);
        expect(linkedServices.length).to.equal(populatedBusinessAccount.linkedServices.length);
        expect(linkedProducts.length).to.equal(populatedBusinessAccount.linkedProducts.length);
      });
      it("Should return correct data in linked 'editedBusinessAccount' in response", () => {
        const { linkedAdmins, linkedStores, linkedProducts, linkedServices } = editedAccount;
        for (const admin of linkedAdmins as IAdministrator[]) {
          expect(admin._id).to.not.equal((thirdAdmin._id as Types.ObjectId).toHexString());
        }
        for (const store of linkedStores as IStore[]) {
          expect(store).to.be.an("object");
        }
        for (const product of linkedProducts) {
          expect(product).to.be.an("object");
        }
        for (const service of linkedServices) {
          expect(service).to.be.an("object");
        }
      });
      it("Should correctly update the 'BusinessAccount' model in the database", (done) => {
        BusinessAccount.findOne({ _id: firstAdminsBusinessAccount._id }).exec()
          .then((businessAccount) => {
            expect(businessAccount!.linkedAdmins.length).to.equal(1);
            expect(businessAccount!.linkedAdmins.includes(firstAdmin._id)).to.equal(true);
            expect(businessAccount!.linkedAdmins.includes(thirdAdmin._id)).to.equal(false);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should correctly update the queried 'Administrator' model in the database", (done) => {
        Administrator.findOne({ _id: thirdAdmin._id }).exec()
          .then((foundAdmin) => {
            expect(foundAdmin!.businessAccountId).to.be.null;
            done();
          })
          .catch((error) => {
            done(error);
          })
      })
      it("Should NOT change the number 'BusinessAccount' models in the database", (done) => {
        BusinessAccount.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfBusinessAccounts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST PATCH EDIT ACTION admin logged in and removing an admin from business account //

    // TEST PATCH EDIT ACTION admin logged in with business account own account adding an admin with account //
    describe("PATCH '/api/business_accounts/edit/:businessAcctId' - EDIT action on own account - Adding A single 'Admin' to account who has already been added", () => {
      
      it("Should NOT update, NOT return a 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/business_accounts/edit/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": firstAdminsToken })
          .send({
            newAdmins: [ firstAdmin._id ]
          })
          .end((err, res) => {
            if(err) done(err);
            // assert correct rendering //
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(2);
            expect(res.body.editedBusinessAccount).to.be.undefined;
            done();
          });
      });
      it("Should NOT update the 'BusinessAccount' model in the database", (done) => {
        BusinessAccount.findOne({ _id: firstAdminsBusinessAccount._id }).exec()
          .then((businessAccount) => {
            expect(businessAccount!.linkedAdmins.length).to.equal(1);
            expect(businessAccount!.linkedAdmins.includes(firstAdmin._id)).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT update or alter the queried 'Administrator' model in the database", (done) => {
        Administrator.findOne({ _id: firstAdmin._id }).exec()
          .then((foundAdmin) => {
            expect(foundAdmin!.businessAccountId).to.eql(firstAdmin.businessAccountId);
            done();
          })
          .catch((err) => {
            done(err);
          })
      })
      it("Should NOT change the number 'BusinessAccount' models in the database", (done) => {
        BusinessAccount.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfBusinessAccounts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST PATCH EDIT ACTION admin logged in with business account own account adding an admin with account //

    // TEST PATCH EDIT ACTIOn admin logged in own account and removing last admin //
    describe("PATCH '/api/business_accounts/edit/:businessAcctId' - EDIT action on own account - removing the last admin", () => {
      
      it("Should NOT remove an 'Administrator', NOT return updated 'BusinessAccount' model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/business_accounts/edit/" + (firstAdminsBusinessAccount._id as string))
          .set({ "Authorization": firstAdminsToken })
          .send({
            adminsToRemove: [ firstAdmin._id ]
          })
          .end((err, res) => {
            if(err) done(err);
            // assert correct rendering //
            expect(res.status).to.equal(422);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(2);
            expect(res.body.editedBusinessAccount).to.be.undefined;
            done();
          });
      });
      it("Should NOT update the 'BusinessAccount' model in the database", (done) => {
        BusinessAccount.findOne({ _id: firstAdminsBusinessAccount._id }).exec()
          .then((businessAccount) => {
            expect(businessAccount!.linkedAdmins.length).to.equal(1);
            expect(businessAccount!.linkedAdmins.includes(firstAdmin._id)).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT update the queried 'Administrator' model in the database", (done) => {
        Administrator.findOne({ _id: firstAdmin._id }).exec()
          .then((foundAdmin) => {
            expect(foundAdmin!.businessAccountId).to.be.an("object");
            expect((foundAdmin!.businessAccountId as Types.ObjectId).equals(firstAdminsBusinessAccount._id)).to.equal(true);
            done();
          })
          .catch((error) => {
            done(error);
          })
      })
      it("Should NOT change the number 'BusinessAccount' models in the database", (done) => {
        BusinessAccount.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfBusinessAccounts);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST PATCH EDIT ACTIOn admin logged in own account and removing last admin //

  });
  // END CONTEXT 'BusinessAccountsController' API tests admin not logged in //

  // CONTEXT 'BusinessAccountsController' detailed API tests for DELETE action  admin is logged in //
  context("'BusinessAccountsController' API tets - ADMIN LOGGED IN - WITH BUSINESS ACCOUNT - Accessing other admins account - detailed DELETE tests", () => {

    // TEST DELETE action on a populated business account, not own account //
    describe("DELETE '/api/business_accounts/edit/:businessAcctId' - DELETE action on NOT own account", () => {

      it("Should NOT delete the account, should NOT update anything and send back the correct response", (done) => {
        chai.request(server)
          .delete("/api/business_accounts/delete/" + (populatedBusinessAccount._id as string))
          .set({
            "Authorization": secondAdminsToken
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.errorMessages.length).to.equal(1);
            expect(res.body.deletedBusinessAccount).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter the 'BusinessAccount' model in the database any way", (done) => {
        BusinessAccount.findOne({ _id: populatedBusinessAccount._id })
          .populate({ path: "linkedAdmins", model: "Administrator" })
          .populate({ path: "linkedStores", model: "Store" })
          .populate({ path: "linkedServices", model: "Service" })
          .populate({ path: "linkedProducts", model: "Product" })
          .exec()
          .then((foundAccount) => {
            const { linkedAdmins, linkedStores, linkedServices, linkedProducts } = populatedBusinessAccount;
            expect(foundAccount!.linkedAdmins.length).to.equal(linkedAdmins.length);
            expect(foundAccount!.linkedStores.length).to.equal(linkedStores.length);
            expect(foundAccount!.linkedServices.length).to.equal(linkedServices.length);
            expect(foundAccount!.linkedProducts.length).to.equal(linkedProducts.length);
            // ensure that populated data is the same //
            for (let i = 0; i < linkedAdmins.length; i++) {
              expect(JSON.stringify(linkedAdmins[i])).to.equal(JSON.stringify(foundAccount!.linkedAdmins[i]));
            }
            for (let i = 0; i < linkedStores.length; i++) {
              expect(JSON.stringify(linkedStores[i])).to.equal(JSON.stringify(foundAccount!.linkedStores[i]));
            }
            for (let i = 0; i < linkedServices.length; i++) {
              expect(JSON.stringify(linkedServices[i])).to.equal(JSON.stringify(foundAccount!.linkedServices[i]));
            }
            for (let i = 0; i < linkedProducts.length; i++) {
              expect(JSON.stringify(linkedProducts[i])).to.equal(JSON.stringify(foundAccount!.linkedProducts[i]));
            }
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT remove any of 'Administrator' models linked to the queried 'BusinessAccount' model", (done) => {
        const admins: IAdministrator[] = populatedBusinessAccount.linkedAdmins as IAdministrator[];
        const adminIDs: Types.ObjectId[] = admins.map((admin) => admin._id as Types.ObjectId);
        
        Administrator.find({ _id: { $in: adminIDs } }).exec()
          .then((foundAdmins) => {
            expect(foundAdmins!.length).to.equal(admins.length);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT remove any of 'Store' models linked to the queried 'BusinessAccount' model", (done) => {
        const stores: IStore[] = populatedBusinessAccount.linkedStores as IStore[];
        const storeIDs: Types.ObjectId[] = stores.map((store) => store._id as Types.ObjectId);

        Store.find({ _id: { $in: storeIDs } }).exec()
          .then((foundStores) => {
            expect(foundStores!.length).to.equal(stores.length);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT remove any of 'Service' models linked to the queried 'BusinessAccount' model", (done) => {
        const services: IService[] = populatedBusinessAccount.linkedServices as IService[];
        const serviceIDs: Types.ObjectId[] = services.map((service) => service._id as Types.ObjectId);

        Service.find({ _id: { $in: serviceIDs } }).exec()
          .then((foundServices) => {
            expect(foundServices!.length).to.equal(services.length);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT remove any of 'Product' models linked to the queried 'BusinessAccount' model", (done) => {
        const products: IProduct[] = populatedBusinessAccount.linkedProducts as IProduct[];
        const productIDs: Types.ObjectId[] = products.map((product) => product._id as Types.ObjectId);

        Product.find({ _id: { $in: productIDs } }).exec()
          .then((foundProducts) => {
            expect(foundProducts!.length).to.equal(products.length);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT remove any of 'StoreImage' models belonging to the queried 'BusinessAccount'", (done) => {
        StoreImage.find({ businessAccountId: populatedBusinessAccount._id }).exec()
          .then((foundStoreImages) => {
            expect(foundStoreImages.length).to.equal(accountsStoreImages.length);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT remove any of 'StoreItemImage' models belonging to the queried 'BusinessAccount'", (done) => {
        StoreItemImage.find({ businessAccountId: populatedBusinessAccount._id }).exec()
          .then((foundStoreItemImages) => {
            expect(foundStoreItemImages.length).to.equal(accountsStoreItemImages.length);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT remove any of 'ServiceImage' models belonging to the queried 'BusinessAccount'", (done) => {
        ServiceImage.find({ businessAccountId: populatedBusinessAccount._id }).exec()
          .then((foundServiceImages) => {
            expect(foundServiceImages.length).to.equal(accountsServiceImages.length);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT remove any of 'ProductImage' models belonging to the queried 'BusinessAccount'", (done) => {
        ProductImage.find({ businessAccountId: populatedBusinessAccount._id }).exec()
          .then((foundProductImages) => {
            expect(foundProductImages.length).to.equal(accountsProductImages.length);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT delete any of 'StoreImage' uploads from the image directories", () => {
        for (const image of accountsStoreImages) {
          const stats = fs.statSync(image.absolutePath);
          expect(stats.isFile()).to.equal(true);
        }
      });
      it("Should NOT delete any of 'StoreItemImage' uploads from the image directories", () => {
        for (const image of accountsStoreItemImages) {
          const stats = fs.statSync(image.absolutePath);
          expect(stats.isFile()).to.equal(true);
        }
      })
      it("Should NOT delete any of 'ServiceImage' uploads from the image directories", () => {
        for (const image of accountsServiceImages) {
          const stats = fs.statSync(image.absolutePath);
          expect(stats.isFile()).to.equal(true);
        }
      });
      it("Should NOT delete any of 'ProductImage' uploads from the image directories", () => {
        for (const image of accountsProductImages) {
          const stats = fs.statSync(image.absolutePath);
          expect(stats.isFile()).to.equal(true);
        }
      });

    });
    // END TEST DELETE action on a populated business account, not own account //

    // TEST DELETE action on a populated business account on own account //
    describe("DELETE '/api/business_accounts/edit/:businessAcctId' - DELETE action on own account populated account", () => {

      it("Should NOT delete the account, should NOT update anything and send back the correct response", (done) => {
        chai.request(server)
          .delete("/api/business_accounts/delete/" + (populatedBusinessAccount._id as string))
          .set({
            "Authorization": firstAdminsToken
          })
          .end((err, res) => {
            if (err) done(err);
            console.log(res.body);
            expect(res.status).to.equal(200);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.deletedBusinessAccount).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      
    });
    // END TEST DELETE action on a populated business account on own account //


  });
  // END  CONTEXT 'BusinessAccountsController' detailed API tests for DELETE action  admin is logged in //


});