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
const UserService_1 = require("../../services/UserService");
const App_1 = require("../../App");
const { Queue } = types_1.AppCollectionNames;
const { sendData, sendError } = response_1.default;
const { getModel } = models_1.default;
exports.default = (req, res, next) => {
    const QueueModel = getModel(Queue, config_1.APP.APP_CLIENTS[0]);
    const getBestAgent = () => UserService_1.default.getBestAgent()
        .then(res => res.data.data)
        .catch(err => {
        throw err;
    });
    const updateAgentQueueCount = (agentId) => __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield UserService_1.default.getAgent(agentId);
            const agent = res.data.data;
            console.log(agent);
            if (agent) {
                yield UserService_1.default.updateAgentQueue(agentId, {
                    queued: Number(agent.queued) + 1
                });
            }
        }
        catch (error) {
            console.error(error);
        }
    });
    const main = () => __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info(`Create queue at ${new Date()}`);
            const best_agent = yield getBestAgent();
            console.log("best agent", best_agent);
            if (best_agent) {
                req.body.agent = best_agent._id;
            }
            let queue = new QueueModel(req.body);
            queue = yield queue.save();
            //update agent info
            yield updateAgentQueueCount(best_agent._id);
            //socket here
            App_1.default.appSocket.emitNewQueue({ queue, agent: best_agent });
            sendData(res, 201, {
                data: Object.assign({}, queue._doc, { agent: { _id: best_agent._id, name: best_agent.username } }),
                message: "Data Succesfully created",
                code: status["201"]
            });
            logger_1.default.info(`Create queue success at ${new Date()}`);
        }
        catch (error) {
            console.error(error);
            logger_1.default.info(`Create queue failed at ${new Date()}`);
            sendError(res, 500, {
                errorMessage: "Internal Error",
                code: status["500"]
            });
        }
    });
    main();
};
//# sourceMappingURL=create.js.map