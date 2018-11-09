import * as status from "http-status";
import AppResponse from "../../helpers/response";
import logger from "../../logger";
import Models from "../../models";
import { AppCollectionNames, Agent } from "../../types";
import { APP } from "../../config";
import UserService from "../../services/UserService";
import App from "../../App";

const { Queue } = AppCollectionNames;

const { sendData, sendError } = AppResponse;
const { getModel } = Models;

export default (req, res, next) => {
  const QueueModel = getModel(Queue, APP.APP_CLIENTS[0]);

  const getBestAgent = () =>
    UserService.getBestAgent()
      .then(res => res.data.data._id)
      .catch(err => {
        throw err;
      });

  const updateAgentQueueCount = async agentId => {
    try {
      const res = await UserService.getAgent(agentId);
      const agent = <Agent>res.data.data;
      console.log(agent);
      if (agent) {
        await UserService.updateAgentQueue(agentId, {
          queued: Number(agent.queued) + 1
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const main = async () => {
    try {
      logger.info(`Create queue at ${new Date()}`);
      const best_agent = await getBestAgent();
      console.log(best_agent);

      if (best_agent) {
        req.body.agent = best_agent;
      }

      let queue = new QueueModel(req.body);
      queue = await queue.save();

      //update agent info

      await updateAgentQueueCount(best_agent);

      //socket here
      App.appSocket.emitNewQueue({ queue, agent: best_agent });

      sendData(res, 201, {
        data: queue,
        message: "Data Succesfully created",
        code: status["201"]
      });

      logger.info(`Create queue success at ${new Date()}`);
    } catch (error) {
      console.error(error);
      logger.info(`Create queue failed at ${new Date()}`);
      sendError(res, 500, {
        errorMessage: "Internal Error",
        code: status["500"]
      });
    }
  };

  main();
};
