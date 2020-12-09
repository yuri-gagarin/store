import { Types } from "mongoose";

export type StoreData = {
  title: string;
  description: string;
  images?: (string | Types.ObjectId)[];
}