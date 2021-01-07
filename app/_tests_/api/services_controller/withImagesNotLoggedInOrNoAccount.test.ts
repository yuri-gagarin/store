// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import { Types } from "mongoose";
import fs, { readdirSync } from "fs";
import path from "path";
// server import /
import server from "../../../server";
// models and model interfaces //
import { IAdministrator } from "../../../models/Administrator";
import ServiceImage, { IServiceImage } from "../../../models/ServiceImage";
import Service, { IService } from "../../../models/Service";
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { generateMockServiceData } from "../../helpers/data_generation/serviceDataGeneration"; 
import { setupServiceControllerTests } from "./helpers/setupServiceControllerTests";
import { cleanUpServiceImgControllerTests } from "../service_images_controller/helpers/setupServiceImgControllerTests";
import { createServiceImages } from "../../helpers/data_generation/serviceImageDataGeneration";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";

chai.use(chaiHTTP);

type ImageDirectoryDetails = {
  imageModel: string;
  imageDirectories: string[];
  imageSubDirectories: string[];
  imageFiles: string[];
  totalImageDirectories: number;
  totalImageSubdirectories: number;
  totalImageFiles: number;
}
const getImageUploadData = (...paths: string []): ImageDirectoryDetails => {
  const firstString = paths[0].split("_")[0]; 
  const modelName = firstString[0].toUpperCase() + firstString.substr(1) + "Image";
  //
  const imageUplPath = path.join(path.resolve(), "public", "uploads", ...paths);
  const imageUplSubdirectories: string[] = [];
  const imageFiles: string[] = [];

  try {
    const imageUplDirectories = fs.readdirSync(imageUplPath).map((dir) => {
      return path.join(imageUplPath, dir);
    });

    for (const imgUplDirectory of imageUplDirectories) {
      const subdirectories = fs.readdirSync(imgUplDirectory).map((subdir) => {
        return path.join(imgUplDirectory, subdir);
      })
      imageUplSubdirectories.push(...subdirectories);
    }

    for (const imgUplSubdirectory of imageUplSubdirectories) {
      const files = readdirSync(imgUplSubdirectory);
      imageFiles.push(...files);
    }

    return {
      imageModel: modelName,
      imageDirectories: imageUplDirectories,
      imageSubDirectories: imageUplSubdirectories,
      imageFiles: imageFiles,
      totalImageDirectories: imageUplDirectories.length,
      totalImageSubdirectories: imageUplSubdirectories.length,
      totalImageFiles: imageFiles.length
    };
  } catch (error) {
    throw error;
  }
  
};
/**
 * This test suite tests mostly the effect of 'ServiceController' methods on linked 'ServiceImage' models,
 * making sure actions are correctly populating and removing images when appropriate
 * For detailed 'ServiceController' action tests, another test suite handles other detailed test cases regarding the 'Service' model.
 */

