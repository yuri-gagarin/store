import path from "path";
import fs from "fs";

type ImageDirectoryDetails = {
  imageModel: string;
  imageDirectories: string[];
  imageSubDirectories: string[];
  imageFiles: string[];
  totalImageDirectories: number;
  totalImageSubdirectories: number;
  totalImageFiles: number;
}
export const getImageUploadData = (...paths: string []): ImageDirectoryDetails => {
  const firstString = paths[0].split("_")[0]; 
  const modelName = firstString[0].toUpperCase() + firstString.substr(1) + "Image";
  //
  const imageUplPath = path.join(path.resolve(), "public", "uploads", ...paths);
  const imageUplSubdirectories: string[] = [];
  const imageFiles: string[] = [];

  try {
    const imageUplDirectories = fs.readdirSync(imageUplPath).map((dir) => {
      return path.join(imageUplPath, dir);
    });

    for (const imgUplDirectory of imageUplDirectories) {
      const subdirectories = fs.readdirSync(imgUplDirectory).map((subdir) => {
        return path.join(imgUplDirectory, subdir);
      })
      imageUplSubdirectories.push(...subdirectories);
    }

    for (const imgUplSubdirectory of imageUplSubdirectories) {
      const files = fs.readdirSync(imgUplSubdirectory);
      imageFiles.push(...files);
    }

    return {
      imageModel: modelName,
      imageDirectories: imageUplDirectories,
      imageSubDirectories: imageUplSubdirectories,
      imageFiles: imageFiles,
      totalImageDirectories: imageUplDirectories.length,
      totalImageSubdirectories: imageUplSubdirectories.length,
      totalImageFiles: imageFiles.length
    };
  } catch (error) {
    throw error;
  }
  
};