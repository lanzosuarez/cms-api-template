import * as mongoose from "mongoose";
const { Schema } = mongoose;

const AnalyticsSchema = new Schema(
  {
    type: { type: String, required: true },
    value: {},
    dimension: {}, //month //year //day //hour
    client: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { strict: false }
);

export default AnalyticsSchema;
