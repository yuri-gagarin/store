// StoreItemImage API tests //
import chaiHTTP from "chai-http";
import fs from "fs";
import chai, { expect } from "chai";
import path from "path";
// server, models //
import server from "../../server";
import { IStoreItem } from "../../models/StoreItem";
import StoreItemImage, { IStoreItemImage } from "../../models/StoreItemImage";
// helpers //
import {  setupDB, clearDB } from "../helpers/dbHelpers";
import { createStoreItems, createStores } from "../helpers/dataGeneration";

chai.use(chaiHTTP);

describe("StoreItemImage API tests", () => {
  let createdStoreItem: IStoreItem; let createdImage: IStoreItemImage;
  let storeItemsImageModelCount: number; let storeItemsImagesCount: number;
  let storeId: string;

  before((done) => {
    setupDB()
      .then(() => createStores(1))
      .then((stores) => {
        storeId = stores[0]._id;
        return createStoreItems(1, storeId);
      })
      .then((storeItems) => {
        createdStoreItem = storeItems[0];
        return StoreItemImage.countDocuments();
      })
      .then((number) => {
        storeItemsImageModelCount = number;
        storeItemsImagesCount = createdStoreItem.images.length;
        done();
      })
      .catch((error) => { done(error); });
  });

  after((done) => { 
    clearDB().then(() => { done(); }).catch((err) => { done(err); });
  });

  // BEGIN POST tests //
  describe("POST '/api/uploads/store_item_images/:_store_item_id", () => {
    let updatedStoreItem: IStoreItem;

    it("Should successfully upload {StoreItemImage}", (done) => {
      chai.request(server)
        .post("/api/uploads/store_item_images" + "/" + createdStoreItem._id)
        .attach("storeItemImage", fs.readFileSync(`${__dirname}/test_images/test.jpg`), "test.jpg")
        .end((err, response) => {
          if (err) { console.error(err); done(err);}
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          expect(response.body.responseMsg).to.be.a("string");
          expect(response.body.newStoreItemImage).to.be.an("object");
          expect(response.body.updatedStoreItem).to.be.an("object");
          createdImage = response.body.newStoreItemImage;
          updatedStoreItem = response.body.updatedStoreItem;
          done();
        });
    });
    it("Should respond with correct image", (done) => {
      chai.request(server)
        .get(createdImage.url)
        .end((err, response) => {
          if (err) {
            done(err)
          }
          expect(response.type).to.equal("image/jpeg");
          done();
        });
    });
    it("Should set the correct storeItemId property on {StoreItemImage} model", (done) => {
      expect(createdImage.storeItemId).to.equal(updatedStoreItem._id);
      done();
    });
    it("Should place the image into the correct directory with correct file name", (done) => {
      const imageDirectory = path.join(path.resolve(), "public", "uploads", "store_item_images", createdStoreItem._id.toString())
      fs.readdir(imageDirectory, (err, files) => {
        expect(err).to.equal(null);
        expect(files.length).to.equal(1);
        expect(files[0]).to.equal(createdImage.fileName);
        done();
      });
    });
    it("Should set the correct absolute path on the Image model", (done) => {
      fs.access(createdImage.absolutePath, fs.constants.R_OK | fs.constants.F_OK, (err) => {
        expect(err).to.equal(null);
        done();
      });
    });
    it("Should INCREASE the number of {StoreItemImages} by 1", (done) => {
      StoreItemImage.countDocuments()
        .then((number) => {
          expect(number).to.equal(storeItemsImageModelCount + 1);
          storeItemsImageModelCount = number;
          done();
        })
        .catch((err) => { done(err); });
    });
    it("Should return the updated {StoreItem} object with image data in it", (done) => {
      const newImages = updatedStoreItem.images.filter((image) => (image as IStoreItemImage)._id === createdImage._id);
      expect(newImages.length).to.equal(1);
      done();
    });
    it("Should INCREASE the number of images in updated {StoreItem} by 1", (done) => {
      expect(updatedStoreItem.images.length).to.equal(storeItemsImagesCount + 1);
      storeItemsImagesCount = updatedStoreItem.images.length;
      done();
    });
  });
  // END POST tests
  // BEGIN DELETE tests //
  describe("DELETE '/api/uploads/storeItems_images/:_imgId/:_storeItemsId", () => {
    let updatedStoreItem: IStoreItem; let deletedImage: IStoreItemImage;

    it("Should successfully remove an image", (done) => {
      chai.request(server)
        .delete("/api/uploads/store_item_images/" + createdImage._id + "/" + createdImage.storeItemId)
        .end((err, response) => {
          if (err) { console.error(err); done(err); }
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          expect(response.body.responseMsg).to.be.a("string");
          expect(response.body.deletedStoreItemImage).to.be.an("object");
          expect(response.body.updatedStoreItem).to.be.an("object");
          deletedImage = response.body.deletedStoreItemImage;
          updatedStoreItem = response.body.updatedStoreItem;
          done();
        });
    });
    it("Should delete the image from its directory", (done) => {
      const imagePath = deletedImage.absolutePath;
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        expect(err!.code).to.equal("ENOENT");
        done();
      });
    });
    it("Should DECREASE the number of {StoreItemImage(s)} by 1", (done) => {
      StoreItemImage.countDocuments()
        .then((number) => {
          expect(number).to.equal(storeItemsImageModelCount - 1);
          storeItemsImageModelCount = number;
          done();
        })
        .catch((err) => { done(err); });
    });
    it("Should return the updated {StoreItem} object with image date in it", (done) => {
      const img = updatedStoreItem.images.filter((image) => (image as IStoreItemImage)._id === deletedImage._id);
      expect(img.length).to.equal(0);
      done();
    });
    it("Should DECREASE the number of images in the updated {StoreItem} by 1", (done) => {
      expect(updatedStoreItem.images.length).to.equal(storeItemsImagesCount - 1);
      storeItemsImagesCount - updatedStoreItem.images.length;
      done();
    });

  });
  // END DELETE tests //
});