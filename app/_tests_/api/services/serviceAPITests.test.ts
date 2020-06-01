import { setupDB, clearDB } from "../../helpers/dbHelpers";
import { createServices } from "../../helpers/dataGeneration";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../../../server";
import Service, { IService } from "../../../models/Service";

interface IServerResponse {
  status: number;
  responseMsg: string;
  data: any
}
chai.use(chaiHttp);

describe ("{Service} API tests", () => {
  beforeEach((done) => {
    setupDB()
      .then(() => {
        return createServices(10);
      })
      .then((stores) => {
        // ///
        done();
      })
      .catch((error) => done(error))
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err))
  })
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
    it("Should GET a specific services", (done) => {
      Service.find().limit(1)
        .then((foundServices) => {
          service = foundServices[0]
        })
        .then(() => {
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
        })
        .catch((err) => done(err));
    });
    it("Should return the correct {Service}", (done) => {
      expect(String(service._id)).to.equal(String(requestedService._id));
      expect(service.name).to.equal(requestedService.name);
      expect(service.description).to.equal(requestedService.description);
      done();
    })
  })
  describe("POST { '/api/services/create' }", ()=> {

  })
  describe("PATCH { '/api/services/update/:_id' }", () => {
  
  })
  describe("DELETE { '/api/services/delete/:_id' }", () => {

  })
  
})