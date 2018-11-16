"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchemaTypes_1 = require("../types/SchemaTypes");
const _1 = require(".");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Message } = SchemaTypes_1.AppCollectionNames;
exports.default = () => {
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
        type: { type: Number, default: 1 },
        read: { type: Boolean, default: false },
        status: { type: Number, default: 1 },
        timestamp: {
            default: Date.now,
            type: Date
        }
    });
    MessageSchema.index({ client: 1, agent: 1, queue: 1 });
    const MessageModel = _1.default.createModel(Message, MessageSchema);
    _1.default.addModel(Message, MessageModel);
};
//# sourceMappingURL=Message.js.map