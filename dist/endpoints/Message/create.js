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
const { Message, Queue } = types_1.AppCollectionNames;
const { sendData, sendError } = response_1.default;
const { getModel } = models_1.default;
exports.default = (req, res, next) => {
    const MessageModel = getModel(Message, config_1.APP.APP_CLIENTS[0]);
    const QueueModel = getModel(Queue, config_1.APP.APP_CLIENTS[0]);
    const main = () => __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info(`Create queue at ${new Date()}`);
            let message = new MessageModel(req.body);
            message = yield message.save();
            const queue = yield QueueModel.findById(message.queue);
            //socket here
            switch (message.type) {
                case 0: {
                    //from client emit to agent and admin
                    App_1.default.appSocket.emitClientMessage({ message, agent: queue.agent });
                    break;
                }
                case 1: {
                    //from agent emit to admin
                    App_1.default.appSocket.emitAgentMessageToAdmin({ message });
                    break;
                }
                case 2: {
                    //from admin emit to agent
                    App_1.default.appSocket.emitAdminMessageToAgent({
                        message,
                        agent: queue.agent
                    });
                    break;
                }
            }
            sendData(res, 201, {
                data: null,
                message: "Data Succesfully created",
                code: status["201"]
            });
            logger_1.default.info(`Create qr success at ${new Date()}`);
        }
        catch (error) {
            console.error(error);
            logger_1.default.info(`Create qr failed at ${new Date()}`);
            sendError(res, 500, {
                errorMessage: "Internal Error",
                code: status["500"]
            });
        }
    });
    main();
};
//# sourceMappingURL=create.js.map