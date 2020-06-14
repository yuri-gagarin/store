import fs from "fs";
import path from "path"
import readLine from "readline";

export const clearFiles = (directory: string): Promise<boolean[]> => {
  const promises: Promise<boolean>[]= [];
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      promises.push(new Promise((resolve, reject) => {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) {
            console.error(err);
            reject(false);
          }
          resolve(true);
        })
      }));
    }
  });
  return Promise.all(promises);
}

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log("hello")
let response = "";

while (!response) {
  rl.question("Clear All uploaded images? Y/N: \n", (input) => {
    response = input.toLowerCase();
    switch (input) {
      case "y":
        break;
      case "n":
        break;
      case "exit":
        process.exit(0);
    }
  });
}
