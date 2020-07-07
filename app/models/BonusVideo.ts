import mongoose, { Document, Schema } from "mongoose";

export interface IBonusVideo extends Document {
  description?: string;
  youTubeURL?: string;
  vimeoURL?: string;
  createdAt: Date;
  editedAt?: Date;
}

const BonusVideoSchema: Schema = new Schema({
  description: {
    type: String,
    required: false
  },
  youTubeURL: {
    type: String,
    required: false
  },
  vimeoURL: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  editedAt: {
    type: Date
  }
});

const urls = ["youTubeURL", "vimeoURL"];

BonusVideoSchema.pre("validate", function(next) {
  let hasUrl = false;
  const model = this as IBonusVideo;
  if (model.youTubeURL || model.vimeoURL) {
    hasUrl = true;
  }
  return hasUrl ? next() : next(new Error("No valid video URL provided"));
});

export default mongoose.model<IBonusVideo>("BonusVideo", BonusVideoSchema);