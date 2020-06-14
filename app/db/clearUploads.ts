import fs from "fs";
import path from "path";
import readLine from "readline";

interface ImagePaths {[index: string]: string}

export const clearFiles = (directory: string): Promise<boolean[]> => {
  const promises: Promise<boolean>[]= [];
  const startPath = path.resolve();
  let files: string[];
  try {
    files = fs.readdirSync(path.join(startPath, directory));
    console.log("Files " + files.length);
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

const startQuestion = `
What would you like to do? \n
1: Delete all uploaded ProductImages \n
2: Delete all uploaded ServiceImages \n
3: Delete all uploaded StoreImages \n
4: Delete All uploaded Images \n
0: Exit \n
input: `
;



const recursiveQuestion = (question: string) => {
  const deleteImages = async (option: number) => {
    const imagePaths: ImagePaths = {
      "1": "/public/uploads/product_images/",
      "2": "/public/uploads/service_images/",
      "3": "/public/uploads/store_images"
    };
    if (option === 4) {
      try {
        // delete all images from all directories //
        let total = 0;
        for (const key in imagePaths) {
          console.log(`\nDeleting images in ${imagePaths[key]}`);
          const result = await clearFiles(imagePaths[key]);
          console.log("Result " + result.length);
          total += result.length;
        }
        console.log(`Deleted ${total} images\n`);
        recursiveQuestion(startQuestion);
      } catch (err) {
        throw(err);
      }  
    } else {
      try {
        const directory = imagePaths[option.toString()];
        console.log(`\nDeleting Images from ${directory}`);
        const result = await clearFiles(directory);
        console.log(`Deleted ${result.length} images\n`);
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
      console.log("exiting");
      process.exit(0);
    }
    switch (userInput) {
      case 1: {
        console.log("\nDeleting uploaded ProductImages");
        //rl.close();
        return deleteImages(1);
      }
      case 2: {
        console.log("\nDeleting uploaded ServiceImages");
        //rl.close();
        return deleteImages(2);
      }
      case 3: {
        console.log("\nDeleting uploaded StoreImages");
        //rl.close();
        return deleteImages(3); 
      }
      case 4: {
        console.log("\nDeleting all uploaded Images");
        //rl.close();
        return(deleteImages(4));
        return;
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
