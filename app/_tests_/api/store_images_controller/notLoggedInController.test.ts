import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// 
import fs from "fs";
import path from "path";
// server import //
import server from "../../../server";
// models and model interfaces //
import Store, { IStore } from "../../../models/Store";
import StoreImage, { IStoreImage } from "../../../models/StoreImage";
// helpers //
import { isEmptyObj } from "../../../controllers/helpers/queryHelpers";
import { Types } from "mongoose";
chai.use(chaiHTTP);

describe("StoreImagesUplController - NOT LOGGED IN - POST/DELETE API tests", () => {
  let firstAdminsStore: IStore;
  let firstAdminsStoreImage: IStoreImage;
  let storeImageModelCount: number;

  before(() => {

  })

  describe("POST '/api/store_images/upload' - Multer Upload and CREATE_IMAGE action", () => {
    let updatedStore: IStore; let imageDirectory: string;
    it("Should NOT  upload and create StoreImage model", (done) => {
      chai.request(server)
        .post("/api/uploads/store_images/" + firstAdminsStore._id)
        .set({ "Authorization": "" })
        .attach("storeImage", fs.readFileSync(`${__dirname}/test_images/test.jpg`), "test.jpg")
        .end((err, response) => {
          if (err) { console.error(err); done(err); }
          expect(response.status).to.equal(401);
          expect(response.error.text).to.equal("Unauthorized");
          expect(isEmptyObj(response.body)).to.equal(true);
          done();
        });
    });
    
    it("Should place the image into the correct directory with correct file name", (done) => {
      imageDirectory = path.join(path.resolve(), "public", "uploads", "store_images", firstAdminsStore._id.toString())
      fs.readdir(imageDirectory, (err, files) => {
        if(err) done(err);
        expect(err).to.equal(null);
        expect(files.length).to.equal(0);
        done();
      });
    });
    it("Should NOT INCREASE the number of {StoreImage(s)} by 1", (done) => {
      StoreImage.countDocuments().exec()
        .then((number) => {
          expect(number).to.equal(storeImageModelCount);
          done();
        })
        .catch((err) => done(err));
    });
    it("Should NOT INCREASE the number of images in the queried Store model", (done) => {
      Store.findOne({ _id: firstAdminsStore._id }).exec()
        .then((foundStore) => {
          expect(foundStore.images.length).to.equal(firstAdminsStore.images.length);
          done();
        })
        .catch((err) => {
          done(err);
        })  
    });

  });

  describe("DELETE '/api/store_images/upload'", () => {

    it("Should successfully remove an image and destroy the StoreImage model", (done) => {
      chai.request(server)
        .delete("/api/uploads/store_images/" + firstAdminsStore._id + "/" + firstAdminsStore._id)
        .end((err, response) => {
          if (err) done(err);
          // assert correct reponse //
          expect(response.status).to.equal(401);
          expect(isEmptyObj(response.body)).to.equal(true);
          done();
        });
    });
    /*
    it("Should NOT delete the image from its directory", (done) => {
      const imagePath = deletedImage.absolutePath;
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        expect(err).to.be.undefined;
        done();
      });
    });
    */
    it("Should NOT remove the 'StoreImage' model from the database", (done) => {
      StoreImage.exists({ _id: firstAdminsStoreImage._id })
        .then((exists) => {
          expect(exists).to.equal(true);
          done();
        })
        .catch((err) => {
          done(err);
        });
    })
    it("Should NOT DECREASE the number of 'StoreImage' model by 1", (done) => {
      StoreImage.countDocuments().exec()
        .then((number) => {
          expect(number).to.equal(storeImageModelCount);
          done();
        })
        .catch((err) => { done(err); });
    });
    it("Should NOT remove the StoreImage id from the queried 'Store' model", (done) => {
      Store.findOne({ _id: firstAdminsStore._id }).exec()
        .then((store) => {
          const imgId = store.images.filter((imgId: Types.ObjectId) => imgId.equals(firstAdminsStoreImage._id));
          expect(imgId.length).to.equal(1);
          done();
        })
        .catch((err) => {
          done(err);
        })
    });
   

  });
})