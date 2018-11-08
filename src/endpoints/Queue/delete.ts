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
  const QueueModel = getModel(Queue, APP.APP_CLIENTS[0]);

  const main = async () => {
    try {
      logger.info(`Delete queue at ${new Date()}`);
      let queue = await QueueModel.findByIdAndRemove(_id);
      if (queue) {
        sendData(res, 200, {
          data: queue,
          message: "Data Succesfully deleted",
          code: status["201"]
        });
      } else {
        sendData(res, 404, {
          data: null,
          message: "No data found",
          code: status["404"]
        });
      }
      logger.info(`Delete queue success at ${new Date()}`);
    } catch (error) {
      console.error(error);
      logger.info(`Delete queue failed at ${new Date()}`);
      sendError(res, 500, {
        errorMessage: "Internal Error",
        code: status["500"]
      });
    }
  };

  main();
};
