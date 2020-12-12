import { Request, Response } from "express";
import { Types } from "mongoose";
// models and model and interfaces //
import { IAdministrator } from "../../models/Administrator";
import Service, { IService } from "../../models/Service";
import ServiceImage, { IServiceImage } from "../../models/ServiceImage";
import { IGenericController } from "../helpers/controllerInterfaces";
// additional controller types and interfaces //
import { ServiceData, ServiceQueryPar, GenericServiceResponse } from "./type_declartions/servicesControllerTypes";
// helpers //
import { respondWithDBError, respondWithInputError, 
  respondWithGeneralError, resolveDirectoryOfImg, removeDirectoryWithFiles
} from "../helpers/controllerHelpers";
import { validateServiceData } from "./helpers/validationHelpers";
import { NotFoundError, processErrorResponse } from "../helpers/errorHandlers";

/**
 * // NOTES //
 * // By the time any 'ServicesController' actions are called, <Router> should go through //
 * // some custom middleware <verifyAdminAndBusinessAccountId> OR <verifyDataModelAccess> OR BOTH! //
 * // Hence by the time any 'ServiceController' actions are called, it has been established that: //
 * // 1: <req.user> is defined //
 * // 2: <req.user.businessAccountId> is defined for GET_MANY and CREATE actions //
 * // 3: <req.user.businessAccountId> === <service.businessAccountId> for GET_ONE, EDIT, DELETE actions //
 */

class ServicesController implements IGenericController {

  getMany (req: Request, res: Response<GenericServiceResponse>): Promise<Response> {
    const { price, name, popularity, date, limit } = req.query as ServiceQueryPar;
    const businessAccountId = (req.user as IAdministrator).businessAccountId!;
    console.log(30);
    console.log(typeof businessAccountId)
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
    const businessAccountId = (req.user as IAdministrator).businessAccountId!;
    console.log(99)
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
    const { name, description, price, images : serviceImages = []}: ServiceData = req.body;
    const imgIds: Types.ObjectId[] = [];
    const businessAccountId: Types.ObjectId = (req.user as IAdministrator).businessAccountId!;

    const { valid, errorMessages } = validateServiceData(req.body);
    if (!valid) {
      return respondWithInputError(res, "Invalid Data Input", 422, errorMessages);
    }

    const newService= new Service({
      businessAccountId: businessAccountId,
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
      .catch((error) => {
        return processErrorResponse(res, error);
      });
  }

  edit (req: Request, res: Response<GenericServiceResponse>): Promise<Response> {
    const { serviceId } = req.params;
    
    if (!serviceId) {
      return respondWithInputError(res, "Can't resolve service", 400);
    }
    // validate correct input //
    const { valid, errorMessages } = validateServiceData(req.body);
    if (!valid) {
      return respondWithInputError(res, "Invalid Data Input", 422, errorMessages);
    }
    const { name, description, price, images : serviceImages = [] }: ServiceData = req.body;
    const updatedServiceImgs = serviceImages.map((img) => Types.ObjectId(img));
    
    return Service.findOneAndUpdate(
      { _id: serviceId },
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
        if (service) {
          return res.status(200).json({
            responseMsg: "Service Updated",
            editedService: service!
          });
        } else {
          throw new NotFoundError({ 
            errMessage: "Service update error", 
            messages: ["Could not resolve a Service to update" ] 
          });
        }
      })
      .catch((error) => {
        return processErrorResponse(res, error);
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