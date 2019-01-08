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
const App_1 = require("../../App");
const MessengerService_1 = require("../../services/MessengerService");
const mongoose = require("mongoose");
const Raw_1 = require("../../models/Raw");
const { Message, Queue } = types_1.AppCollectionNames;
const { sendData, sendError } = response_1.default;
const { getModel } = models_1.default;
exports.default = (req, res, next) => {
    const conn = mongoose.createConnection(process.env.MONGO_URI_MASTER, {
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        config: { autoIndex: false },
        useNewUrlParser: true
    }), rawDataModel = conn.model("raw-collector", Raw_1.default);
    const MessageModel = getModel(Message, config_1.APP.APP_CLIENTS[0]);
    const QueueModel = getModel(Queue, config_1.APP.APP_CLIENTS[0]);
    const [_, client] = config_1.APP.APP_CLIENTS[0].split("-");
    const updateQueueLastActivity = (msg) => __awaiter(this, void 0, void 0, function* () {
        const { queue } = req.body;
        return QueueModel.findByIdAndUpdate(queue, {
            $set: { last_activity: msg }
        });
    });
    const getMessageType = () => {
        const { message } = req.body;
        const { text, attachments } = message;
        if (text && attachments && attachments.length > 0) {
            return "template";
        }
        else if (text) {
            return "text";
        }
        else if (attachments && attachments.length > 0) {
            return "image";
        }
    };
    const sendMessage = fb_id => {
        const { message } = req.body;
        const { text, attachments } = message;
        if (text && attachments && attachments.length > 0) {
            MessengerService_1.default.sendMessageText(text, fb_id);
            attachments.forEach(attachment => MessengerService_1.default.sendMessageWithAttachment(attachment, fb_id));
        }
        else if (text) {
            MessengerService_1.default.sendMessageText(text, fb_id);
        }
        else if (attachments && attachments.length > 0) {
            attachments.forEach(attachment => MessengerService_1.default.sendMessageWithAttachment(attachment, fb_id));
        }
        createRaw(fb_id, true, req.body.message, getMessageType());
        console.log("create raw");
    };
    const createRaw = (fb_id, is_echo, message, type) => {
        const attributes = {
            fb_id,
            is_echo,
            type,
            client,
            message
        };
        const raw = new rawDataModel({
            attributes,
            event_name: "chat",
            event_source: "msbf",
            numerical_value: 1
        });
        raw.save();
    };
    const main = () => __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info(`Create message at ${new Date()}`);
            let message = new MessageModel(req.body);
            message = yield message.save();
            const queue = yield updateQueueLastActivity(message._id);
            const agent = req.body.agent._id;
            //socket here
            switch (message.type) {
                case 0: {
                    console.log("client message");
                    //from client emit to agent and admin
                    App_1.default.appSocket.emitClientMessage({
                        message,
                        agent,
                        queue
                    });
                    const { fb_id } = yield QueueModel.findById(req.body.queue);
                    createRaw(fb_id, false, req.body.message, getMessageType());
                    break;
                }
                case 1: {
                    //from agent emit to admin
                    App_1.default.appSocket.emitAgentMessageToAdmin({ message, queue });
                    const { fb_id } = yield QueueModel.findById(req.body.queue);
                    sendMessage(fb_id);
                    break;
                }
                case 2: {
                    //from admin emit to agent
                    App_1.default.appSocket.emitAdminMessageToAgent({
                        message,
                        agent,
                        queue
                    });
                    const { fb_id } = yield QueueModel.findById(req.body.queue);
                    sendMessage(fb_id);
                    break;
                }
            }
            sendData(res, 201, {
                data: message,
                message: "Data Succesfully created",
                code: status["201"]
            });
            logger_1.default.info(`Create message success at ${new Date()}`);
        }
        catch (error) {
            console.error(error);
            logger_1.default.info(`Create message failed at ${new Date()}`);
            sendError(res, 500, {
                errorMessage: "Internal Error",
                code: status["500"]
            });
        }
    });
    main();
};
//# sourceMappingURL=create.js.map