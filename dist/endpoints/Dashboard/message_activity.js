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
    const { start = "", end = "", client = "" } = req.query;
    const getMessageActivity = () => rawDataModel.aggregate([
        {
            $match: {
                event_name: "chat",
                "attributes.client": client,
                timestamp: { $gte: new Date(start), $lte: new Date(end) }
            }
        },
        {
            $group: {
                _id: "$attributes.is_echo",
                count: { $sum: 1 }
            }
        }
    ]);
    const findIndex = (flag, datas) => datas.findIndex(({ _id }) => _id === flag);
    const closeConnection = () => conn.close();
    const main = () => __awaiter(this, void 0, void 0, function* () {
        try {
            let incomingCount = 0, outgoingCount = 0;
            const datas = yield getMessageActivity();
            const incomingIndex = findIndex(true, datas);
            const outgoingIndex = findIndex(false, datas);
            if (incomingIndex > -1) {
                incomingCount = datas[incomingIndex].count;
            }
            if (outgoingIndex > -1) {
                outgoingCount = datas[outgoingIndex].count;
            }
            sendData(res, 200, {
                data: {
                    incomingCount,
                    outgoingCount,
                    total: incomingCount + outgoingCount
                },
                message: "Data Succesfully fetched",
                code: status["200"]
            });
            closeConnection();
            logger_1.default.info(`Get active users success at ${new Date()}`);
        }
        catch (error) {
            closeConnection();
            console.log(error);
            logger_1.default.info(`Get Get active users  failed at ${new Date()}`);
            sendError(res, 500, {
                errorMessage: "Internal Error",
                code: status["500"]
            });
        }
    });
    main();
};
//# sourceMappingURL=message_activity.js.map