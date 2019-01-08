import * as status from "http-status";
import AppResponse from "../../helpers/response";
import logger from "../../logger";
import * as mongoose from "mongoose";

import Raw from "../../models/Raw";

const { sendData, sendError } = AppResponse;

export default (req, res, next) => {
  const conn = mongoose.createConnection(process.env.ANALYTICS_URI, {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      config: { autoIndex: false },
      useNewUrlParser: true
    }),
    rawDataModel = conn.model("raw-collector", Raw);

  const { client = "", event_name = "", field = "" } = req.query;
  
  console.log(field)

  const getTopMessages = flag =>
    rawDataModel.aggregate([
      {
        $match: {
          "attributes.client": client,
          "attributes.type": flag,
          event_name
        }
      },
      {
        $group: {
          _id: `$attributes.${field}`,
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

  const closeConnection = () => conn.close();

  const main = async () => {
    try {
      logger.info(`Get top messages at ${new Date()}`);

      const incomings = await getTopMessages("incoming");
      const outgoings = await getTopMessages("outgoing");

      console.log(incomings)

      sendData(res, 200, {
        data: { incomings, outgoings },
        message: "Data Succesfully fetched",
        code: status["200"]
      });

      closeConnection();

      logger.info(`Get top messages success at ${new Date()}`);
    } catch (error) {
      console.log(error);
      closeConnection();
      logger.info(`Get top messages failed at ${new Date()}`);
      sendError(res, 500, {
        errorMessage: "Internal Error",
        code: status["500"]
      });
    }
  };

  main();
};
