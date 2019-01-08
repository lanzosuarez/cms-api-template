import * as status from "http-status";
import AppResponse from "../../helpers/response";
import logger from "../../logger";
import * as mongoose from "mongoose";

import Raw from "../../models/Raw";

const { sendData, sendError } = AppResponse;

export default (req, res, next) => {
  const conn = mongoose.createConnection(process.env.MONGO_URI_MASTER, {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      config: { autoIndex: false },
      useNewUrlParser: true
    }),
    rawDataModel = conn.model("raw-collector", Raw);

  const { start = "", end = "", client = "" } = req.query;

  const getActiveUsers = () =>
    rawDataModel.aggregate([
      {
        $match: {
          event_name: "chat",
          "attributes.client": client,
          timestamp: { $gte: new Date(start), $lte: new Date(end) }
        }
      },
      {
        $group: {
          _id: null,
          clients: { $addToSet: "$attributes.fb_id" }
        }
      }
    ]);

  const closeConnection = () => conn.close();

  const main = async () => {
    try {
      let totalUsers = 0;
      const datas = await getActiveUsers();

      if (datas.length) {
        const [data] = datas;
        totalUsers = data.clients.length;
      }

      sendData(res, 200, {
        data: totalUsers,
        message: "Data Succesfully fetched",
        code: status["200"]
      });

      closeConnection();

      logger.info(`Get active users success at ${new Date()}`);
    } catch (error) {
      closeConnection();
      console.log(error);
      logger.info(`Get Get active users  failed at ${new Date()}`);
      sendError(res, 500, {
        errorMessage: "Internal Error",
        code: status["500"]
      });
    }
  };

  main();
};
