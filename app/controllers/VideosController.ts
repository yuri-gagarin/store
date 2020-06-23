import { Request, Response } from "express";
import BonusVideo, { IBonusVideo } from "../models/BonusVideo";
import { IGenericController } from "./helpers/controllerInterfaces";
// helpers //
import { respondWithDBError, respondWithInputError,  respondWithGeneralError } from "./helpers/controllerHelpers";

interface IGenericVideoRes {
  responseMsg: string;
  newVideo?: IBonusVideo;
  editedVideo?: IBonusVideo;
  deletedVideo?: IBonusVideo;
  video?: IBonusVideo;
  videos?: IBonusVideo[];
}
export type BonusVideoParams = {
  description?: string;
  youTubeURL?: string;
  vimeoURL?: string;
  createdAt: Date;
  editedAt?: Date;
}

class ProductsController implements IGenericController {

  index (req: Request, res: Response<IGenericVideoRes>): Promise<Response> {
    return BonusVideo.find({})
      .then((videos) => {
        return res.status(200).json({
          responseMsg: "Loaded all videos",
          videos: videos
        });
      })
      .catch((error) => {
        return respondWithDBError(res, error);
      });
  }

  get (req: Request, res: Response<IGenericVideoRes>): Promise<Response>  {
    const _id: string = req.params._id;
  
    if (!_id) return respondWithInputError(res, "Can't find video");

    return BonusVideo.findOne({ _id: _id })
      .then((video) => {
        if (video) {
          return res.status(200).json({
            responseMsg: "Returned video",
            video: video
          });
        } else {
          return respondWithInputError(res, "Could not find Video", 404);
        }
      })
      .catch((error) => {
        return respondWithDBError(res, error);
      });
  }

  create (req: Request, res: Response<IGenericVideoRes>): Promise<Response> {
    const { description, youTubeURL, vimeoURL }: BonusVideoParams = req.body;

    const newVideo = new BonusVideo({
      description: description,
      youTubeURL: youTubeURL,
      vimeoURL: vimeoURL
    });

    return newVideo.save()
      .then((newVideo) => {
        return res.status(200).json({
          responseMsg: "New Video created",
          newVideo: newVideo
        });
      })
      .catch((err) => {
        return respondWithDBError(res, err);
      });
  }

  edit (req: Request, res: Response<IGenericVideoRes>): Promise<Response> {
    const { _id } = req.params;
    const { description, youTubeURL,vimeoURL }: BonusVideoParams = req.body;

    if (!_id) {
      return respondWithInputError(res, "Can't resolve Product", 400);
    }

    return BonusVideo.findOneAndUpdate(
      { _id: _id },
      { 
        $set: {
          description: description,
          youTubeURL: youTubeURL,
          vimeoURL: vimeoURL,
          editedAt: new Date()
        },
      },
      { new: true }
     )
      .then((editedVideo) => {
        return res.status(200).json({
          responseMsg: "Video updated",
          editedVideo: editedVideo!
        });
      })
      .catch((error) => {
        console.error(error);
        return respondWithDBError(res, error);
      });
       
  }

  delete (req: Request, res: Response<IGenericVideoRes>): Promise<Response> {
   const { _id } = req.params;

   if (!_id) {
     return respondWithInputError(res, "Can't resolve Video");
   }

   return BonusVideo.findOneAndDelete({ _id: _id})
    .then((deletedVideo) => {
      if (deletedVideo) {
        return res.status(200).json({
          responseMsg: "Deleted Video",
          deletedVideo: deletedVideo
        });
      } else {
        return respondWithInputError(res, "Can't find Product to delete");
      }
    })
    .catch((err: Error) => {
      return respondWithGeneralError(res, err.message, 400);
    });
  }
};

export default ProductsController;