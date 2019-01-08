"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const { Schema } = mongoose;
const AnalyticsSchema = new Schema({
    type: { type: String, required: true },
    value: {},
    dimension: {},
    client: { type: String },
    timestamp: { type: Date, default: Date.now }
}, { strict: false });
exports.default = AnalyticsSchema;
//# sourceMappingURL=Analytics.js.map