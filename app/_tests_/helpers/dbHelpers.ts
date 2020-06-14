import mongoose, { Error } from "mongoose";
import config from "../../config/config";

export const setupDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    mongoose.connect(config.dbSettings.mongoURI, { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true});
    const db = mongoose.connection;
    db.on("error", () => {
      reject(new Error("Couldnt establish database connection"));
    });
    db.once("open", () => {
      resolve(true);
    });
  });
};

export const clearDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    mongoose.connection.db.dropDatabase()
      .then(() => {
        mongoose.connection.close((err) => {
          if (err) console.log(err);
          resolve(true);
        });
      })
    .catch((err: Error) => {
      reject(err);
    });
  });
};


