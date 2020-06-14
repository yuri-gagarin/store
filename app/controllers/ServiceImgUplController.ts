import { Request, Response } from "express";
import Service, { IService} from "../models/Service";
import ServiceImage, { IServiceImage } from "../models/ServiceImage";
// types and interfaces //
import { IGenericImgUploadCtrl } from './helpers/controllerInterfaces';
import { IImageUploadDetails } from "./image_uploaders/types/types";
// helpers //
import { respondWithInputError, respondWithDBError, normalizeImgUrl, deleteFile, respondWithGeneralError } from "./helpers/controllerHelpers";

type ServiceImgResponse = {
  responseMsg: string;
  newServiceImage?: IServiceImage;
  deletedServiceImage?: IServiceImage;
  updatedService: IService;
}

class ServiceImgUploadController implements IGenericImgUploadCtrl {

  createImage (req: Request, res: Response<ServiceImgResponse>): Promise<Response> {
    const { _service_id: serviceId } = req.params;
    const uploadDetails = res.locals.uploadDetails as IImageUploadDetails;
    const { success, imagePath, fileName, absolutePath } = uploadDetails;
    let newImage: IServiceImage;

    if (success && imagePath && absolutePath) {
      return normalizeImgUrl(absolutePath)
        .then((imgUrl) => {
          return ServiceImage.create({
            serviceId: serviceId,
            url: imgUrl,
            fileName: fileName,
            imagePath: imagePath,
            absolutePath: absolutePath
          })
        .then((serviceImage) => {
          newImage = serviceImage;
          return Service.findOneAndUpdate(
            { _id: serviceId },
            { $push: { images: serviceImage._id } },
            { upsert: true, new: true }
          ).populate("images").exec();
        })
        .then((updatedService) => {
          return res.status(200).json({
            responseMsg: "Store image uploaded",
            newServiceImage: newImage,
            updatedService: updatedService
          });
        })
        .catch((err) => {
          return respondWithDBError(res, err);
        });
      });
    } else {
      return respondWithInputError(res, "Image not uploaded", 400);
    }
  }

  deleteImage (req: Request, res: Response<ServiceImgResponse>): Promise<Response> {
    const { _id: imgId, _service_id: serviceId } = req.params;
    let deletedImage: IServiceImage;
    console.log(61);
    if (!imgId) {
      return respondWithInputError(res, "Can't resolve image to delete", 400);
    }
    return ServiceImage.findById(imgId)
      .then((serviceImg) => {
        if (serviceImg) {
          return deleteFile(serviceImg.absolutePath)
            .then(() => {
              return ServiceImage.findOneAndDelete({ _id: imgId });
            })
            .then((image) => {
              deletedImage = image!;
              return Service.findOneAndUpdate(
                { _id: serviceId },
                { $pull: { images: imgId } },
                { new: true }
              ).populate("images").exec();
            })
            .then((updatedService) => {
              return res.status(200).json({
                responseMsg: "Image deleted",
                deletedServiceImage: deletedImage,
                updatedService: updatedService!
              });
            })
            .catch((err) => {
              console.error(err);
              return respondWithDBError(res, err);
            });
          } else {
            return respondWithGeneralError(res, "Message", 400);
          }
        })
        .catch((err) => {
          return respondWithDBError(res, err);
        });
  }
  /*
  private parallelQuery (): Promise<boolean> {
    return new Promise((resolve, reject) => {

    })
  }
  */
}

export default ServiceImgUploadController;