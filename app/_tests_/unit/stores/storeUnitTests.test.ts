import assert from "assert";
import Store, { IStore } from "../../../models/Store";
import mongoose, { Error } from "mongoose";
import config from "../../../config/config";

describe("Store Unit Tests", () => {
  before((done) => {
    mongoose.connect(config.dbSettings.mongoURI, { useFindAndModify: true, useUnifiedTopology: true, useNewUrlParser: true})
    const db = mongoose.connection;
    db.on("error", () => {
      console.error("Connection error");
    });
    db.once("open", () => {
      console.log("connected to test DB");
      done();
    })
  });
  describe("Create Store Test", () => {
    describe("Invalid Store Data", () => {

    })
    describe("Valid Store Data", () => {

    })
    it("Shoud be true", () => {
      assert.equal(2, 2);
    })
  })
  after((done) => {
    mongoose.connection.db.dropDatabase()
      .then(() => {
        console.log("Database dropped");
        mongoose.connection.close(done);
      })
      .catch((err: Error) => {
        console.error("error");
      });
  });
});

