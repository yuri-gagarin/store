import mongoose, { Error } from "mongoose";
import config from "../../config/config";
import chalk from "chalk";

export const setupDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (mongoose.connection.readyState === 1) {
      resolve(true)
    } else {
      mongoose.connect(config.dbSettings.mongoURI, { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true});
      const db = mongoose.connection;
      db.on("error", () => {
        reject(new Error("Couldnt establish database connection"));
      });
      db.once("open", () => {
        resolve(true);
      });
    }
  });
};

export const clearDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    mongoose.connection.db.dropDatabase()
      .then(() => {
        console.log(chalk.bgBlue.bold.white(`Dropped Database, Moving to next test suite`));
        resolve(true);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};


