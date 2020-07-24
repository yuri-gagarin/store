import faker from "faker";
import { expect } from "chai";
import { Types } from "mongoose";
import StoreItemImage, { IStoreItemImage } from "../../../models/StoreItemImage";
// helpers //
import { setupDB, clearDB } from "../../helpers/dbHelpers";

describe("StoreItemImage Unit Tests", () => {
  before((done) => {
    setupDB().then(() => done()).catch((err) => done(err));
  });
  const storeItemImage = {
    description: faker.lorem.sentence(),
    storeItemId: Types.ObjectId(),
    url: faker.internet.url(),
    fileName: faker.image.imageUrl(),
    imagePath: faker.image.imageUrl(),
    absolutePath: faker.random.word()
  };
  describe("Create StoreItemImage Test", () => {
    describe("Valid StoreItemImage Data", () => {
      let createdStoreItemImage: IStoreItemImage;
      it("Should create a StoreItemImage", (done) => {
        StoreItemImage.create(storeItemImage)
          .then((createdImg) => {
            createdStoreItemImage = createdImg;
            expect(createdImg instanceof StoreItemImage).to.eq(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should have valid properties", (done) => {
        expect(createdStoreItemImage.description).to.be.a("string");
        expect(createdStoreItemImage.storeItemId).to.be.an("object");
        expect(createdStoreItemImage.url).to.be.a("string");
        expect(createdStoreItemImage.fileName).to.be.a("string");
        expect(createdStoreItemImage.imagePath).to.be.a("string");
        expect(createdStoreItemImage.absolutePath).to.be.a("string");
        done();
      });
    });
    describe("Invalid StoreItemImage Data", () => {
      it("Should NOT create a new {StoreItemImage} without a storeItemId property", (done) => {
        StoreItemImage.create({ ...storeItemImage, storeItemId: undefined })
          .catch((err) => {
            expect(err).to.not.be.undefined;
            expect(err).to.be.an("object");
            done();
          });
      });
      it("Should NOT create a new {StoreItemImage} without a URL property", (done) => {
        StoreItemImage.create({ ...storeItemImage, url: "" })
          .catch((err) => {
            expect(err).to.not.be.undefined;
            expect(err).to.be.an("object");
            done();
          });
      });
      it ("Should NOT create a new {StoreItemImage} without a fileName property", (done) => {
        StoreItemImage.create({ ...storeItemImage, fileName: "" })
          .catch((err) => {
            expect(err).to.not.be.undefined;
            expect(err).to.be.an("object");
            done();
          });
      });
      it("Should NOT create a new {StoreItemImage} without an imagePath property", (done) => {
        StoreItemImage.create({ ...storeItemImage, imagePath: ""})
          .catch((err) => {
            expect(err).to.not.be.undefined;
            expect(err).to.be.an("object");
            done();
          });
      });
      it("Should NOT create a new {StoreItemImage} without an absolutePath property", (done) => {
        StoreItemImage.create({ ...storeItemImage, absolutePath: ""})
          .catch((err) => {
            expect(err).to.not.be.undefined;
            expect(err).to.be.an("object");
            done();
          });
      });
    });
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
});

