import { Router } from "express";
// general uploader //
import ImageUploader from "../controllers/image_uploaders/ImageUploader";
// routes imports and controllers //
// stores //
import StoreController from "../controllers/StoreController";
import StoreRoutes from "./StoreRoutes";
import StoreImageRoutes from "./StoreImageRoutes";
import StoreImageUploadController from "../controllers/StoreImgUplController";
// store items //
import StoreItemsController from "../controllers/StoreItemsController";
import StoreItemRoutes from "../routes/StoreItemRoutes";
import StoreItemImageRoutes from "./StoreItemImageRoutes";
import StoreItemImgUploadController from "../controllers/StoreItemImgUplController";
// products //
import ProductsController from "../controllers/ProductsController";
import ProductRoutes from "./ProductRoutes";
import ProductImageRoutes from "./ProductImageRoutes";
import ProductImageUploadController from "../controllers/ProductImgUplController";
// services //
import ServicesController from "../controllers/ServicesController";
import ServicesRoutes from "./ServicesRoutes";
import ServiceImagesRoutes from "./ServiceImageRoutes";
import ServiceImgUploadController from "../controllers/ServiceImgUplController";
// videos //
import BonusVideosController from "../controllers/BonusVideosController";
import BonnusVideosRoutes from "../routes/BonusVideoRoutes";

class CombineRoutes {
  constructor(router: Router) {
    this.combine(router);
  }
  private combine = (Router: Router): void => {
    // stores and images //
    new StoreRoutes(Router, new StoreController());
    new StoreImageRoutes(Router, new StoreImageUploadController(), new ImageUploader("storeImage", 10));
    // store items and images //
    new StoreItemRoutes(Router, new StoreItemsController());
    new StoreItemImageRoutes(Router, new StoreItemImgUploadController(), new ImageUploader("storeItemImage", 10));
    // products and images //
    new ProductRoutes(Router, new ProductsController());
    new ProductImageRoutes(Router, new ProductImageUploadController(), new ImageUploader("productImage", 10));
    // services and images //
    new ServicesRoutes(Router, new ServicesController());
    new ServiceImagesRoutes(Router, new ServiceImgUploadController(), new ImageUploader("serviceImage", 10));
    // videos //
    new BonnusVideosRoutes(Router, new BonusVideosController());
  }
}

export default CombineRoutes;