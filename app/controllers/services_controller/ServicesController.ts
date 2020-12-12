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
 * // 1: <req.user> is defined as IAdministrator model //
 * // 2: <req.user.businessAccountId> is defined for GET_MANY and CREATE actions //
 * // 3: <req.user.businessAccountId> === <service.businessAccountId> for GET_ONE, EDIT, DELETE actions //
 */

class ServicesController implements IGenericController {

  getMany (req: Request, res: Response<GenericServiceResponse>): Promise<Response> {
    const { price, name, popularity, date, limit } = req.query as ServiceQueryPar;
    const { businessAccountId } = req.user as IAdministrator;
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
    return Service.find({ businessAccountId: businessAccountId })
      .limit(queryLimit)
      .populate("images").exec()
      .then((services) => {
        return res.status(200).json({
          responseMsg: "Loaded all services",
          services: services
        });
      })
      .catch((error) => {
        return processErrorResponse(res, error);
      });
  }

  getOne (req: Request, res: Response<GenericServiceResponse>): Promise<Response>  {
    const businessAccountId = (req.user as IAdministrator).businessAccountId!;
    const serviceId: string = req.params._id;

    if (!serviceId) return respondWithInputError(res, "Can't find specific service");

    return Service.findOne({ businessAccountId: businessAccountId })
      .where({ _id: serviceId })
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
        return processErrorResponse(res, error);
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
    const { businessAccountId } = req.user as IAdministrator;
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
      { businessAccountId: businessAccountId, 
        _id: serviceId 
      },
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
    )
    .populate("images").exec()
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
   const { serviceId } = req.params;
   const { businessAccountId } = (req.user as IAdministrator)
   let serviceToDelete: IService;
   let deletedImages: number;

   if (!serviceId) {
     return respondWithInputError(res, "Can't find service");
   }

   return (
    Service
      .findOne({ businessAccountId: businessAccountId })
      .where({ _id: serviceId })
      .populate("images")
      .exec()
    )
    .then((service) => {
      if (service) {
        return Promise.resolve(service);
      } else {
        throw new NotFoundError({ messages: [ "Requested Service to delete was not found in the database" ] });
      }
    })
    .then((service) => {
      // first delete all service images if any //
      if (service.images[0]) {
        const imgData = service.images[0] as IServiceImage;
        // method looks into directory removes all files within and then directory //
        // for now assumption is there are no subdirectories //
        return removeDirectoryWithFiles(imgData.imagePath)
      } else {
        return Promise.resolve({ numberRemoved: 0, message: "No Images to delete" });
      } 
    })
    .then(({ numberRemoved, message }) => {
      if (numberRemoved > 0) {
        return ServiceImage.deleteMany({ serviceId: serviceId }).exec();
      } else {
        return Promise.resolve({ response: { n: 0, ok: true }, deletedCount: 0 });
      }
    })
    .then(({ n }) => {
      (n && n > 0) ? deletedImages = n : 0;
      return Service.findOneAndDelete({ _id: serviceId }).exec();
    })
    .then((deletedService) => {
      if (deletedService) {
        return res.status(200).json({
          responseMsg: `Deleted Service ${deletedService.name} and ${deletedImages} Service Images`,
          deletedService: deletedService
        });
      } else {
        throw new NotFoundError({ 
          errMessage: "Error deleting Service",  
          messages: [ "Could not find Service to delete in database" ] 
        });
      }
    })
    .catch((error) => {
      return processErrorResponse(res, error);
    });
  }
}

export default ServicesController;