import * as status from "http-status";
import AppResponse from "../../helpers/response";
import logger from "../../logger";
import Models from "../../models";
import { AppCollectionNames } from "../../types";
import { APP } from "../../config";

const { sendData, sendError } = AppResponse;
const { getModel } = Models;
const { Queue } = AppCollectionNames;

export default (req, res, next) => {
  const QueueModel = getModel(Queue, APP.APP_CLIENTS[0]);

  const main = async () => {
    try {
      logger.info(`Create sku at ${new Date()}`);
      const newQueue = await new QueueModel(req.body).save();
      sendData(res, 201, {
        data: newQueue,
        message: "Data Succesfully created",
        code: status["201"]
      });

      logger.info(`Create sku success at ${new Date()}`);
    } catch (error) {
      console.error(error);
      logger.info(`Create sku failed at ${new Date()}`);
      sendError(res, 500, {
        errorMessage: "Internal Error",
        code: status["500"]
      });
    }
  };

  main();
};
