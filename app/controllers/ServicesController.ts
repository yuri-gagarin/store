import { Request, Response } from "express";
import { Types } from "mongoose";
// models, types, interfaces //
import Service, { IService } from "../models/Service";
import ServicePicture, { IServicePicture } from "../models/ServicePicture";
import { IGenericController } from "./helpers/controllerInterfaces";
// helpers //
import { respondWithDBError, respondWithInputError, deleteFile, respondWithGeneralError } from "./helpers/controllerHelpers";

type ServiceImg = {
  _id: string;
  url: string;
}
type ServiceParams = {
  name: string;
  description: string;
  price: string;
  serviceImages: ServiceImg[];
}
type GenericServiceResponse = {
  responseMsg: string;
  newService?: IService;
  editedService?: IService;
  deletedService?: IService;
  service?: IService;
  services?: IService[];
}

class ServicesController implements IGenericController {

  index (req: Request, res: Response<GenericServiceResponse>): Promise<Response> {
    return Service.find({})
      .populate("images").exec()
      .then((services) => {
        return res.status(200).json({
          responseMsg: "Loaded all services",
          services: services
        });
      })
      .catch((error) => {
        return respondWithDBError(res, error);
      });
  }

  get (req: Request, res: Response<GenericServiceResponse>): Promise<Response>  {
    const _id: string = req.params._id;
    if (!_id) return respondWithInputError(res, "Can't find specific service");

    return Service.findOne({ _id: _id })
      .populate("images").exec()
      .then((service) => {
        if (service) {
          return res.status(200).json({
            responseMsg: "Service found",
            service: service
          });
        } else {
          return respondWithInputError(res, "Could not find service", 404);
        }
      })
      .catch((error) => {
        return respondWithDBError(res, error);
      });
  }

  create (req: Request, res: Response<GenericServiceResponse>): Promise<Response> {
    const { name, description, price, serviceImages }: ServiceParams = req.body;
    const imgIds: Types.ObjectId[] = [];

    if (serviceImages.length > 1) {
      for (const newImg of serviceImages) {
        imgIds.push(Types.ObjectId(newImg.url));
      }
    }

    const newService= new Service({
      name: name,
      description: description,
      price: price,
      images: imgIds
    });

    return newService.save()
      .then((newService) => {
        return res.status(200).json({
          responseMsg: "New service created",
          newService: newService
        });
      })
      .catch((err) => {
        return respondWithDBError(res, err);
      });
  }
  edit (req: Request, res: Response<GenericServiceResponse>): Promise<Response> {
    const { _id } = req.params;
    
    if (!_id) {
      return respondWithInputError(res, "Can't resolve service", 400);
    }

    const { name, description, price, serviceImages }: ServiceParams = req.body;
    const updatedServiceImgs = serviceImages.map((img) => Types.ObjectId(img._id));
    
    return Service.findOneAndUpdate(
      { _id: _id },
      { 
        $set: {
          name: name,
          description: description,
          price: price,
          images: [ ...updatedServiceImgs ],
          editedAt: new Date()
        },
      },
      { new: true }
     ).populate("images").exec()
      .then((service) => {
        return res.status(200).json({
          responseMsg: "Service Updated",
          editedService: service!
        });
      })
      .catch((error: Error) => {
        console.error(error);
        return respondWithDBError(res, error);
      });
       
  }

  delete (req: Request, res: Response<GenericServiceResponse>): Promise<Response> {
   const { _id } = req.params;
   let deletedImages: number;

   if (!_id) {
     return respondWithInputError(res, "Can't find service");
   }

   return Service.findOne({ _id: _id})
    .populate("images")
    .then((service) => {
      // first delete all service images //
      if (service) {
        const serviceImgPaths = service.images.map((image) => {
          return (image as IServicePicture).absolutePath;
        });
        const serviceImgIds: Types.ObjectId[] = service.images.map((image) => {
          return (image as IServicePicture)._id;
        });
        const deletePromises: Promise<boolean>[] = [];

        for (const path of serviceImgPaths) {
          deletePromises.push(deleteFile(path));
        }

        return Promise.all(deletePromises)
          .then(() => {
            return ServicePicture.deleteMany({ _id: { $in: [ ...serviceImgIds ] } })
              .then(({ n }) => {
                n ? deletedImages = n : 0;
                return Service.findOneAndDelete({ _id: _id });
              })
              .then((deletedService) => {
                if (deletedService) {
                  return res.status(200).json({
                    responseMsg: "Deleted the Service and " + deletedImages,
                    deletedService: deletedService
                  });
                }
                else {
                  return respondWithDBError(res, new Error("Can't resolve delete"));
                }
                
              })
              .catch((error) => {
                return respondWithDBError(res, error);
              });
          })
          .catch((err: Error) => {
            return respondWithGeneralError(res, err.message, 400);
          });
      } else {
        return respondWithInputError(res, "Can't find service to delete");
      }
    });
  }
}

export default ServicesController;