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
const Session_1 = require("../../models/Session");
const User_1 = require("../../models/User");
const { sendData, sendError } = response_1.default;
exports.default = (req, res, next) => {
    const conn = mongoose.createConnection(process.env.MONGO_URI_MASTER, {
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        config: { autoIndex: false },
        useNewUrlParser: true
    }), SessionModel = conn.model("sm-sessions", Session_1.default), UseModel = conn.model("sm-users", User_1.default);
    const getUser = messenger_id => UseModel.findOne({ messenger_id }, "name");
    const getRecentTranscripts = () => SessionModel.find()
        .sort({ last_activity: -1 })
        .limit(5);
    const getTransCriptsUser = transcripts => transcripts.map((t) => __awaiter(this, void 0, void 0, function* () {
        const user = yield getUser(t.messenger_id);
        return Object.assign({}, t._doc, { user });
    }));
    const closeConnection = () => conn.close();
    const main = () => __awaiter(this, void 0, void 0, function* () {
        try {
            let transcripts = yield getRecentTranscripts();
            let ts = yield Promise.all(getTransCriptsUser(transcripts));
            sendData(res, 200, {
                data: ts,
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
//# sourceMappingURL=recent_transcripts.js.map