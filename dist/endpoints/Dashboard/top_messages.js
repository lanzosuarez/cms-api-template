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
const Raw_1 = require("../../models/Raw");
const { sendData, sendError } = response_1.default;
exports.default = (req, res, next) => {
    const conn = mongoose.createConnection(process.env.MONGO_URI_MASTER, {
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        config: { autoIndex: false },
        useNewUrlParser: true
    }), rawDataModel = conn.model("raw-collector", Raw_1.default);
    const { client = "", event_name = "" } = req.query;
    const getTopMessages = flag => rawDataModel.aggregate([
        {
            $match: {
                "attributes.client": client,
                "attributes.is_echo": flag,
                "attributes.type": "text",
                event_name
            }
        },
        {
            $group: {
                _id: `$attributes.message.text`,
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);
    const closeConnection = () => conn.close();
    const main = () => __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info(`Get top messages at ${new Date()}`);
            const incomings = yield getTopMessages(false);
            const outgoings = yield getTopMessages(true);
            sendData(res, 200, {
                data: { incomings, outgoings },
                message: "Data Succesfully fetched",
                code: status["200"]
            });
            closeConnection();
            logger_1.default.info(`Get top messages success at ${new Date()}`);
        }
        catch (error) {
            console.log(error);
            closeConnection();
            logger_1.default.info(`Get top messages failed at ${new Date()}`);
            sendError(res, 500, {
                errorMessage: "Internal Error",
                code: status["500"]
            });
        }
    });
    main();
};
//# sourceMappingURL=top_messages.js.map