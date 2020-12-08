import { Router} from "express";
import { RouteConstructor } from "./helpers/routeInterfaces";
import { IGenericController } from "../controllers/helpers/controllerInterfaces";

class BonusVideoRoutes extends RouteConstructor<IGenericController> {
  private viewAllBonusVideosRoute = "/api/bonus_videos";
  private viewBonusVideoRoute = "/api/bonus_videos/:_id";
  private createBonusVideoRoute = "/api/bonus_videos/create";
  private editBonusVideoRoute = "/api/bonus_videos/update/:_id";
  private deleteBonusVideoRoute = "/api/bonus_videos/delete/:_id";
  
  constructor (router: Router, controller: IGenericController) {
    super(router, controller);
    this.initializeRoutes();
  }
  protected initializeRoutes (): void {
    this.getAllBonusVideos();
    this.getBonusVideo();
    this.createBonusVideo();
    this.editBonusVideo();
    this.deleteBonusVideo();
  }
  private getAllBonusVideos (): void {
    this.Router.route(this.viewAllBonusVideosRoute).get(this.controller.getMany);
  }
  private getBonusVideo (): void {
    this.Router.route(this.viewBonusVideoRoute).get(this.controller.getOne);
  }
  private createBonusVideo (): void {
    this.Router.route(this.createBonusVideoRoute).post(this.controller.create);
  }
  private editBonusVideo (): void {
    this.Router.route(this.editBonusVideoRoute).patch(this.controller.edit);
  }
  private deleteBonusVideo (): void {
    this.Router.route(this.deleteBonusVideoRoute).delete(this.controller.delete);
  }
}

export default BonusVideoRoutes;