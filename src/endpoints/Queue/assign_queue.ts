import * as status from "http-status";
import AppResponse from "../../helpers/response";
import logger from "../../logger";
import Models from "../../models";
import { AppCollectionNames } from "../../types";
import { APP } from "../../config";

const { Queue } = AppCollectionNames;

const { sendData, sendError } = AppResponse;
const { getModel } = Models;

export default (req, res, next) => {
  const { _id } = req.params;
  const { agent } = req.body;
  const QueueModel = getModel(Queue, APP.APP_CLIENTS[0]);

  const main = async () => {
    try {
      logger.info(`Assign queue at ${new Date()}`);
      let queue = await QueueModel.findByIdAndUpdate(
        _id,
        { $set: { agent } },
        { new: true }
      );
      if (queue) {
        sendData(res, 200, {
          data: queue,
          message: "Queue successfully assigned to agent",
          code: status["200"]
        });
      } else {
        sendData(res, 404, {
          data: null,
          message: "Assign failed. No data found",
          code: status["404"]
        });
      }
      logger.info(`Update queue success at ${new Date()}`);
    } catch (error) {
      console.error(error);
      logger.info(`Update queue failed at ${new Date()}`);
      sendError(res, 500, {
        errorMessage: "Internal Error",
        code: status["500"]
      });
    }
  };

  main();
};
