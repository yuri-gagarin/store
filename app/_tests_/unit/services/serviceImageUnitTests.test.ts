import faker from "faker";
import { expect } from "chai";
import { Types } from "mongoose";
import ServiceImage, { IServiceImage } from "../../../models/ServiceImage";
// helpers //
import { setupDB, clearDB } from "../../helpers/dbHelpers";

describe("ServiceImage Unit Tests", () => {
  before((done) => {
    setupDB().then(() => done()).catch((err) => done(err));
  });
  const serviceImage = {
    description: faker.lorem.sentence(),
    serviceId: Types.ObjectId(),
    url: faker.internet.url(),
    fileName: faker.image.imageUrl(),
    imagePath: faker.image.imageUrl(),
    absolutePath: faker.random.word()
  };
  describe("Create ServiceImage Test", () => {
    describe("Valid ServiceImage Data", () => {
      let createdServiceImage: IServiceImage;
      it("Should create a ServiceImage", (done) => {
        ServiceImage.create(serviceImage)
          .then((createdImg) => {
            createdServiceImage = createdImg;
            expect(createdImg instanceof ServiceImage).to.eq(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should have valid properties", (done) => {
        expect(typeof createdServiceImage.description).to.eq("string");
        expect(typeof createdServiceImage.serviceId).to.eq("object");
        expect(typeof createdServiceImage.url).to.eq("string");
        expect(typeof createdServiceImage.fileName).to.eq("string");
        expect(typeof createdServiceImage.imagePath).to.eq("string");
        expect(typeof createdServiceImage.absolutePath).to.eq("string");
        done();
      });
    });
    describe("Invalid ServiceImage Data", () => {
      it("Should NOT create a new {ServiceImage} without a serviceId property", (done) => {
        ServiceImage.create({ ...serviceImage, serviceId: undefined })
          .catch((err) => {
            expect(err).to.not.be.undefined;
            expect(err).to.be.an("object");
            done();
          });
      });
      it("Should NOT create a new {ServiceImage} without a URL property", (done) => {
        ServiceImage.create({ ...serviceImage, url: "" })
          .catch((err) => {
            expect(err).to.not.be.undefined;
            expect(err).to.be.an("object");
            done();
          });
      });
      it ("Should NOT create a new {ServiceImage} without a fileName property", (done) => {
        ServiceImage.create({ ...serviceImage, fileName: "" })
          .catch((err) => {
            expect(err).to.not.be.undefined;
            expect(err).to.be.an("object");
            done();
          });
      });
      it("Should NOT create a new {ServiceImage} without an imagePath property", (done) => {
        ServiceImage.create({ ...serviceImage, imagePath: ""})
          .catch((err) => {
            expect(err).to.not.be.undefined;
            expect(err).to.be.an("object");
            done();
          });
      });
      it("Should NOT create a new {ServiceImage} without an absolutePath property", (done) => {
        ServiceImage.create({ ...serviceImage, absolutePath: ""})
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

