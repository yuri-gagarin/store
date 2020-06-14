// ServiceImage API tests //
import chaiHTTP from "chai-http";
import fs from "fs";
import chai, { expect } from "chai";
import path from "path";
// server, models //
import server from "../../server";
import { IService } from "../../models/Service";
import ServiceImage, { IServiceImage } from "../../models/ServiceImage";
// helpers //
import {  setupDB, clearDB } from "../helpers/dbHelpers";
import { createServices } from "../helpers/dataGeneration";

chai.use(chaiHTTP);

describe("ServiceImage API tests", () => {
  let createdService: IService; let createdImage: IServiceImage;
  let serviceImageModelCount: number; let serviceImagesCount: number;

  before((done) => {
    setupDB()
      .then(() => createServices(1))
      .then((services) => {
        createdService = services[0];
        return ServiceImage.countDocuments();
      })
      .then((number) => {
        serviceImageModelCount = number;
        serviceImagesCount = createdService.images.length;
        done();
      })
      .catch((error) => { done(error); });
  });

  after((done) => { 
    clearDB().then(() => { done(); }).catch((err) => { done(err); });
  });

  // BEGIN POST tests //
  describe("POST '/api/uploads/service_images/:_serviceId", () => {
    let updatedService: IService;

    it("Should successfully upload {ServiceImage}", (done) => {
      chai.request(server)
        .post("/api/uploads/service_images" + "/" + createdService._id)
        .attach("serviceImage", fs.readFileSync(`${__dirname}/test_images/test.jpg`), "test.jpg")
        .end((err, response) => {
          if (err) { console.error(err); done(err);}
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          expect(response.body.responseMsg).to.be.a("string");
          expect(response.body.newServiceImage).to.be.an("object");
          expect(response.body.updatedService).to.be.an("object");
          createdImage = response.body.newServiceImage;
          updatedService = response.body.updatedService;
          done();
        });
    });
    it("Should set the correct serviceId property on {ServiceImage} model", (done) => {
      expect(createdImage.serviceId).to.equal(updatedService._id);
      done();
    });
    it("Should place the image into the correct directory", (done) => {
      fs.access(createdImage.absolutePath, fs.constants.R_OK | fs.constants.F_OK, (err) => {
        expect(err).to.equal(null);
        done();
      });
    });
    it("Should INCREASE the number of {ServiceImages} by 1", (done) => {
      ServiceImage.countDocuments()
        .then((number) => {
          expect(number).to.equal(serviceImageModelCount + 1);
          serviceImageModelCount = number;
          done();
        })
        .catch((err) => { done(err); });
    });
    it("Should return the updated {Service} object with image data in it", (done) => {
      const newImages = updatedService.images.filter((image) => (image as IServiceImage)._id === createdImage._id);
      expect(newImages.length).to.equal(1);
      done();
    });
    it("Should INCREASE the number of images in updated {Service} by 1", (done) => {
      expect(updatedService.images.length).to.equal(serviceImagesCount + 1);
      serviceImagesCount = updatedService.images.length;
      done();
    });
  });
  // END POST tests
  // BEGIN DELETE tests //
  describe("DELETE '/api/uploads/service_images/:_imgId/:_serviceId", () => {
    let updatedService: IService; let deletedImage: IServiceImage;

    it("Should successfully remove an image", (done) => {
      chai.request(server)
        .delete("/api/uploads/service_images/" + createdImage._id + "/" + createdImage.serviceId)
        .end((err, response) => {
          if (err) { console.error(err); done(err); }
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          expect(response.body.responseMsg).to.be.a("string");
          expect(response.body.deletedServiceImage).to.be.an("object");
          expect(response.body.updatedService).to.be.an("object");
          deletedImage = response.body.deletedServiceImage;
          updatedService = response.body.updatedService;
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
    it("Should DECREASE the number of {ServiceImage(s)} by 1", (done) => {
      ServiceImage.countDocuments()
        .then((number) => {
          expect(number).to.equal(serviceImageModelCount - 1);
          serviceImageModelCount = number;
          done();
        })
        .catch((err) => { done(err); });
    });
    it("Should return the updated {Service} object with image date in it", (done) => {
      const img = updatedService.images.filter((image) => (image as IServiceImage)._id === deletedImage._id);
      expect(img.length).to.equal(0);
      done();
    });
    it("Should DECREASE the number of images in the updated {Service} by 1", (done) => {
      expect(updatedService.images.length).to.equal(serviceImagesCount - 1);
      serviceImagesCount - updatedService.images.length;
      done();
    });

  });
  // END DELETE tests //
});