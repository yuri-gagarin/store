import fs, { readdirSync } from "fs";
import path from "path";
import chalk from "chalk";
import readLine from "readline";

interface ImagePaths {[index: string]: string}

export const clearFiles = (directory: string): Promise<boolean[]> => {
  const promises: Promise<boolean>[]= [];
  const startPath = path.resolve();
  let files: string[];
  try {
    files = fs.readdirSync(path.join(startPath, directory));
    console.log(chalk.bgWhite.bold.black("Files " + files.length));
  }
  catch (err) {
    throw(err);
  }
  for (const file of files) {
    const deletePromise = new Promise<boolean>((resolve, reject) => {
      fs.unlink(path.join(startPath, directory, file), (err) => {
        if (err) {
          console.error(err);
          reject(false);
        }
        resolve(true);
      });
    });
    promises.push(deletePromise);
  }
  
  return Promise.all(promises);
};



const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

const startQuestion = chalk.bgWhite.bold.black(`
  What would you like to do?
  ${chalk.bold.blue(1)}: Delete all uploaded ${chalk.bold.red("Product Images")}
  ${chalk.bold.blue(2)}: Delete all uploaded ${chalk.bold.red("Service Images")}
  ${chalk.bold.blue(3)}: Delete all uploaded ${chalk.bold.red("Store Images")}
  ${chalk.bold.blue(4)}: Delete All uploaded ${chalk.bold.red("Store Item Images")}
  ${chalk.bold.blue(5)}: Delete All uploaded ${chalk.bold.red("Images")}
  ${chalk.bold.blue(0)}: Exit
  input:`);



const recursiveQuestion = (question: string) => {
  const deleteImages = async (option: number) => {
    const imagePaths: ImagePaths = {
      "1": "/public/uploads/product_images/",
      "2": "/public/uploads/service_images/",
      "3": "/public/uploads/store_images/",
      "4": "/public/uploads/store_item_images/"
    };
    if (option === 5) {
      const startDirectory =  path.join(path.resolve(), "public", "uploads")
      const files = fs.readdirSync(startDirectory);
      for (const file of files) {
        const stats = fs.statSync(path.join(startDirectory, file))
        if (stats.isFile()) {
          fs.unlink(path.join(startDirectory, file), (err) => {
            if (err) {
              console.log(chalk.bgRed.bold.white("An ERROR occured"));
              console.log(chalk.bgRed.bold.white(err.message));
            }
            console.log(chalk.bgGreen.bold.red(`Deleted File: ${file}`));
          });
        } else if (stats.isDirectory()) {
          fs.rmdir(path.join(startDirectory, file), { recursive: true }, (err) => {
            if (err) {
              console.log(chalk.bgRed.bold.white("An ERROR occured"));
              console.log(chalk.bgRed.bold.white(err.message));
            }
            console.log(chalk.bgGreen.bold.red(`Delted Directory ${path.join(startDirectory, file)}`));
          });
        }
      }
    } else {
      try {
        let result: boolean[] = [];
        const directory = imagePaths[option.toString()];
        console.log(chalk.bgYellowBright.bold.black`Deleting Images from ${chalk.bold.blue(directory)}.`);
        const imageDirectories = readdirSync(path.join(path.resolve(), directory));
        if (imageDirectories.length) {
          for (let i = 0; i < imageDirectories.length; i++) {
            let deleteImages = await clearFiles(path.join(directory, imageDirectories[i]))
            result.concat(deleteImages)
          }
          console.log(chalk.bgBlue.bold.white(`Deleted ${result.length} images.`));
        }
        recursiveQuestion(startQuestion);
      } catch (err) {
        throw(err);
      }
    }
  };

  let userInput: number;
  rl.question(question, (input) => {
    userInput = parseInt(input.trim());
    if (userInput === 0) {
      rl.close();
      console.log(chalk.bgWhite.bold.red("exiting"));
      process.exit(0);
    }
    switch (userInput) {
      case 1: {
        console.log(chalk.bgWhiteBright.bold.blue("Deleting uploaded ProductImages"));
        //rl.close();
        return deleteImages(1);
      }
      case 2: {
        console.log(chalk.bgWhiteBright.bold.blue("Deleting uploaded ServiceImages"));
        //rl.close();
        return deleteImages(2);
      }
      case 3: {
        console.log(chalk.bgWhiteBright.bold.blue("Deleting uploaded StoreImages"));
        //rl.close();
        return deleteImages(3); 
      }
      case 4: {
        console.log(chalk.bgWhiteBright.bold.blue("Deleting uploaded StoreItemImages"));
        return deleteImages(4); 
      }
      case 4: {
        console.log(chalk.bgWhiteBright.bold.blue("Deleting all uploaded Images"));
        //rl.close();
        return(deleteImages(5));
      }
      case 5: {
        return deleteImages(5);
      }
      case 0: {
        process.exit(0);
      }
    }
    recursiveQuestion(question);
  });
};

const launch = () => {
  recursiveQuestion(startQuestion);
};
launch();