describe("ServicesController - NOT LOGGED IN or NO BUSINESS ACCOUNT - tests with 'ServiceImage' models present - GET/POST/PATCH/DELETE  - API tests", () => {
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;
  let thirdAdmin: IAdministrator;
  let thirdAdminsToken: string;
  // service models //
  let firstAdminsService: IService;
  let firstAdminsServicesArr: IService[], secondAdminsServicesArr: IService[];
  //
  let totalServiceImages: number;
  let queriedServiceImagesTotal: number;
  // 
  let numberOfServiceImageDirectories: number = 0;    // <path>/public/uploads/service_images/<businessAccountId> //
  let numberOfServiceImageSubDirectories: number = 0; // <path>/public/uploads/service_images/<businessAccountId>/<serviceId> //
  let numberOfServiceImageFiles: number = 0;

  // database and model data setup //
  // logins and jwtTokens //
  before((done) => {
    setupServiceControllerTests()
      .then((response) => {
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = response.busAccountIds);
        ({ thirdAdmin } = response.admins );
        ({ firstAdminsServicesArr, secondAdminsServicesArr, firstAdminsService } = response.services);
        const serviceImgPromises: Promise<IServiceImage[]>[] = [];
        for (const service of firstAdminsServicesArr) {
          const createPromises = createServiceImages(5, service);
          serviceImgPromises.push(createPromises)
        }
        for (const service of secondAdminsServicesArr) {
          const createPromises = createServiceImages(5, service);
          serviceImgPromises.push(createPromises)
        }
        return Promise.all(serviceImgPromises);
      })
      .then((_) => {
        return loginAdmins(chai, server, [ thirdAdmin ]);
      })
      .then((adminsTokenArray) => {
        [ thirdAdminsToken ] = adminsTokenArray;
        return Promise.all([
          ServiceImage.countDocuments().exec(),
          ServiceImage.countDocuments({ serviceId: firstAdminsService._id }).exec()
        ]);
      })
      .then((countsArray) => {
        [ totalServiceImages, queriedServiceImagesTotal ] = countsArray;
        try {
          const data = getImageUploadData("service_images");
          numberOfServiceImageDirectories = data.totalImageDirectories;
          numberOfServiceImageSubDirectories = data.totalImageSubdirectories;
          numberOfServiceImageFiles = data.totalImageFiles;
          done();
        } catch (error) {
          done(error);
        }
      })
      .catch((err) => {
        done(err);
      });
  });
  after((done) => {
    Promise.all([
      clearDB(),
      cleanUpServiceImgControllerTests(firstAdminBusAcctId, secondAdminBusAcctId)
    ])
    .then(() => {
      done();
    })
    .catch((error) => {
      done(error);
    });
  });
  
  // TEST CONTEXT Admin is logged in 'ServicesController' actions tests no business account //
  context("Admin NOT LOGGED IN GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {

    // TEST GET GET_MANY action not logged in //
    describe("GET '/api/services' - NOT LOGGED IN - tests with 'ServiceImages' - GET_MANY action", () => {
      it("Should NOT fetch 'Service' models and return a correct error response", (done) => {
        chai.request(server)
          .get("/api/services")
          .set({ "Authorization": "" })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.services).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything within 'ServiceImage' models in the database", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServiceImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST GET GET_MANY not logged in //
    
    // TEST GET_ONE action not logged in //
    describe("GET '/api/services/:serviceId' - NOT LOGGED IN - tests with 'ServiceImages' - GET_MANY action", () => {
    
      it("Should NOT fetch 'Service' models and return a correct error response", (done) => {
        chai.request(server)
          .get("/api/services/" + (firstAdminsService._id as Types.ObjectId))
          .set({ "Authorization": "" })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.service).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'ServiceImage' models from the queried 'Service' model", (done) => {
        ServiceImage.find({ serviceId: firstAdminsService._id }).exec()
          .then((services) => {
            expect(services.length).to.equal(queriedServiceImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter anything within 'ServiceImage' models in the database", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServiceImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST GET_ONE action not logged in //
    
    // TEST POST CREATE not ogged in  //
    describe("POST '/api/services/create' - NOT LOGGED IN - tests with 'ServiceImages' - CREATE action", () => {

      it("Should NOT create a 'Service' model and return a correct error response", (done) => {
        const mockService = generateMockServiceData(1);
        chai.request(server)
          .post("/api/services/create")
          .set({ "Authorization": "" })
          .send( ...mockService )
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.newService).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything within 'ServiceImage' models in the database", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServiceImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST POST CREATE action not logged in //
    
    // TEST PATCH EDIT  action not logged in //
    describe("PATCH '/api/services/update/:serviceId' - NOT LOGGED IN - tests with 'ServiceImages' - EDIT action", () => {

      it("Should NOT update 'Service' model and return a correct response", (done) => {
        const mockService = generateMockServiceData(1);
        chai.request(server)
          .patch("/api/services/update/" + (firstAdminsService._id as Types.ObjectId))
          .set({ "Authorization": "" })
          .send(...mockService)
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.editedService).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'ServiceImage' models from the queried 'Service' model", (done) => {
        ServiceImage.find({ serviceId: firstAdminsService._id }).exec()
          .then((services) => {
            expect(services.length).to.equal(queriedServiceImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter anything within 'ServiceImage' models in the database", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServiceImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST PATCH EDIT action not logged in //
    
    // TEST DELETE DELETE action not logged in //
    describe("DELETE '/api/services/delete/:serviceId' - LOGGED IN no ACCOUNT - tests with 'ServiceImages' - DELETE action", () => {
    
      it("Should NOT delete the 'Service' model and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/services/delete/" + String(firstAdminsService._id))
          .set({ "Authorization": "" })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.deletedService).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'ServiceImage' models from the queried 'Service' model", (done) => {
        ServiceImage.find({ serviceId: firstAdminsService._id }).exec()
          .then((services) => {
            expect(services.length).to.equal(queriedServiceImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter anything within 'ServiceImage' models in the database", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServiceImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST DELETE DELETE action correct BusinessAccount //
    
  });
  // END TEST CONTEXT Admin is logged in no account 'ServicesController' actions tests //

  // TEST CONTEXT Admin is logged in 'ServicesController' actions tests no business account //
  context("Admin LOGGED IN no BUSINESS ACCOUNT, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {

    // TEST GET GET_MANY action  logged in no account //
    describe("GET '/api/services' - LOGGED IN no ACCOUNT' - tests with 'ServiceImages' - GET_MANY action", () => {
      it("Should NOT fetch 'Service' models and return a correct error response", (done) => {
        chai.request(server)
          .get("/api/services")
          .set({ "Authorization": thirdAdminsToken })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.services).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything within 'ServiceImage' models in the database", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServiceImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST GET GET_MANY logged in no account //

    // TEST GET_ONE action logged in no account //
    describe("GET '/api/services/:serviceId' - LOGGED IN no ACCOUNT - tests with 'ServiceImages' - GET_MANY action", () => {
    
      it("Should NOT fetch 'Service' models and return a correct error response", (done) => {
        chai.request(server)
          .get("/api/services/" + (firstAdminsService._id as Types.ObjectId))
          .set({ "Authorization": thirdAdminsToken })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.service).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'ServiceImage' models from the queried 'Service' model", (done) => {
        ServiceImage.find({ serviceId: firstAdminsService._id }).exec()
          .then((services) => {
            expect(services.length).to.equal(queriedServiceImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter anything within 'ServiceImage' models in the database", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServiceImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST GET_ONE action logged in no account //

    // TEST POST CREATE logged in no account //
    describe("POST '/api/services/create' - LOGGED IN no ACCOUNT - tests with 'ServiceImages' - CREATE action", () => {

      it("Should NOT create a 'Service' model and return a correct error response", (done) => {
        const mockService = generateMockServiceData(1);
        chai.request(server)
          .post("/api/services/create")
          .set({ "Authorization": thirdAdminsToken })
          .send( ...mockService )
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.newService).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything within 'ServiceImage' models in the database", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServiceImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST POST CREATE action logged in no account //

    // TEST PATCH EDIT  action logged in no account //
    describe("PATCH '/api/services/update/:serviceId' - LOGGED IN no ACCOUNT - tests with 'ServiceImages' - EDIT action", () => {

      it("Should NOT update 'Service' model and return a correct response", (done) => {
        const mockService = generateMockServiceData(1);
        chai.request(server)
          .patch("/api/services/update/" + (firstAdminsService._id as Types.ObjectId))
          .set({ "Authorization": thirdAdminsToken })
          .send(...mockService)
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.editedService).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'ServiceImage' models from the queried 'Service' model", (done) => {
        ServiceImage.find({ serviceId: firstAdminsService._id }).exec()
          .then((services) => {
            expect(services.length).to.equal(queriedServiceImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter anything within 'ServiceImage' models in the database", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServiceImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST PATCH EDIT action logged in no account //

    // TEST DELETE DELETE action logged in no account //
    describe("DELETE '/api/services/delete/:serviceId' - LOGGED IN no ACCOUNT - tests with 'ServiceImages' - DELETE action", () => {
    
      it("Should NOT delete the 'Service' model and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/services/delete/" + String(firstAdminsService._id))
          .set({ "Authorization": thirdAdminsToken })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).to.equal(401);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.error).to.be.an("object");
            expect(res.body.errorMessages).to.be.an("array");
            expect(res.body.deletedService).to.be.undefined;
            done();
          });
      });
      it("Should NOT remove any 'ServiceImage' models from the queried 'Service' model", (done) => {
        ServiceImage.find({ serviceId: firstAdminsService._id }).exec()
          .then((services) => {
            expect(services.length).to.equal(queriedServiceImagesTotal);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter anything within 'ServiceImage' models in the database", (done) => {
        ServiceImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalServiceImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ServiceImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("service_images");
          expect(totalImageDirectories).to.equal(numberOfServiceImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfServiceImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfServiceImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST DELETE DELETE action correct BusinessAccount //
    
  });
  // END TEST CONTEXT Admin is logged in no account 'ServicesController' actions tests //

});