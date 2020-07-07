import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import faker from "faker";
// server, models //
import server from "../../server";
import BonusVideo, { IBonusVideo } from "../../models/BonusVideo";
import { BonusVideoParams } from "../../controllers/BonusVideosController";
// helpers //
import { setupDB, clearDB } from "../helpers/dbHelpers";

chai.use(chaiHttp);

describe ("BonusVideo API tests", () => {
  let totalBonusVideos: number;

  before((done) => {
    setupDB()
      .then(() => createBonusVideos(10))
      .then(() => BonusVideo.countDocuments())
      .then((number) => { totalBonusVideos = number; done(); })
      .catch((error) => { done(error); });
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  
  describe("GET { '/api/bonus_videos' }", () => {
    let bonusVideos: IBonusVideo[], responseMsg: string;

    it("Should GET all bonusVideos", (done) => {
      chai.request(server)
        .get("/api/bonus_videos")
        .end((error, response) => {
          if (error) done(error);
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          bonusVideos = response.body.bonusVideos;
          responseMsg = response.body.responseMsg;
          done();
        });
    });
    it("Should have the correct response", () => {
      expect(responseMsg).to.be.a("string");
      expect(bonusVideos).to.be.an("array");
    });
  });

  describe("GET { '/api/bonus_videos/:_id }", () => {
    let bonusVideo: IBonusVideo, requestedBonusVideo: IBonusVideo; 

    before((done) => {
      BonusVideo.find().limit(1)
        .then((foundBonusVideos) => {
          bonusVideo = foundBonusVideos[0];
          done();
        })
        .catch((error) => { done(error); });
    });

    it("Should GET a specific bonusVideo", (done) => {
      chai.request(server)
        .get("/api/bonus_videos/" + bonusVideo._id)
        .end((error, response) => {
          if (error) done(error);
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          expect(response.body.responseMsg).to.be.a("string");
          expect(response.body.bonusVideo).to.be.an("object");
          requestedBonusVideo = response.body.bonusVideo;
          done();
        });
    });
    it("Should return the correct {BonusVideo}", (done) => {
      expect(String(requestedBonusVideo._id)).to.equal(String(bonusVideo._id));
      expect(requestedBonusVideo.description).to.equal(bonusVideo.description);
      expect(requestedBonusVideo.youTubeURL).to.equal(bonusVideo.youTubeURL);
      expect(requestedBonusVideo.vimeoURL).to.equal(bonusVideo.vimeoURL);
      done();
    });

  });

  describe("POST { '/api/bonus_videos/create' }", ()=> {

    const newData: BonusVideoParams = {
      description: faker.lorem.paragraphs(1),
      youTubeURL: faker.internet.url(),
      vimeoURL: ""
    };
    let createdBonusVideo: IBonusVideo;

    it("Should create a new {BonusVideo}", (done) => {
      chai.request(server)
        .post("/api/bonus_videos/create")
        .send(newData)
        .end((err, response) => {
          if (err) done(err);
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an("object");
          expect(response.body.responseMsg).to.be.a("string");
          expect(response.body.newBonusVideo).to.be.an("object");
          createdBonusVideo = response.body.newBonusVideo;
          done();
        });
    });
    it("Should return the created {BonusVideo} and correct data", (done) => {
      expect(createdBonusVideo.description).to.equal(newData.description);
      expect(createdBonusVideo.youTubeURL).to.equal(newData.youTubeURL);
      expect(createdBonusVideo.vimeoURL).to.equal(newData.vimeoURL);
      done();
    });
    it("Should INCREASE the number of {BonusVideo(s)} by 1", (done) => {
      BonusVideo.countDocuments()
        .then((number) => {
          expect(number).to.equal(totalBonusVideos + 1);
          totalBonusVideos = number;
          done();
        })
        .catch((err) => { done(err); });
    });

  });

  describe("PATCH { '/api/bonus_videos/update/:_id' }", () => {

    let bonusVideo: IBonusVideo, editedBonusVideo: IBonusVideo;
    const updateData: BonusVideoParams = {
      description: faker.lorem.paragraphs(1),
      youTubeURL: faker.internet.url()
    };

    before((done) => {
      BonusVideo.find().limit(1)
        .then((bonusVideos) => {
          bonusVideo = bonusVideos[0];
          done();
        })
        .catch((error) => { done(error); });
    });

    it("Should update an existing {BonusVideo}", (done) => {
      chai.request(server)
        .patch("/api/bonus_videos/update/" + bonusVideo._id)
        .send(updateData)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.responseMsg).to.be.a("string");
          expect(res.body.editedBonusVideo).to.be.an("object");
          editedBonusVideo = res.body.editedBonusVideo;
          done();
        });
    });
    it("Should return the updated {BonusVideo} and the updated data", (done) => {
      expect(String(editedBonusVideo._id)).to.equal(String(bonusVideo._id));
      expect(editedBonusVideo.description).to.equal(updateData.description);
      expect(editedBonusVideo.youTubeURL).to.equal(updateData.youTubeURL);
      expect(editedBonusVideo.vimeoURL).to.equal(updateData.vimeoURL);
      done();
    });
    it("Should NOT INCREASE the number of {BonusVideo(s)}", (done) => {
      BonusVideo.countDocuments()
        .then((number) => {
          expect(number).to.equal(totalBonusVideos);
          done();
        })
        .catch((err) => { done(err); });
    });

  });
  
  describe("DELETE { '/api/bonus_videos/delete/:_id' }", () => {
    let bonusVideo: IBonusVideo, deletedBonusVideo: IBonusVideo;

    before((done) => {
      BonusVideo.find().limit(1)
        .then((bonusVideos) => {
          bonusVideo = bonusVideos[0];
          done();
        })
        .catch((err) => { done(err); });
    });

    it("Should successfully delete a {BonusVideo}", (done) => {
      chai.request(server)
        .delete("/api/bonus_videos/delete/" + bonusVideo._id)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.responseMsg).to.be.a("string");
          expect(res.body.deletedBonusVideo).to.be.an("object");
          deletedBonusVideo = res.body.deletedBonusVideo;
          done();
        });
    });
    it("Should return the deleted {BonusVideo} and its data", (done) => {
      expect(String(deletedBonusVideo._id)).to.equal(String(bonusVideo._id));
      done();
    });
    it("Should DECREASE the number of {BonusVideo(s)} by 1", (done) => {
      BonusVideo.countDocuments()
        .then((number) => {
          expect(number).to.equal(totalBonusVideos - 1);
          done();
        })
        .catch((err) => { done(err); });
    });
  });
  
});
