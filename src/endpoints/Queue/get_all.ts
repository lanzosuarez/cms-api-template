import * as status from "http-status";
import AppResponse from "../../helpers/response";
import logger from "../../logger";

import { AppCollectionNames } from "../../types";
import * as mongoose from "mongoose";
import Models from "../../models";
import { APP } from "../../config";

const { sendData, sendError } = AppResponse;
const { getModel } = Models;
const { Queue } = AppCollectionNames;

export default (req, res, next) => {
  const QueueModel = getModel(Queue, APP.APP_CLIENTS[0]);

  const main = async () => {
    try {
      logger.info(`Get queues at ${new Date()}`);
      let queues = await QueueModel.find();

      sendData(res, 200, {
        data: queues,
        message: "Data Succesfully fetched",
        code: status["200"]
      });

      logger.info(`Get queues success at ${new Date()}`);
    } catch (error) {
      console.log(error);
      logger.info(`Get queues failed at ${new Date()}`);
      sendError(res, 500, {
        errorMessage: "Internal Error",
        code: status["500"]
      });
    }
  };

  main();
};
