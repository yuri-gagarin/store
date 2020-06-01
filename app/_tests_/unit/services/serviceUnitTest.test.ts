import faker from "faker";
import { expect } from "chai";
import Service, { IService } from "../../../models/Service";
import { Error } from "mongoose";
// helpers //
import { setupDB, clearDB } from "../../helpers/dbHelpers";

describe("Service Unit Tests", () => {
  before((done) => {
    setupDB().then(() => done()).catch((err) => done(err));
  });
  const mockService = {
    name: faker.lorem.words(2),
    description: faker.lorem.paragraph(4),
    price: 100,
    images: []
  };
  describe("Valid Service Data", () => {
   
    let createdService: IService;

    it("Should create a Service", (done) => {
      Service.create(mockService)
        .then((service) => {
          createdService = service;
          expect(service instanceof Service).to.eq(true);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it("Should have valid properties", (done) => {
      expect(typeof createdService.name).to.eq("string");
      expect(typeof createdService.description).to.eq("string");
      expect(typeof createdService.price).to.eq("string");
      expect(typeof createdService.images).to.eq("object");
      done();
    });
  });
  describe("Create Service Test", () => {
    describe("Invalid Service Data", () => {
      
      it("Should NOT create a new {Service} without a {name} property", (done) => {
        Service.create({ ...mockService, name: "" })
          .catch((err: Error.ValidationError ) => {
            expect(err).to.not.be.undefined;
            expect(err.errors.name).to.exist;
            done();
          });
      });
      it("Should NOT create a new {Service} without a {description} property", (done) => {
        Service.create({ ...mockService, description: "" })
          .catch((err: Error.ValidationError) => {
            expect(err).to.not.be.undefined;
            expect(err.errors.description).to.exist;
            done();
          });
      });
      it("Should NOT create a new {Service} without a {price} property", (done) => {
        Service.create({ ...mockService, price: "" })
          .catch((err: Error.ValidationError) => {
            expect(err).to.not.be.undefined;
            expect(err.errors.price).to.exist;
            done();
          });
      });
    });

  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
});

