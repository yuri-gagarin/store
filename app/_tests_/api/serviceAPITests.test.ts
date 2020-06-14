import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import faker from "faker";
// server, models //
import server from "../../server";
import Service, { IService } from "../../models/Service";
import { ServiceParams } from "../../controllers/ServicesController";
// helpers //
import { setupDB, clearDB } from "../helpers/dbHelpers";
import { createServices } from "../helpers/dataGeneration";

chai.use(chaiHttp);

describe ("Service API tests", () => {
  let totalServices: number;

  before((done) => {
    setupDB()
      .then(() =>  createServices(10))
      .then(() => Service.countDocuments())
      .then((number) => { totalServices = number; done(); })
      .catch((error) => { done(error); });
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  
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
    it("Should have the correct resonse", () => {
      expect(responseMsg).to.be.a("string");
      expect(services).to.be.an("array");
    });
  });

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

  describe("POST { '/api/services/create' }", ()=> {

    const newService: ServiceParams = {
      name: faker.lorem.word(),
      description: faker.lorem.paragraphs(2),
      price: "100", 
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

  describe("PATCH { '/api/services/update/:_id' }", () => {

    let service: IService, editedService: IService;
    const updateData: ServiceParams = {
      name: faker.lorem.word(),
      description: faker.lorem.paragraphs(1),
      price: "200",
      serviceImages: []
    };

    before((done) => {
      Service.find().limit(1)
        .then((services) => {
          service = services[0];
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
  
  describe("DELETE { '/api/services/delete/:_id' }", () => {
    let service: IService, deletedService: IService;

    before((done) => {
      Service.find().limit(1)
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
    it("Should DECREASE the number of {Service(s)} by 1", (done) => {
      Service.countDocuments()
        .then((number) => {
          expect(number).to.equal(totalServices - 1);
          totalServices = number;
          done();
        })
        .catch((err) => { done(err); });
    });
  });
  
});
