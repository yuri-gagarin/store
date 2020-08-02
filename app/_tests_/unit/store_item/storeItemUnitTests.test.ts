import faker from "faker";
import { expect } from "chai";
import StoreItem, { IStoreItem } from "../../../models/StoreItem";
import mongoose, { Error }from "mongoose";
// helpers //
import { setupDB, clearDB } from "../../helpers/dbHelpers";

describe("StoreItem Unit Tests", () => {
  before((done) => {
    setupDB().then(() => done()).catch((err) => done(err));
  });
  const mockStoreItem = {
    storeId: mongoose.Types.ObjectId(),
    storeName: faker.lorem.word(),
    name: faker.lorem.words(2),
    details: faker.lorem.paragraph(),
    description: faker.lorem.paragraph(4),
    price: 100,
    categories: [faker.lorem.word()],
    images: []
  };
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  describe("Valid StoreItem Data", () => {
   
    let createdStoreItem: IStoreItem;

    it("Should create a StoreItem", (done) => {
      StoreItem.create(mockStoreItem)
        .then((service) => {
          createdStoreItem = service;
          expect(service instanceof StoreItem).to.eq(true);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it("Should have valid properties", (done) => {
      expect(createdStoreItem.name).to.be.a("string");
      expect(createdStoreItem.description).to.be.a("string");
      expect(createdStoreItem.price).to.be.a("string");
      expect(createdStoreItem.categories).to.be.an("array");
      expect(createdStoreItem.images).to.be.an("array");
      done();
    });
  });
  
  describe("Create StoreItem Test", () => {
    describe("Invalid StoreItem Data", () => {
      
      it("Should NOT create a new {StoreItem} without a {storeId} property", (done) => {
        StoreItem.create({ ...mockStoreItem, storeId: "" })
          .catch((err: Error.ValidationError ) => {
            expect(err).to.not.be.undefined;
            expect(err.errors.storeId).to.exist;
            done();
          });
      });
      it("Should NOT create a new {StoreItem} without a {storeName} property", (done) => {
        StoreItem.create({ ...mockStoreItem, storeName: "" })
          .catch((err: Error.ValidationError ) => {
            expect(err).to.not.be.undefined;
            expect(err.errors.storeName).to.exist;
            done();
          });
      });
      it("Should NOT create a new {StoreItem} without a {name} property", (done) => {
        StoreItem.create({ ...mockStoreItem, name: "" })
          .catch((err: Error.ValidationError ) => {
            expect(err).to.not.be.undefined;
            expect(err.errors.name).to.exist;
            done();
          });
      });
      it("Should NOT create a new {StoreItem} without a {details} property", (done) => {
        StoreItem.create({ ...mockStoreItem, details: "" })
          .catch((err: Error.ValidationError) => {
            expect(err).to.not.be.undefined;
            expect(err.errors.details).to.exist;
            done();
          });
      });
      it("Should NOT create a new {StoreItem} without a {price} property", (done) => {
        StoreItem.create({ ...mockStoreItem, price: "" })
          .catch((err: Error.ValidationError) => {
            expect(err).to.not.be.undefined;
            expect(err.errors.price).to.exist;
            done();
          });
      });
    });

  });
});

