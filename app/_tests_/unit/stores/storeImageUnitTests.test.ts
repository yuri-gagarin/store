import faker from "faker";
import { expect } from "chai";
import { Types } from "mongoose";
import StoreImage, { IStoreImage } from "../../../models/StoreImage";
// helpers //
import { setupDB, clearDB } from "../../helpers/dbHelpers";

describe("StoreImage Unit Tests", () => {
  before((done) => {
    setupDB().then(() => done()).catch((err) => done(err));
  });
  const storeImage = {
    description: faker.lorem.sentence(),
    storeId: Types.ObjectId(),
    url: faker.internet.url(),
    fileName: faker.image.imageUrl(),
    imagePath: faker.image.imageUrl(),
    absolutePath: faker.random.word()
  };
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  
  describe("Create StoreImage Test", () => {
    describe("Valid StoreImage Data", () => {
      let createdStoreImage: IStoreImage;
      it("Should create a StoreImage", (done) => {
        StoreImage.create(storeImage)
          .then((createdImg) => {
            createdStoreImage = createdImg;
            expect(createdImg instanceof StoreImage).to.eq(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should have valid properties", (done) => {
        expect(typeof createdStoreImage.description).to.eq("string");
        expect(typeof createdStoreImage.storeId).to.eq("object");
        expect(typeof createdStoreImage.url).to.eq("string");
        expect(typeof createdStoreImage.fileName).to.eq("string");
        expect(typeof createdStoreImage.imagePath).to.eq("string");
        expect(typeof createdStoreImage.absolutePath).to.eq("string");
        done();
      });
    });
    describe("Invalid StoreImage Data", () => {
      it("Should NOT create a new {StoreImage} without a storeId property", (done) => {
        StoreImage.create({ ...storeImage, storeId: undefined })
          .catch((err) => {
            expect(err).to.not.be.undefined;
            expect(err).to.be.an("object");
            done();
          });
      });
      it("Should NOT create a new {StoreImage} without a URL property", (done) => {
        StoreImage.create({ ...storeImage, url: "" })
          .catch((err) => {
            expect(err).to.not.be.undefined;
            expect(err).to.be.an("object");
            done();
          });
      });
      it ("Should NOT create a new {StoreImage} without a fileName property", (done) => {
        StoreImage.create({ ...storeImage, fileName: "" })
          .catch((err) => {
            expect(err).to.not.be.undefined;
            expect(err).to.be.an("object");
            done();
          });
      });
      it("Should NOT create a new {StoreImage} without an imagePath property", (done) => {
        StoreImage.create({ ...storeImage, imagePath: ""})
          .catch((err) => {
            expect(err).to.not.be.undefined;
            expect(err).to.be.an("object");
            done();
          });
      });
      it("Should NOT create a new {StoreImage} without an absolutePath property", (done) => {
        StoreImage.create({ ...storeImage, absolutePath: ""})
          .catch((err) => {
            expect(err).to.not.be.undefined;
            expect(err).to.be.an("object");
            done();
          });
      });
    });
  });
  
});

