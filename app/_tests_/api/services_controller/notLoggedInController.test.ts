// testing dependencies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server import //
import server from "../../../server";
// models and model interfaces //
import Service, { IService } from "../../../models/Service";
// helpers and data generators //
import { setupServiceControllerTests } from "./helpers/setupServiceControllerTests";
import { isEmptyObj } from "../../../controllers/_helpers/queryHelpers";
import { clearDB } from "../../helpers/dbHelpers";

chai.use(chaiHTTP);

describe("ServicesController - NOT LOGGED IN - API tests", () => {
  let firstAdminsService: IService;
  let numberOfServices: number;

  before((done) => {
    setupServiceControllerTests()
      .then((response) => {
        ({ firstAdminsService } = response.services);
        return Service.countDocuments().exec();
      })
      .then((number) => {
        numberOfServices = number;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  // CONTEXT 'ServicesController' API tests Admin not logged in //
  context("'ServicesController' API tests - ADMIN NOT LOGGED IN (NO JWT token)", () => {
    // TEST GET GET_MANY action admin not logged in //
    describe("GET '/api/services' - NO LOGIN - GET_MANY action", () => {

      it("Should not return any 'Service' models and send the correct response", (done) => {
        chai.request(server)
          .get("/api/services")
          .set({ "Authorization": "" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.services).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        Service.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfServices);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST GET GET_MANY action admin not logged in //

    // TEST GET GET_ONE action admin not logged in //
    describe("GET '/api/services/:serviceId - NO LOGIN - GET_ONE action", () => {
      it("Should not return a 'Service' model and send the correct response", (done) => {
        chai.request(server)
          .get("/api/services/" + (firstAdminsService._id as string))
          .set({ "Authorization": "" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.service).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        Service.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfServices);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST GET GET action admin not logged in //

    // TEST POST CREATE action admin not logged in //
    describe("POST '/api/services/create - NO LOGIN - CREATE action", () => {
      it("Should NOT return a 'Service' model and send the correct response", (done) => {
        chai.request(server)
          .post("/api/services/create")
          .set({ "Authorization": "" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.newService).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        Service.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfServices);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST GET GET action admin not logged in //

    // TEST PATCH EDIT action admin not logged in //
    describe("PATCH '/api/services/update/:serviceId - NO LOGIN - EDIT action", () => {
      it("Should NOT return a 'Service' model and send the correct response", (done) => {
        chai.request(server)
          .patch("/api/services/update/" + String(firstAdminsService._id))
          .set({ "Authorization": "" })
          .send({ ...firstAdminsService, name: "newServiceName" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.editedService).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        Service.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfServices);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT edit the 'Service' model in question", (done) => {
        Service.findOne({ _id: firstAdminsService._id }).exec()
          .then((service) => {
            expect(JSON.stringify(service)).to.equal(JSON.stringify(firstAdminsService));
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST PATCH EDIT action admin not logged in //

    // TEST DELETE DELETE action admin not logged in //
    describe("DELETE'/api/services/delete/:serviceId - NO LOGIN - DELETE action", () => {
      it("Should not return a 'Service' model and send the correct response", (done) => {
        chai.request(server)
          .delete("/api/services/delete/" + String(firstAdminsService._id))
          .set({ "Authorization": "" })
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).to.be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.deletedService).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything in the database", (done) => {
        Service.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(numberOfServices);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT remove the 'Service' model in question", (done) => {
        Service.exists({ _id: firstAdminsService._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    // END TEST DELETE DELETE action admin not logged in //
  });
  // END CONTEXT 'ServicesController' API tests Admin not logged in //

});
