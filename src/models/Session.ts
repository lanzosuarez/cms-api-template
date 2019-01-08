import * as mongoose from "mongoose";
const { Schema } = mongoose;

const SessionSchema = new Schema({
  messenger_id: String,
  image: String,
  body: [
    {
      timestamp: { type: Date, default: Date.now }
    }
  ],
  last_activity: { type: Date, default: Date.now }
});

export default SessionSchema;
