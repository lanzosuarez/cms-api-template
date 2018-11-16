import { AppCollectionNames } from "../types/SchemaTypes";
import Models from ".";
import * as mongoose from "mongoose";

const { Schema } = mongoose;
const { Message } = AppCollectionNames;

export default (): void => {
  const MessageSchema = new Schema({
    queue: { type: Schema.Types.ObjectId, required: true },
    agent: {
      _id: Schema.Types.ObjectId,
      name: { type: String, required: true }
    },
    message: {
      text: { type: String, required: false },
      attachments: [{ type: String, required: true }]
    },
    type: { type: Number, default: 1 }, //1-agent 0-client //2-admin
    read: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    timestamp: {
      default: Date.now,
      type: Date
    }
  });

  MessageSchema.index({ client: 1, agent: 1, queue: 1 });
  const MessageModel = Models.createModel(Message, MessageSchema);

  Models.addModel(Message, MessageModel);
};
