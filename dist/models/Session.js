"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
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
exports.default = SessionSchema;
//# sourceMappingURL=Session.js.map