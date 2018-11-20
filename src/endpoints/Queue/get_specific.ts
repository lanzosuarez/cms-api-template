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
const {
  Types: { ObjectId }
} = mongoose;

export default (req, res, next) => {
  const { by, value, fields } = req.query;
  const QueueModel = getModel(Queue, APP.APP_CLIENTS[0]);

  const createQuery = () => {
    let status = 1;
    switch (by) {
      case "fb_id": {
        return { fb_id: value, status };
      }
      case "id": {
        return { _id: ObjectId(value), status };
      }
    }
  };

  const main = async () => {
    try {
      logger.info(`Get queue at ${new Date()}`);
      console.log("here");
      let queue = await QueueModel.findOne(createQuery(), fields);

      if (queue) {
        sendData(res, 200, {
          data: queue,
          message: "Data Succesfully fetched",
          code: status["200"]
        });
      } else {
        sendData(res, 200, {
          data: null,
          message: "No data found",
          code: status["200"]
        });
      }

      logger.info(`Get queue success at ${new Date()}`);
    } catch (error) {
      console.log(error);
      logger.info(`Get queue failed at ${new Date()}`);
      sendError(res, 500, {
        errorMessage: "Internal Error",
        code: status["500"]
      });
    }
  };

  main();
};
