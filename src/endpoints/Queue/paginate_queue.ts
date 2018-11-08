import * as status from "http-status";
import AppResponse from "../../helpers/response";
import logger from "../../logger";
import { AppCollectionNames } from "../../types";
import Models from "../../models";
import { APP } from "../../config";

const { sendData, sendError } = AppResponse;
const { getModel } = Models;
const { Queue } = AppCollectionNames;

export default (req, res, next) => {
  const QueueModel = getModel(Queue, APP.APP_CLIENTS[0]);
  const {
    pageSize = 10,
    page = 1,
    qName = "",
    status = 1,
    qSort = "-1",
    fields = "",
    startDate = "",
    endDate = ""
  } = req.query;

  const getQueues = () => {
    const textQuery: any = [];
    let query: any = {
      status: Number(status)
    };
    if (qName !== "") {
      textQuery.push({
        name: new RegExp(`${qName}`, "ig")
      });
    }

    if (startDate !== "" && endDate !== "") {
      textQuery.push({
        timestamp: { $gte: new Date(startDate), $lt: new Date(endDate) }
      });
    } else if (startDate !== "") {
      textQuery.push({
        timestamp: { $gte: new Date(startDate) }
      });
    } else if (endDate !== "") {
      textQuery.push({
        timestamp: { $lt: new Date(endDate) }
      });
    }

    if (textQuery.length > 0) {
      query["$and"] = textQuery;
    }

    return QueueModel.find(query, fields)
      .sort({ timestamp: Number(qSort) })
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .catch(err => {
        throw err;
      });
  };

  const main = async () => {
    try {
      logger.info(`Get queues at ${new Date()}`);
      const queues = await getQueues();

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
