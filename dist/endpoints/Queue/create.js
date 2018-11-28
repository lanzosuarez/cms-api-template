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
const models_1 = require("../../models");
const types_1 = require("../../types");
const config_1 = require("../../config");
const { sendData, sendError } = response_1.default;
const { getModel } = models_1.default;
const { Queue } = types_1.AppCollectionNames;
exports.default = (req, res, next) => {
    const QueueModel = getModel(Queue, config_1.APP.APP_CLIENTS[0]);
    const main = () => __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info(`Create sku at ${new Date()}`);
            const newQueue = yield new QueueModel(req.body).save();
            sendData(res, 201, {
                data: newQueue,
                message: "Data Succesfully created",
                code: status["201"]
            });
            logger_1.default.info(`Create sku success at ${new Date()}`);
        }
        catch (error) {
            console.error(error);
            logger_1.default.info(`Create sku failed at ${new Date()}`);
            sendError(res, 500, {
                errorMessage: "Internal Error",
                code: status["500"]
            });
        }
    });
    main();
};
//# sourceMappingURL=create.js.map