"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchemaTypes_1 = require("../types/SchemaTypes");
const _1 = require(".");
const mongoose = require("mongoose");
const config_1 = require("../config");
const { Schema } = mongoose;
const { Queue } = SchemaTypes_1.AppCollectionNames;
exports.default = () => {
    const QueueSchema = new Schema({
        agent: { type: Schema.Types.ObjectId, required: true },
        fb_id: { type: String, required: true },
        client: { type: String, required: true },
        status: { type: Number, default: 1 },
        last_activity: {
            required: false,
            type: Schema.Types.ObjectId,
            ref: `${config_1.APP.APP_CLIENTS[0]}-Message`
        },
        timestamp: {
            default: Date.now,
            type: Date
        }
    });
    QueueSchema.index({ agent: 1, client: 1, fb_id: 1 });
    const QueueModel = _1.default.createModel(Queue, QueueSchema);
    _1.default.addModel(Queue, QueueModel);
};
//# sourceMappingURL=Queue.js.map