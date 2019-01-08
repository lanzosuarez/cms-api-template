import * as mongoose from "mongoose";
const { Schema } = mongoose;

const RawSchema = new Schema({
  event_source: String, //client //chatfuel MSBF
  event_name: String, //chat, comment
  attributes: {},
  value: String, //count, money, etc.
  //1, 5000
  numerical_value: {
    default: 1,
    type: Number
  },
  timestamp: {
    default: Date.now,
    type: Date
  }
});

export default RawSchema;
