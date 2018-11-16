import * as status from "http-status";
import AppResponse from "../../helpers/response";
import logger from "../../logger";
import * as mongoose from "mongoose";
import { AppCollectionNames } from "../../types";
import Models from "../../models";
import { APP } from "../../config";

const { sendData, sendError } = AppResponse;
const { getModel } = Models;
const { Message } = AppCollectionNames;
const {
  Types: { ObjectId }
} = mongoose;

export default (req, res, next) => {
  const MessageModel = getModel(Message, APP.APP_CLIENTS[0]);
  const { queue } = req.query;

  const main = async () => {
    try {
      logger.info(`Get queues at ${new Date()}`);
      let unreadCount = await MessageModel.countDocuments({
        queue: ObjectId(queue),
        read: false
      });

      sendData(res, 200, {
        data: unreadCount,
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
