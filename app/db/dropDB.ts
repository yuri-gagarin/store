import readLine from "readline";
import mongoose from "mongoose";
import chalk from "chalk";
import config from "../config/config";

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

const { dbSettings } = config;


const dropDB = () => {
  const greeting = chalk.bgRed.bold.white("Drop the whoe dvelopment database? Y/N: ")
  rl.question(greeting, (input) => {
    const reply = input.toLowerCase();
    if (reply === "y") {
      mongoose.connect(dbSettings.mongoURI, dbSettings.connectionOptions, (err) => {
        if (err) throw(err);
      });
      mongoose.connection.once("open", () => {
        mongoose.connection.db.dropDatabase((err, result) => {
          if (err) throw(err);
          console.log(chalk.bgGreen.bold.black("Database droppped"));
          mongoose.connection.close((err) => {
            if (err) throw(err);
            process.exit(0);
          });
        });
          
      });
    } else {
      console.log(chalk.bgRed.bold.white("Cancelled"));
      process.exit(0);
    }
  });
};

dropDB();

