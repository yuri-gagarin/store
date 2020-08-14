import chaiHttp from "chai-http";
import fs from "fs";
import path from "path";
import chai, { expect } from "chai";
import faker from "faker";
// server, models //
import server from "../../server";
import Service, { IService } from "../../models/Service";
import { ServiceParams } from "../../controllers/ServicesController";
import  ServiceImage, { IServiceImage } from "../../models/ServiceImage";
// helpers //
import { setupDB, clearDB } from "../helpers/dbHelpers";
import { createServices, createServiceImages } from "../helpers/dataGeneration";

chai.use(chaiHttp);

describe ("Service API tests", () => {
  let totalServices: number; let totalServiceImages: number;

  before((done) => {
    setupDB()
      .then(() =>  createServices(10))
      .then((services) => {
        totalServices = services.length;
        return createServiceImages(services)
      })
      .then((serviceImages) => {
        totalServiceImages = serviceImages.length;
        done();
      })
      .catch((error) => { done(error); });
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  
  // generic GET request tests //
  context("GET Request generic", () => {
    describe("GET { '/api/services' }", () => {
      let services: IService[], responseMsg: string;

      it("Should GET all services", (done) => {
        chai.request(server)
          .get("/api/services")
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            services = response.body.services;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(services).to.be.an("array");
      });
      it("Should return the default number of Services", () => {
        expect(services.length).to.equal(10);
      })
    });
  });
  // END generic GET request //
  // GET requests with queries tests //
  context("GET Requests with specific query options", () => {
  
    describe("GET { '/api/services?price=X' }", () => {
      let services: IService[], responseMsg: string;
      const price = "asc"; 

      it("Should GET all services", (done) => {
        chai.request(server)
          .get(`/api/services?price=${price}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            services = response.body.services;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(services).to.be.an("array");
      });
      it(`Should return the default number of Services`, () => {
        expect(services.length).to.equal(10);
      });
      it(`Should return Services sorted by price ${price.toUpperCase()}`, () => {
        for (let i = 0; i < services.length - 1; i++) {
          const firstServicePrice = services[i].price;
          const secondServicePrice = services[i + 1].price;
          expect(firstServicePrice <= secondServicePrice).to.equal(true);
        }
      });
    });

    describe("GET { '/api/services?price=x&limit=x' }", () => {
      let services: IService[], responseMsg: string;
      const price = "asc"; const limit = 5;

      it("Should GET all services", (done) => {
        chai.request(server)
          .get(`/api/services?price=${price}&limit=${limit}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            services = response.body.services;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(services).to.be.an("array");
      });
      it("Should return the default number of Services", () => {
        expect(services.length).to.equal(limit);
      });
      it(`Should return Services by price ${price.toUpperCase()}`, () => {
        for (let i = 0; i < services.length - 1; i++) {
          const firstServicePrice = services[i].price;
          const secondServicePrice = services[i + 1].price;
          expect(firstServicePrice <= secondServicePrice).to.equal(true);
        }
      });
    });

    describe("GET { '/api/services?name=X' }", () => {
      let services: IService[], responseMsg: string;
      const name = "asc"; 

      it("Should GET all services", (done) => {
        chai.request(server)
          .get(`/api/services?name=${name}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            services = response.body.services;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(services).to.be.an("array");
      });
      it(`Should return the default number of Services`, () => {
        expect(services.length).to.equal(10);
      });
      it(`Should return Services sorted by name ${name.toUpperCase()}`, () => {
        for (let i = 0; i < services.length - 1; i++) {
          const firstServiceName = services[i].name;
          const secondServiceName = services[i + 1].name;
          expect(firstServiceName <= secondServiceName).to.equal(true);
        }
      });
    });

    describe("GET { '/api/services?name=x&limit=x' }", () => {
      let services: IService[], responseMsg: string;
      const name = "asc"; const limit = 5;

      it("Should GET all services", (done) => {
        chai.request(server)
          .get(`/api/services?name=${name}&limit=${limit}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            services = response.body.services;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(services).to.be.an("array");
      });
      it(`Should return the correct number (${limit}) of Services`, () => {
        expect(services.length).to.equal(limit);
      });
      it(`Should return Services by name ${name.toUpperCase()}`, () => {
        for (let i = 0; i < services.length - 1; i++) {
          const firstServiceName = services[i].name;
          const secondServiceName = services[i + 1].name;
          expect(firstServiceName <= secondServiceName).to.equal(true);
        }
      });
    });

    describe("GET { '/api/services?date=X' }", () => {
      let services: IService[], responseMsg: string;
      const date = "asc"; 

      it("Should GET all services", (done) => {
        chai.request(server)
          .get(`/api/services?date=${date}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            services = response.body.services;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(services).to.be.an("array");
      });
      it(`Should return the default number of Services`, () => {
        expect(services.length).to.equal(10);
      });
      it(`Should return Services sorted by date ${date.toUpperCase()}`, () => {
        for (let i = 0; i < services.length - 1; i++) {
          const firstServiceCreatedAt = services[i].createdAt;
          const secondServiceCreatedAt = services[i + 1].createdAt;
          expect(firstServiceCreatedAt <= secondServiceCreatedAt).to.equal(true);
        }
      });
    });

    describe("GET { '/api/services?date=x&limit=x' }", () => {
      let services: IService[], responseMsg: string;
      const date = "asc"; const limit = 5;

      it("Should GET all services", (done) => {
        chai.request(server)
          .get(`/api/services?date=${date}&limit=${limit}`)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            services = response.body.services;
            responseMsg = response.body.responseMsg;
            done();
          });
      });
      it("Should have the correct response", () => {
        expect(responseMsg).to.be.a("string");
        expect(services).to.be.an("array");
      });
      it(`Should return the correct number (${limit}) of Services`, () => {
        expect(services.length).to.equal(limit);
      });
      it(`Should return Services by date ${date.toUpperCase()}`, () => {
        for (let i = 0; i < services.length - 1; i++) {
          const firstServiceCreatedAt = services[i].createdAt;
          const secondServiceCreatedAt = services[i + 1].createdAt;
          expect(firstServiceCreatedAt <= secondServiceCreatedAt).to.equal(true);
        }
      });
    });

  });
  // END requests with queries tests //
  // GET request for specific service tests //
  context("GET Request for specific Service", () => {
    describe("GET { '/api/services/:_id }", () => {
      let service: IService, requestedService: IService; 
      let responseMsg: string;

      before((done) => {
        Service.find().limit(1)
          .then((foundServices) => {
            service = foundServices[0];
            done();
          })
          .catch((error) => { done(error); });
      });

      it("Should GET a specific service", (done) => {
        chai.request(server)
          .get("/api/services/" + service._id)
          .end((error, response) => {
            if (error) done(error);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            responseMsg = response.body.responseMsg;
            requestedService = response.body.service;
            done();
          });
      });
      it("Should return the correct {Service}", (done) => {
        expect(String(service._id)).to.equal(String(service._id));
        expect(requestedService.name).to.equal(service.name);
        expect(requestedService.description).to.equal(service.description);
        expect(requestedService.price).to.equal(service.price);
        done();
      });

    });
  });
  // END request for specific service tests //
  // POST Requests tests //
  context("POST Request CREATE", () => {
    describe("POST { '/api/services/create' }", ()=> {

      const newService: ServiceParams = {
        name: faker.lorem.word(),
        description: faker.lorem.paragraphs(2),
        price: 100, 
        serviceImages: []
      };
      let createdService: IService;

      it("Should create a new {Service}", (done) => {
        chai.request(server)
          .post("/api/services/create")
          .send(newService)
          .end((err, response) => {
            if (err) done(err);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            expect(response.body.newService).to.be.an("object");
            createdService = response.body.newService;
            done();
          });
      });
      it("Should return the created {Service} and correct data", (done) => {
        expect(createdService.name).to.equal(newService.name);
        expect(createdService.description).to.equal(newService.description);
        expect(createdService.price).to.equal(newService.price);
        done();
      });
      it("Should INCREASE the number of {Service(s)} by 1", (done) => {
        Service.countDocuments()
          .then((number) => {
            expect(number).to.equal(totalServices + 1);
            totalServices = number;
            done();
          })
          .catch((err) => { done(err); });
      });

    });
  });
  // END POST request tests //
  // PATCH requests tests //
  context("PATCH Request UPDATE", () => {
    describe("PATCH { '/api/services/update/:_id' }", () => {

      let service: IService, editedService: IService;
      let updateData: ServiceParams; 

      before((done) => {
        Service.find().limit(1).populate("images")
          .then((services) => {
            service = services[0];
            updateData = {
              name: faker.lorem.word(),
              description: faker.lorem.paragraphs(1),
              price: 200,
              serviceImages: service.images as IServiceImage[]
            }
            done();
          })
          .catch((error) => done(error));
      });

      it("Should update an existing {Service}", (done) => {
        chai.request(server)
          .patch("/api/services/update/" + service._id)
          .send(updateData)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.editedService).to.be.an("object");
            editedService = res.body.editedService;
            done();
          });
      });
      it("Should return the updated {Service} and the updated data", (done) => {
        expect(String(editedService._id)).to.equal(String(service._id));
        expect(editedService.name).to.equal(updateData.name);
        expect(editedService.description).to.equal(updateData.description);
        expect(editedService.price).to.equal(updateData.price);
        done();
      });
      it("Should NOT INCREASE the number of {Service(s)}", (done) => {
        Service.countDocuments()
          .then((number) => {
            expect(number).to.equal(totalServices);
            done();
          })
          .catch((err) => { done(err); });
      });

    });
  });
  // END PATCH requests tests //
  // DELETE requests tests //
  context("DELETE Request REMOVE", () => {
    describe("DELETE { '/api/services/delete/:_id' }", () => {
      let service: IService, deletedService: IService;

      before((done) => {
        Service.find().limit(1).populate("images")
          .then((services) => {
            service = services[0];
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

      it("Should successfully delete a {Service}", (done) => {
        chai.request(server)
          .delete("/api/services/delete/" + service._id)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.deletedService).to.be.an("object");
            deletedService = res.body.deletedService;
            done();
          });
      });
      it("Should return the deleted {Service} and its data", (done) => {
        expect(String(deletedService._id)).to.equal(String(service._id));
        done();
      });
      it("Should DECREASE the number of Service(s) by 1", (done) => {
        Service.countDocuments()
          .then((number) => {
            expect(number).to.equal(totalServices - 1);
            totalServices = number;
            done();
          })
          .catch((err) => { done(err); });
      });
      it("Should DELETE ALL corresponding ServiceImages", (done) => {
        ServiceImage.find({ serviceId: service._id })
          .then((serviceImages) => {
            expect(serviceImages.length).to.equal(0);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should DELETE all the corresponding image uploads and directory", (done) => {
        const imageSubDir: string  = service._id.toString();
        const imageDirectory = path.join(path.resolve(), "public", "uploads", "service_images", imageSubDir);
        fs.access(imageDirectory, (err) => {
          let accessError = err;
          expect(accessError).to.not.be.null;
          expect(accessError!.code === "ENOENT").to.equal(true);
          done();
        });
      });
    });
  });
  // END DELETE requests tests //
  
});
