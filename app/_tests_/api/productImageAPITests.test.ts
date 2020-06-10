// ProductImage API tests //
import chaiHTTP from "chai-http";
import fs from "fs";
import chai, { expect } from "chai";
import path from "path";
// server, models //
import server from "../../server";
import { IProduct } from "../../models/Product";
import ProductImage, { IProductImage } from "../../models/ProductImage";
// helpers //
import { setupDB, clearDB } from "../helpers/dbHelpers";
import { createProducts } from "../helpers/dataGeneration";

chai.use(chaiHTTP);

describe("ProductImage API tests", () => {
  let createdProduct: IProduct; let createdImage: IProductImage;
  let productImageModelCount: number; let productImagesCount: number;

  before((done) => {
    setupDB()
      .then(() => createProducts(1))
      .then((products) => {
        createdProduct = products[0];
        return ProductImage.countDocuments();
      })
      .then((number) => {
        productImageModelCount = number;
        productImagesCount = createdProduct.images.length;
        done();
      })
      .catch((error) => { done(error) });
  });

  after((done) => { 
    clearDB().then(() => { done() }).catch((err) => { done(err) });
  });

  // BEGIN POST tests //
  describe("POST '/api/product_images/upload", () => {
    let updatedProduct: IProduct;

    it("Should successfully upload {ProductImage}", (done) => {
      chai.request(server)
        .post("/api/uploads/product_images" + "/" + createdProduct._id)
        .attach("productImage", fs.readFileSync(`${__dirname}/test_images/test.jpg`), "test.jpg")
        .end((err, response) => {
          if (err) { console.error(err); done(err)};
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          expect(response.body.responseMsg).to.be.a("string");
          expect(response.body.newProductImage).to.be.an("object");
          expect(response.body.updatedProduct).to.be.an("object");
          createdImage = response.body.newProductImage;
          updatedProduct = response.body.updatedProduct;
          done();
        });
    });
    it("Should set the correct productId property on {ProductImage} model", (done) => {
      expect(createdImage.productId).to.equal(updatedProduct._id);
      done();
    });
    it("Should place the image into the correct directory", (done) => {
      fs.access(createdImage.absolutePath, fs.constants.R_OK | fs.constants.F_OK, (err) => {
        expect(err).to.equal(null);
        done();
      });
    });
    it("Should INCREASE the number of {ProductImages} by 1", (done) => {
      ProductImage.countDocuments()
        .then((number) => {
          expect(number).to.equal(productImageModelCount + 1);
          productImageModelCount = number;
          done();
        })
        .catch((err) => { done(err) });
    });
    it("Should return the updated {Product} object with image data in it", (done) => {
      const newImages = updatedProduct.images.filter((image) => (image as IProductImage)._id === createdImage._id);
      expect(newImages.length).to.equal(1);
      done();
    })
    it("Should INCREASE the number of images in updated {Product} by 1", (done) => {
      expect(updatedProduct.images.length).to.equal(productImagesCount + 1);
      productImagesCount = updatedProduct.images.length;
      done();
    });
  });
  // END POST tests
  // BEGIN DELETE tests //
  describe("DELETE '/api/product/product_images/upload", () => {
    let updatedProduct: IProduct; let deletedImage: IProductImage;

    it("Should successfully remove an image", (done) => {
      chai.request(server)
        .delete("/api/uploads/product_images/" + createdImage._id + "/" + createdImage.productId)
        .end((err, response) => {
          if (err) { console.error(err); done(err) };
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          expect(response.body.responseMsg).to.be.a("string");
          expect(response.body.deletedProductImage).to.be.an("object");
          expect(response.body.updatedProduct).to.be.an("object");
          deletedImage = response.body.deletedProductImage;
          updatedProduct = response.body.updatedProduct;
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
    it("Should DECREASE the number of {ProductImage(s)} by 1", (done) => {
      ProductImage.countDocuments()
        .then((number) => {
          expect(number).to.equal(productImageModelCount - 1);
          productImageModelCount = number;
          done();
        })
        .catch((err) => { done(err) });
    });
    it("Should return the updated {Product} object with image date in it", (done) => {
      const img = updatedProduct.images.filter((image) => (image as IProductImage)._id === deletedImage._id);
      expect(img.length).to.equal(0);
      done();
    });
    it("Should DECREASE the number of images in the updated {Product} by 1", (done) => {
      expect(updatedProduct.images.length).to.equal(productImagesCount - 1);
      productImagesCount - updatedProduct.images.length;
      done();
    });

  });
  // END DELETE tests //
});