import path from "path";
import fs from "fs";
// models and model types and interfaces //
import Store, { IStore } from "../../../models/Store";
import StoreImage, { IStoreImage } from "../../../models/StoreImage";

export const createStoreImage = (imgData: IStoreImage): Promise<IStoreImage>=> {
  let image: IStoreImage;
  return StoreImage.create(imgData)
    .then((img) => {
      image = img;
      return Store.findOneAndUpdate(
        { _id: img.storeId}, 
        { $push: { images: img._id} },
        );
    })
    .then(() => {
      return image;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    })
};

export const createStoreImages = async (numOfImagesToCreate: number, store: IStore): Promise<IStoreImage[]> => {
  const imagePromises: Promise<IStoreImage>[] = [];
  // write path //
  const writeDir = path.join(path.resolve(), "public", "uploads", "store_images");
  // samle test image to upload //
  const sampleImagePath = path.join(path.resolve(), "public", "images", "services", "service1.jpeg");
  
  for (let i = 0; i < numOfImagesToCreate; i++) {
    // check if path exists first //
    // images will go into '/writeDir/<businessAccountId>/<storeId>/'
    const storeId: string = store._id;
    const businessAccountId: string = String(store.businessAccountId);
    const subDir: string = path.join(String(businessAccountId), String(storeId));
    const finalDir = path.join(writeDir, subDir);
    try {
      await fs.promises.access(finalDir, fs.constants.F_OK);
    } catch (err) {
      if (err.code === "ENOENT") {
        await fs.promises.mkdir(finalDir, { recursive: true });
      }
    } 
    
    for (let j = 0; j < numOfImagesToCreate; j++) {
      const imageName = `${i}_${j}_${store.title}_test.jpeg`;
      const absolutePath = path.join(finalDir, imageName);
      try {
        await fs.promises.writeFile(absolutePath, await fs.promises.readFile(sampleImagePath));
        const newImage = new StoreImage({
          businessAccountId: store.businessAccountId,
          storeId: store._id,
          imagePath: path.join(path.resolve(), "public", "uploads", "store_images", subDir),
          absolutePath: absolutePath,
          fileName: imageName,
          url: path.join("/" + "uploads", "store_images", subDir, imageName)
        });
        imagePromises.push(createStoreImage(newImage));
  
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
  return Promise.all(imagePromises);
};