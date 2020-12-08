import { Request, Response } from "express";
import { Types } from "mongoose";
// models, types, interfaces //
import Service, { IService } from "../models/Service";
import ServiceImage, { IServiceImage } from "../models/ServiceImage";
import { IGenericController } from "./helpers/controllerInterfaces";
// helpers //
import { respondWithDBError, respondWithInputError, 
  deleteFile, respondWithGeneralError, resolveDirectoryOfImg, removeDirectoryWithFiles
} from "./helpers/controllerHelpers";

export type ServiceParams = {
  name: string;
  description: string;
  price: string | number;
  images: ServiceImg[];
}
type ServiceImg = {
  _id: string;
  url: string;
}
type GenericServiceResponse = {
  responseMsg: string;
  newService?: IService;
  editedService?: IService;
  deletedService?: IService;
  service?: IService;
  services?: IService[];
}
type ServiceQueryPar = {
  price?: string;
  name?: string;
  popularity?: string;
  date?: string;
  limit?: string;
}

class ServicesController implements IGenericController {

  getMany (req: Request, res: Response<GenericServiceResponse>): Promise<Response> {
    const { price, name, popularity, date, limit } = req.query as ServiceQueryPar;
    const queryLimit = limit ? parseInt(limit, 10) : 10;
    // optional queries //
    // sort by price //
    if (price) {
      return (
        Service.find({})
          .sort({ price: price }).limit(queryLimit)
          .populate("images").exec()
      )
      .then((services) => {
        return res.status(200).json({
          responseMsg: `Loaded ${services.length} Services and sorted by PRICE ${price.toUpperCase()}`,
          services: services
        });
      })
      .catch((error) => {
        return respondWithDBError(res, error);
      });
    }
    // sort by name alphabetically //
    if (name) {
      return (
        Service.find({})
          .sort({ name: name }).limit(queryLimit)
          .populate("images").exec()
      )
      .then((services) => {
        return res.status(200).json({
          responseMsg: `Loaded ${services.length} Services and sorted by NAME ${name?.toUpperCase()}`,
          services: services
        });
      })
      .catch((error) => {
        return respondWithDBError(res, error);
      });
    }
    // sort by date created //
    if (date) {
      return (
        Service.find({})
          .sort({ createdAt: date }).limit(queryLimit)
          .populate("images").exec()
      )
      .then((services) => {
        return res.status(200).json({
          responseMsg: `Loaded ${services.length} Services and sorted by DATE CREATED ${date.toUpperCase()}`,
          services: services
        })
      })
    }
    // general query //
    return Service.find({})
      .limit(queryLimit)
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

  getOne (req: Request, res: Response<GenericServiceResponse>): Promise<Response>  {
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
    const { name, description, price, images : serviceImages }: ServiceParams = req.body;
    const imgIds: Types.ObjectId[] = [];
    
    if ((serviceImages.length) > 1 && (Array.isArray(serviceImages))) {
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

    const { name, description, price, images : serviceImages }: ServiceParams = req.body;
    const updatedServiceImgs = serviceImages.map((img) => Types.ObjectId(img._id));
    
    return Service.findOneAndUpdate(
      { _id: _id },
      { 
        $set: {
          name: name,
          description: description,
          price: price as number,
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
   const { _id : serviceId } = req.params;
   let serviceToDelete: IService;
   let deletedImages: number;

   if (!serviceId) {
     return respondWithInputError(res, "Can't find service");
   }

   return Service.findOne({ _id: serviceId })
    .populate("images").exec()
    .then((service) => {
      if (service) {
        serviceToDelete = service;
        // first delete all service images //
        if (service.images[0]) {
          const imgData = service.images[0] as IServiceImage;
          const imagesDirectory = resolveDirectoryOfImg(imgData.absolutePath);
          // method looks into directory removes all files within and then directory //
          // for now assumption is there are no subdirectories //
          return removeDirectoryWithFiles(imagesDirectory)
            .then(({ numberRemoved, message }) => {
              return ServiceImage.deleteMany({ serviceId: serviceId})
            })
            .then(( { n }) => {
              n ? deletedImages = n : 0
              return Service.findOneAndDelete({ _id: serviceId })
            })
            .then((deletedService) => {
              if (deletedService) {
                return res.status(200).json({
                  responseMsg: `Deleted Service ${deletedService.name} and ${deletedImages} Service Images`,
                  deletedService: deletedService
                });
              } else {
                return respondWithDBError(res, new Error("Can't resolve DELETE"));
              }
            })
            .catch((error: Error) => {
              return respondWithGeneralError(res, error.message, 500);
            })
        } else {
          // no images present - uploaded with service //
          return Service.findOneAndDelete({ _id: serviceId })
            .then((deletedService) => {
              if (deletedService) {
                return res.status(200).json({
                  responseMsg: `Deleted Service ${deletedService.name}`,
                  deletedService: deletedService
                })
              } else {
                return respondWithGeneralError(res, "Couldn't resolve Service", 500);
              }
            })
            .catch((error) => {
              return respondWithDBError(res, error);
            })
        } 
      } else {
        return respondWithInputError(res, "Can't find service to delete");
      }
    });
  }
}

export default ServicesController;