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
const response_1 = require("../../helpers/response");
const logger_1 = require("../../logger");
const types_1 = require("../../types");
const models_1 = require("../../models");
const config_1 = require("../../config");
const { sendData, sendError } = response_1.default;
const { getModel } = models_1.default;
const { Message } = types_1.AppCollectionNames;
exports.default = (req, res, next) => {
    const MessageModel = getModel(Message, config_1.APP.APP_CLIENTS[0]);
    const { pageSize = 10, page = 1, qText = "", status = 1, endDate = "", startDate = "", fields = "" } = req.query;
    const getMessages = () => {
        const textQuery = [];
        let query = {
            status: Number(status)
        };
        if (qText !== "") {
            textQuery.push({
                text: new RegExp(`${qText}`, "ig")
            });
        }
        if (startDate !== "" && endDate !== "") {
            textQuery.push({
                timestamp: { $gte: new Date(startDate), $lt: new Date(endDate) }
            });
        }
        else if (startDate !== "") {
            textQuery.push({
                timestamp: { $gte: new Date(startDate) }
            });
        }
        else if (endDate !== "") {
            textQuery.push({
                timestamp: { $lt: new Date(endDate) }
            });
        }
        if (textQuery.length > 0) {
            query["$and"] = textQuery;
        }
        return MessageModel.find(query, fields)
            .sort({ timestamp: -1 })
            .skip((Number(page) - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .catch(err => {
            throw err;
        });
    };
    const main = () => __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info(`Get messages at ${new Date()}`);
            const messages = yield getMessages();
            sendData(res, 200, {
                data: messages,
                message: "Data Succesfully fetched",
                code: status["200"]
            });
            logger_1.default.info(`Get messages success at ${new Date()}`);
        }
        catch (error) {
            console.log(error);
            logger_1.default.info(`Get messages failed at ${new Date()}`);
            sendError(res, 500, {
                errorMessage: "Internal Error",
                code: status["500"]
            });
        }
    });
    main();
};
//# sourceMappingURL=paginte_message.js.map