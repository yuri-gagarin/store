import faker from "faker";
import { expect } from "chai";
import BonusVideo, { IBonusVideo } from "../../../models/BonusVideo";
// helpers //
import { setupDB, clearDB } from "../../helpers/dbHelpers";

describe("BonusVideo Unit Tests", () => {
  before((done) => {
    setupDB().then(() => done()).catch((err) => done(err));
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  describe("Create BonusVideo Test", () => {
    describe("Invalid BonusVideo Data", () => {
      const invalidBonusVideo = {
        description: "",
        youTubeUrl: "",
        vimeoURL: "",
        createdAt: new Date()
      };
      it("Should NOT create a new {BonusVideo} without a video URL", (done) => {
        BonusVideo.create(invalidBonusVideo)
          .catch((err) => {
            expect(err).to.not.be.undefined;
            done();
          });
      });
    });
    describe("Valid BonusVideo Data", () => {

      let createdBonusVideo: IBonusVideo;

      it("Should create a BonusVideo with only youTubeURL", (done) => {
        BonusVideo.create({ youTubeURL: faker.internet.url() })
          .then((video) => {
            createdBonusVideo = video;
            expect(video instanceof BonusVideo).to.eq(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should have valid properties", (done) => {
        expect(createdBonusVideo.youTubeURL).to.be.a("string");
        done();
      });
      it("Should create a BonusVideo with only vimeoURL", (done) => {
        BonusVideo.create({ vimeoURL: faker.internet.url() })
          .then((video) => {
            createdBonusVideo = video;
            expect(video instanceof BonusVideo).to.eq(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should have valid properties", (done) => {
        expect(createdBonusVideo.vimeoURL).to.be.a("string");
        done();
      });
    });
  });
});

