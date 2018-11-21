import * as status from "http-status";
import AppResponse from "../../helpers/response";
import logger from "../../logger";
import Models from "../../models";
import { AppCollectionNames, Agent } from "../../types";
import { APP } from "../../config";
import App from "../../App";
import UserService from "../../services/UserService";

const { Queue } = AppCollectionNames;

const { sendData, sendError } = AppResponse;
const { getModel } = Models;

export default (req, res, next) => {
  const { _id } = req.params;
  const QueueModel = getModel(Queue, APP.APP_CLIENTS[0]);

  const updateAgentQueueCount = async agentId => {
    try {
      const res = await UserService.getAgent(agentId);
      const agent = <Agent>res.data.data;

      if (agent) {
        await UserService.updateAgentQueue(agentId, {
          queued: Number(agent.queued) - 1
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const main = async () => {
    try {
      logger.info(`End queue at ${new Date()}`);
      let queue = await QueueModel.findByIdAndUpdate(
        _id,
        { $set: { status: 0 } },
        { new: true }
      );
      if (queue) {
        const { agent } = queue;
        App.appSocket.emitEndQueue({
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
      } else {
        sendData(res, 404, {
          data: null,
          message: "No data found",
          code: status["404"]
        });
      }
      logger.info(`End queue success at ${new Date()}`);
    } catch (error) {
      console.error(error);
      logger.info(`End queue failed at ${new Date()}`);
      sendError(res, 500, {
        errorMessage: "Internal Error",
        code: status["500"]
      });
    }
  };

  main();
};
