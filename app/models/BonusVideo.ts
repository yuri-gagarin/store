import mongoose, { Document, Schema } from "mongoose";

declare interface IBonusVideo extends Document {
  description?: string;
  youTubeURL?: string;
  vimeoURL?: string;
  createdAt: Date;
  editedAt?: DataView;
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

export default mongoose.model<IBonusVideo>("BonusVideo", BonusVideoSchema);