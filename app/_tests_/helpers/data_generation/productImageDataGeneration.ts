import PATH from "path";
import fs from "fs";
// models, model types and interfaces //
import Product, { IProduct } from "../../../models/Product";
import ProductImage, { IProductImage } from "../../../models/ProductImage";


export const createProductImage = (imgData: IProductImage): Promise<IProductImage> => {
  let image: IProductImage;
  return ProductImage.create(imgData)
    .then((img) => {
      image = img;
      return Product.findOneAndUpdate(
        { _id: img.productId },
        { $push: { images: img._id } }
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

export const createProductImages = async (numberOfImagesToCreate: number, product: IProduct): Promise<IProductImage[]> => {
  const imagePromises: Promise<IProductImage>[] = [];
  // write path //
  const writeDir = PATH.join(PATH.resolve(), "public", "uploads", "product_images");
  // samle test image to upload //
  const sampleImagePath = PATH.join(PATH.resolve(), "public", "images", "services", "service1.jpeg");
  // resolve the image subdirectory //
  const productId: string = String(product._id);
  const businessAccountId: string = String(product.businessAccountId);
  const subDir: string = PATH.join(businessAccountId, productId);
  const finalDir = PATH.join(writeDir, subDir);
  // check if PATH exists first //
  // images will go into '/writeDir/<businessAccountId>/<productId>/'
   
  try {
    await fs.promises.access(finalDir);
  } catch (err) {
    if (err.code === "ENOENT") {
      try {
        await fs.promises.mkdir(finalDir, { recursive: true });
      } catch (err) {
        console.log(48);
        console.log(err)
        throw err;
      }
    } else {
      console.log(53)
      console.log(err)
      throw err;
    }
  }
  for (let i = 0; i < numberOfImagesToCreate; i++) {
    const imageName = `${i}_${product.name}_test.jpeg`;
    const absolutePath = PATH.join(finalDir, imageName);
    try {
      await fs.promises.writeFile(absolutePath, await fs.promises.readFile(sampleImagePath));
      const newImage = new ProductImage({
        businessAccountId: businessAccountId,
        productId: product._id,
        imagePath: PATH.join(PATH.resolve(), "public", "uploads", "product_images", subDir),
        absolutePath: absolutePath,
        fileName: imageName,
        url: PATH.join("/" + "uploads", "product_images", subDir, imageName),
        createdAt: new Date(Date.now()),
        editedAt: new Date(Date.now())
      });
      imagePromises.push(createProductImage(newImage));

    } catch (error) {
      throw error;
    }
  }
  return Promise.all(imagePromises);
};