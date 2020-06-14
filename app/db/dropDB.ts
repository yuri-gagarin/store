import readLine from "readline";
import mongoose from "mongoose";
import config from "../config/config";

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

const { dbSettings } = config;
const mongoOptions = {
  useNewUrlParser: dbSettings.useNewUrlParser,
  useUnifiedTopology: dbSettings.useUnifiedTopology,
  useFindAndModify: dbSettings.useFindAndModify,
  user: dbSettings.username,
  pass: dbSettings.password
};

const dropDB = () => {
  rl.question("Drop whole development database? Y/N : ", (input) => {
    const reply = input.toLowerCase();
    if (reply === "y") {
      mongoose.connect(dbSettings.mongoURI, mongoOptions, (err) => {
        if (err) throw(err);
      });
      mongoose.connection.once("open", () => {
        mongoose.connection.db.dropDatabase((err, result) => {
          if (err) throw(err);
          console.log(result);
          console.log("Database droppped");
          mongoose.connection.close((err) => {
            if (err) throw(err);
            process.exit(0);
          });
        });
          
      });
    } else {
      console.log("Cancelled");
      process.exit(0);
    }
  });
};

dropDB();

