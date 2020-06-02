import faker from "faker";
import { expect, should } from "chai";
import Store, { IStore } from "../../../models/Store";
// helpers //
import { setupDB, clearDB } from "../../helpers/dbHelpers";

describe("Store Unit Tests", () => {
  before((done) => {
    setupDB().then(() => done()).catch((err) => done(err));
  });
  after((done) => {
    clearDB().then(() => done()).catch((err) => done(err));
  });
  describe("Create Store Test", () => {
    describe("Invalid Store Data", () => {
      const invalidStore = {
        title: "",
        description: "",
        images: [],
        createdAt: new Date(),
      }
      it("Should NOT create a new {Store} without a title", (done) => {
        Store.create(invalidStore)
          .catch((err) => {
            expect(err).to.not.be.undefined;
            done();
          })
      });
      it("Should NOT create a new {Store} without a description", (done) => {
        Store.create(invalidStore)
          .catch((err) => {
            expect(err).to.be.an("object");
            done();
          })
      });
    })
    describe("Valid Store Data", () => {
      const validStore = {
        title: faker.lorem.words(2),
        description: faker.lorem.paragraph(4)
      };
      let createdStore: IStore;

      it("Should create a Store", (done) => {
        Store.create(validStore)
          .then((store) => {
            createdStore = store;
            expect(store instanceof Store).to.eq(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should have valid properties", (done) => {
        expect(typeof createdStore.title).to.eq("string");
        expect(typeof createdStore.description).to.eq("string");
        expect(typeof createdStore.images).to.eq("object");
        done();
      });
    });
  });
  
});

