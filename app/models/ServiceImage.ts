import mongoose, { Schema, Document } from "mongoose";
import { IService } from "./Service";

export interface IServiceImage extends Document {
  description?: string;
  serviceId: mongoose.Types.ObjectId;
  businessAccountId: mongoose.Types.ObjectId;
  url: string;
  fileName: string;
  imagePath: string;
  absolutePath: string;
  createdAt: Date;
  editedAt?: Date;
}

const ServiceImageSchema: Schema = new Schema({
  description: {
    type: String,
    required: false
  },
  businessAccountId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "Service"
  },
  url: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  absolutePath: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  editedAt: {
    type: Date,
    required: false
  }
});

export default mongoose.model<IServiceImage>("ServiceImage", ServiceImageSchema);