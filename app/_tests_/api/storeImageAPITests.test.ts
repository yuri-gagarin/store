// StoreImage API tests //
import chaiHTTP from "chai-http";
import fs from "fs";
import chai,  { expect } from "chai";
import faker from "faker";
import path from "path";
// server, models //
import server from "../../server";
import Store, { IStore } from "../../models/Store";
import StoreImage, { IStoreImage } from "../../models/StoreImage";
// helpers //
import { clearDB } from "../helpers/dbHelpers";

chai.use(chaiHTTP);

describe("StoreImage API tests", () => {
  let createdStore: IStore; let createdImage: IStoreImage;
  let storeImageModelCount: number; let storeImagesCount: number;

  before((done) => { 
    Store.create({
      title: faker.lorem.word(),
      description: faker.lorem.paragraphs(2),
      images: []
    })
    .then((store) => {
      createdStore = store;
    })
    .then(() => StoreImage.countDocuments())
    .then((number) => { 
      storeImageModelCount = number; 
      storeImagesCount = createdStore.images.length;
      done() 
    })
    .catch((error) => { done(error) });
  });
  after((done) => {
    clearDB().then(() => { done() }).catch((err) => { done(err) });

  });

  describe("POST '/api/store_images/upload'", () => {
    let updatedStore: IStore; 
    it("Should successfully upload and create StoreImage model", (done) => {
      chai.request(server)
        .post("/api/uploads/store_images/" + createdStore._id)
        .attach("storeImage", fs.readFileSync(`${__dirname}/test_images/test.jpg`), "test.jpg")
        .end((err, response) => {
          if (err) { console.error(err); done(err) };
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          expect(response.body.newStoreImage).to.be.an("object");
          expect(response.body.updatedStore).to.be.an("object");
          createdImage = response.body.newStoreImage;
          updatedStore = response.body.updatedStore;
          done();
        });
    });
    it("Should set the correct storeId property on {StoreImage} model", (done) => {
      expect(createdImage.storeId).to.equal(updatedStore._id);
      done();
    });
    it("Should place the image into the correct directory", (done) => {
      fs.access(createdImage.absolutePath, (err) => {
        expect(err).to.equal(null);
        done();
      });
    });
    it("Should INCREASE the number of {StoreImage(s)} by 1", (done) => {
      StoreImage.countDocuments()
        .then((number) => {
          expect(number).to.equal(storeImageModelCount + 1);
          storeImageModelCount = number;
          done();
        })
        .catch((err) => { done(err) });
    });
    it("Should return the updated {Store} object with image data in it", (done) => {
      const newImages = updatedStore.images!.filter((image) => (image as IStoreImage)._id === createdImage._id);
      expect(newImages.length).to.equal(1);
      done();
    });
    it("Should INCREASE the number of images in updated {Store} by 1", (done) => {
      expect(updatedStore.images.length).to.equal(storeImagesCount + 1);
      storeImagesCount = updatedStore.images.length;
      done();
    });

  });

  describe("DELETE '/api/store_images/upload'", () => {
    let updatedStore: IStore; let deletedImage: IStoreImage;

    it("Should successfully remove an image and destroy the StoreImage model", (done) => {
      chai.request(server)
        .delete("/api/uploads/store_images/" + createdImage._id + "/" + createdImage.storeId)
        .end((err, response) => {
          if (err) { done(err) };
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          expect(response.body.deletedStoreImage).to.be.an("object");
          expect(response.body.updatedStore).to.be.an("object");
          deletedImage = response.body.deletedStoreImage;
          updatedStore = response.body.updatedStore;
          done();
        });
    });
    it("Should delete the image from its directory", (done) => {
      const imagePath = path.join(__dirname, "/../../../", deletedImage.absolutePath);
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        expect(err!.code).to.equal("ENOENT");
        done();
      });
    });
    it("Should DECREASE the number of {StoreImage(s)} by 1", (done) => {
      StoreImage.countDocuments()
        .then((number) => {
          expect(number).to.equal(storeImageModelCount - 1);
          storeImageModelCount = number;
          done();
        })
        .catch((err) => { done(err) });
    });
    it("Should return the updated {Store} object without image data in it", (done) => {
      const img = updatedStore.images.filter((image) => (image as IStoreImage)._id === deletedImage._id);
      expect(img.length).to.equal(0);
      done();
    });
    it("Should DECREASE the number of images in the updated {Store} by 1", (done) => {
      expect(updatedStore.images.length).to.equal(storeImagesCount - 1);
      storeImagesCount = updatedStore.images.length;
      done();
    });

  });
});