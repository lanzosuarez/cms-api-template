import * as status from "http-status";
import AppResponse from "../../helpers/response";
import logger from "../../logger";
import { AppCollectionNames } from "../../types";
import Models from "../../models";
import { APP } from "../../config";

const { sendData, sendError } = AppResponse;
const { getModel } = Models;
const { Message } = AppCollectionNames;

export default (req, res, next) => {
  const MessageModel = getModel(Message, APP.APP_CLIENTS[0]);
  const {
    pageSize = 10,
    page = 1,
    qText = "",
    status = 1,
    endDate = "",
    startDate = "",
    fields = ""
  } = req.query;

  const getMessages = () => {
    const textQuery: any = [];
    let query: any = {
      status: Number(status)
    };
    if (qText !== "") {
      textQuery.push({
        text: new RegExp(`${qText}`, "ig")
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

    return MessageModel.find(query, fields)
      .sort({ timestamp: -1 })
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .catch(err => {
        throw err;
      });
  };

  const main = async () => {
    try {
      logger.info(`Get messages at ${new Date()}`);
      const messages = await getMessages();

      sendData(res, 200, {
        data: messages,
        message: "Data Succesfully fetched",
        code: status["200"]
      });

      logger.info(`Get messages success at ${new Date()}`);
    } catch (error) {
      console.log(error);
      logger.info(`Get messages failed at ${new Date()}`);
      sendError(res, 500, {
        errorMessage: "Internal Error",
        code: status["500"]
      });
    }
  };

  main();
};
