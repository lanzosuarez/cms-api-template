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
const UserService_1 = require("../../services/UserService");
const { Queue } = types_1.AppCollectionNames;
const { sendData, sendError } = response_1.default;
const { getModel } = models_1.default;
exports.default = (req, res, next) => {
    const { _id } = req.params;
    const QueueModel = getModel(Queue, config_1.APP.APP_CLIENTS[0]);
    const updateAgentQueueCount = (agentId) => __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield UserService_1.default.getAgent(agentId);
            const agent = res.data.data;
            if (agent) {
                yield UserService_1.default.updateAgentQueue(agentId, {
                    queued: Number(agent.queued) - 1
                });
            }
        }
        catch (error) {
            console.error(error);
        }
    });
    const main = () => __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info(`End queue at ${new Date()}`);
            let queue = yield QueueModel.findByIdAndUpdate(_id, { $set: { status: 0 } }, { new: true });
            if (queue) {
                const { agent } = queue;
                App_1.default.appSocket.emitEndQueue({
                    queue,
                    agent: agent._id
                });
                console.log(agent._id);
                updateAgentQueueCount(agent._id.toString());
                sendData(res, 200, {
                    data: queue,
                    message: "Data Succesfully updated",
                    code: status["200"]
                });
            }
            else {
                sendData(res, 404, {
                    data: null,
                    message: "No data found",
                    code: status["404"]
                });
            }
            logger_1.default.info(`End queue success at ${new Date()}`);
        }
        catch (error) {
            console.error(error);
            logger_1.default.info(`End queue failed at ${new Date()}`);
            sendError(res, 500, {
                errorMessage: "Internal Error",
                code: status["500"]
            });
        }
    });
    main();
};
//# sourceMappingURL=end_queue.js.map