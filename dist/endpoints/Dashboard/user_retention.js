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
const Raw_1 = require("../../models/Raw");
const User_1 = require("../../models/User");
const { sendData, sendError } = response_1.default;
const { getModel } = models_1.default;
const { Message } = types_1.AppCollectionNames;
exports.default = (req, res, next) => {
    const conn = mongoose.createConnection(process.env.MONGO_URI_MASTER, {
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        config: { autoIndex: false },
        useNewUrlParser: true
    }), rawDataModel = conn.model("raw-collector", Raw_1.default), 
    // userDataModel = conn.model(`${APP.APP_NAME}-users`, User);
    userDataModel = conn.model(`likhaan-users`, User_1.default);
    const { start = "", end = "", client = "" } = req.query;
    const checkUserIfExist = fb_id => rawDataModel.findOne({
        timestamp: { $lt: new Date(start) },
        "attributes.fb_id": fb_id
    });
    const getUserChats = () => rawDataModel.aggregate([
        {
            $match: {
                "attributes.client": client,
                timestamp: { $gte: new Date(start), $lte: new Date(end) },
                event_name: "chat"
            }
        },
        {
            $group: {
                _id: null,
                clients: { $addToSet: "$attributes.fb_id" }
            }
        }
    ]);
    const closeConnection = () => conn.close();
    const main = () => __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info(`Get user retention start at ${new Date()}`);
            let newee = 0, returnee = 0, total = yield userDataModel.estimatedDocumentCount();
            const datas = yield getUserChats();
            if (datas.length) {
                const [data] = datas;
                console.log("user retention", datas);
                yield Promise.all(data.clients.map((d) => __awaiter(this, void 0, void 0, function* () {
                    const check = yield checkUserIfExist(d);
                    if (check) {
                        //if another doc exist add 1 to returnee
                        returnee += 1;
                        return;
                    }
                    //if no add 1 to new
                    newee += 1;
                })));
            }
            sendData(res, 200, {
                data: { returnee, newee, total },
                message: "Data Succesfully fetched",
                code: status["200"]
            });
            closeConnection();
            logger_1.default.info(`Get user retention success at ${new Date()}`);
        }
        catch (error) {
            closeConnection();
            console.log(error);
            logger_1.default.info(`Get user retention failed at ${new Date()}`);
            sendError(res, 500, {
                errorMessage: "Internal Error",
                code: status["500"]
            });
        }
    });
    main();
};
//# sourceMappingURL=user_retention.js.map