import fs from "fs";
import readline from "readline";
import path from "path";
import chalk from "chalk";

export const clearEmptyDirectories = (directory: string): void => {
  const promises: Promise<boolean>[] = [];
  const startPath = path.join(path.resolve(), "public", "uploads", directory);
  fs.readdir(startPath, (err, files) => {
    if (err) {
      throw err;
    }
    if (!files.length) {
      console.log("appears to be empty");
      return;
    }
    for (const dir of files) {
      fs.readdir(path.join(startPath, dir), (err, files): void => {
        if (files.length === 0) {
          fs.rmdir(path.join(startPath, dir), (err) => {

          })
        }
        else {
          console.log("Directory: " + path.join(startPath, dir) + " is NOT Empty");
        }

      })
    }
  })
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const startQuestion = chalk.bgWhite.bold.black(`
What would you like to do?
${chalk.bold.blue(1)}: Clean up ${chalk.bold.red("product_images")} Directory
${chalk.bold.blue(2)}: Clean up ${chalk.bold.red("service_images")} Directory
${chalk.bold.blue(3)}: Clean up ${chalk.bold.red("store_images")} Directory
${chalk.bold.blue(4)}: Clean up ${chalk.bold.red("store_item_images")} Directory
${chalk.bold.blue(0)}: Exit
input:`);

const reqursiveQuestion = (question: string) => {
  let answer: string;
  rl.question(question, (input) => {
    answer = input.toString();
    switch (answer) {
      case ("1"): 
        clearEmptyDirectories("product_images");
        reqursiveQuestion(question)
        break;
      case ("2"): 
        clearEmptyDirectories("service_images");
        reqursiveQuestion(question);
        break;
      case ("3"):
        clearEmptyDirectories("store_images");
        reqursiveQuestion(question);
        break;
      case ("4"): 
        clearEmptyDirectories("store_item_images");
        reqursiveQuestion(question);
        break;
      case ("0"): 
        console.log("exiting");
        process.exit(0);
    }
  })
}

const launch = () => {
  reqursiveQuestion(startQuestion);
}
launch();