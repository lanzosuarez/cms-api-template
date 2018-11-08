import { AppCollectionNames } from "../types/SchemaTypes";
import Models from ".";
import * as mongoose from "mongoose";

const { Schema } = mongoose;
const { Queue } = AppCollectionNames;

export default (): void => {
  const QueueSchema = new Schema({
    agent: { type: Schema.Types.ObjectId, required: true },
    fb_id: { type: String, required: true },
    client: { type: String, required: true },
    status: { type: Number, default: 1 },
    timestamp: {
      default: new Date(),
      type: Date
    }
  });

  QueueSchema.index({ agent: 1, client: 1, fb_id: 1 });
  const QueueModel = Models.createModel(Queue, QueueSchema);

  Models.addModel(Queue, QueueModel);
};
