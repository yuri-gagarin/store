import fs from "fs";
import path from "path";
import { Types } from "mongoose";
// models, model interfaces and types //
import StoreItem, { IStoreItem } from "../../../models/StoreItem";
import StoreItemImage, { IStoreItemImage } from "../../../models/StoreItemImage"

export const createStoreItemImage = (imgData: IStoreItemImage): Promise<IStoreItemImage> => {
  let image: IStoreItemImage;
  return StoreItemImage.create(imgData)
    .then((img) => {
      image = img;
      return StoreItem.findOneAndUpdate(
        { _id: img.storeItemId },
        { $push: { images: img._id} }
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

export const createStoreItemImages = async (numberofImages: number, storeItem: IStoreItem): Promise<IStoreItemImage[]> => {
  const imagePromises: Promise<IStoreItemImage>[] = [];
  const { _id: storeItemId, storeId, businessAccountId } = storeItem;
  // write path //
  const writeDir = path.join(path.resolve(), "public", "uploads", "store_item_images");
  // samle test image to upload //
  const sampleImagePath = path.join(path.resolve(), "public", "images", "services", "service1.jpeg");
  // resolve the image subdirectory //
  const subDir = path.join(String((businessAccountId as Types.ObjectId)), String(storeItemId));
  const finalDir = path.join(writeDir, subDir);

  try {
    await fs.promises.access(finalDir); 
  } catch (err) {
    if (err && err.code === "ENOENT") {
      try {
        await fs.promises.mkdir(finalDir, { recursive: true });
      } catch (err) {
        throw (err);
      }
    } else {
      throw (err);
    }
  }

  for (let i = 0; i < numberofImages; i++) {
    // check if path exists first //
    // images will go into '/public/uploads/store_item_images/<businessAccountId>/<storeItemId>/
    const imageName = `${i}_${storeItem.name}_test.jpeg`;
    const absolutePath = path.join(finalDir, imageName);
    try {
      await fs.promises.writeFile(absolutePath, await fs.promises.readFile(sampleImagePath));
      const newImage = new StoreItemImage({
        businessAccountId: businessAccountId,
        storeItemId: storeItemId,
        parentStoreId: storeId,
        imagePath: finalDir,
        absolutePath: absolutePath,
        fileName: imageName,
        url: path.join("/", "uploads", "store_item_images", subDir, imageName)
      });

      imagePromises.push(createStoreItemImage(newImage));

    } catch (error) {
      throw error;
    }
  }
  return Promise.all(imagePromises);
};