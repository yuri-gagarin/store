import fs from "fs";
import path from "path";
// data models and intefaces //
import Service, { IService } from "../../../models/Service";
import ServiceImage, { IServiceImage } from "../../../models/ServiceImage";

export const createServiceImage = (imgData: IServiceImage): Promise<IServiceImage> => {
  let image: IServiceImage;
  return ServiceImage.create(imgData)
    .then((img) => {
      image = img;
      return Service.findOneAndUpdate(
        { _id: img.serviceId },
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

/**
 * Creates a set number of Service Images for a 'Service' model.
 * @param numberOfImagesToCreate - Number of images to create for particular 'Service' model.
 * @param service - 'Service' model to which the 'ServiceImage' models which be tied to.
 * @returns - A Promise which resolves to IServiceImage[].  
 */
export const createServiceImages = async (numberOfImagesToCreate: number, service: IService): Promise<IServiceImage[]> => {
  const imagePromises: Promise<IServiceImage>[] = [];
  // write path //
  const writeDir = path.join(path.resolve(), "public", "uploads", "service_images");
  // samle test image to upload //
  const sampleImagePath = path.join(path.resolve(), "public", "images", "services", "service1.jpeg");
  // resolve the image subdirectory //
  const serviceId: string = String(service._id);
  const businessAccountId: string = String(service.businessAccountId);
  const subDir: string = path.join(businessAccountId, serviceId);
  const finalDir = path.join(writeDir, subDir);
  // check if path exists first //
  // images will go into {writeDir + service._id}
  try {
    await fs.promises.access(finalDir);
  } catch (err) {
    if (err.code === "ENOENT") {
      try {
        await fs.promises.mkdir(finalDir, { recursive: true });
      } catch (err) {
        throw err;
      }
    } else {
      throw err;
    }
  }

  for (let i = 0; i < numberOfImagesToCreate; i++) {
    const imageName = `${i}_${service.name}_test.jpeg`;
    const absolutePath = path.join(finalDir, imageName);
    try {
      await fs.promises.writeFile(absolutePath,  await fs.promises.readFile(sampleImagePath));
      const newImage = new ServiceImage({
        businessAccountId: businessAccountId,
        serviceId: service._id,
        imagePath: path.join(path.resolve(), "public", "uploads", "service_images", subDir),
        absolutePath: absolutePath,
        fileName: imageName,
        url: path.join("/", "uploads", "service_images", subDir, imageName),
        createdAt: new Date(Date.now()),
        editedAt: new Date(Date.now())
      });
      imagePromises.push(createServiceImage(newImage));

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  return Promise.all(imagePromises);
};