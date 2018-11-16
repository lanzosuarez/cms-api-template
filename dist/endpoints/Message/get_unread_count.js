"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const status = require("http-status");
const response_1 = require("../../helpers/response");
const logger_1 = require("../../logger");
const mongoose = require("mongoose");
const types_1 = require("../../types");
const models_1 = require("../../models");
const config_1 = require("../../config");
const { sendData, sendError } = response_1.default;
const { getModel } = models_1.default;
const { Message } = types_1.AppCollectionNames;
const { Types: { ObjectId } } = mongoose;
exports.default = (req, res, next) => {
    const MessageModel = getModel(Message, config_1.APP.APP_CLIENTS[0]);
    const { queue } = req.query;
    const main = () => __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info(`Get queues at ${new Date()}`);
            let unreadCount = yield MessageModel.countDocuments({
                queue: ObjectId(queue),
                read: false
            });
            sendData(res, 200, {
                data: unreadCount,
                message: "Data Succesfully fetched",
                code: status["200"]
            });
            logger_1.default.info(`Get queues success at ${new Date()}`);
        }
        catch (error) {
            console.log(error);
            logger_1.default.info(`Get queues failed at ${new Date()}`);
            sendError(res, 500, {
                errorMessage: "Internal Error",
                code: status["500"]
            });
        }
    });
    main();
};
//# sourceMappingURL=get_unread_count.js.map