"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const { Schema } = mongoose;
const RawSchema = new Schema({
    event_source: String,
    event_name: String,
    attributes: {},
    value: String,
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
exports.default = RawSchema;
//# sourceMappingURL=Raw.js.map