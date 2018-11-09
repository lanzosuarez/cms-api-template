import { AppCollectionNames } from "../types/SchemaTypes";
import Models from ".";
import * as mongoose from "mongoose";

const { Schema } = mongoose;
const { Message } = AppCollectionNames;

export default (): void => {
  const MessageSchema = new Schema({
    queue: { type: Schema.Types.ObjectId, required: true },
    agent: { type: String, required: false },
    message: {
      type: {
        text: String,
        attachments: [{ type: String, required: true }]
      },
      required: true
    },
    type: { type: Number, default: 1 }, //1-agent 0-client //2-admin
    read: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    timestamp: {
      default: new Date(),
      type: Date
    }
  });

  MessageSchema.index({ client: 1, agent: 1, queue: 1 });
  const MessageModel = Models.createModel(Message, MessageSchema);

  Models.addModel(Message, MessageModel);
};
