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
  const { queue } = req.query;
  const MessageModel = getModel(Message, APP.APP_CLIENTS[0]);

  const main = async () => {
    try {
      logger.info(`Read all messages at ${new Date()}`);
      await MessageModel.updateMany(
        { queue: ObjectId(queue), read: false },
        { $set: { read: true } }
      );
      

      sendData(res, 200, {
        data: null,
        message: "Messages read",
        code: status["200"]
      });

      logger.info(`Read messages success at ${new Date()}`);
    } catch (error) {
      console.log(error);
      logger.info(`Read messages failed at ${new Date()}`);
      sendError(res, 500, {
        errorMessage: "Internal Error",
        code: status["500"]
      });
    }
  };

  main();
};
