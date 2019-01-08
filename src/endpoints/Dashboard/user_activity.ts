import * as status from "http-status";
import AppResponse from "../../helpers/response";
import logger from "../../logger";
import * as mongoose from "mongoose";

import Raw from "../../models/Raw";
import User from "../../models/User";

import * as moment from "moment";

const { sendData, sendError } = AppResponse;

export default (req, res, next) => {
  const conn = mongoose.createConnection(process.env.MONGO_URI_MASTER, {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      config: { autoIndex: false },
      useNewUrlParser: true
    }),
    rawDataModel = conn.model("raw-collector", Raw),
    // userDataModel = conn.model(`${APP.APP_NAME}-users`, User);
    userDataModel = conn.model(`likhaan-users`, User);

  const { start = "", end = "", client = "" } = req.query;

  const checkUserIfExist = fb_id =>
    rawDataModel.findOne({
      timestamp: {
        $gte: moment(new Date(start))
          .subtract(1, "w")
          .startOf("w")
          .toDate(),
        $lte: moment(new Date(start))
          .subtract(1, "w")
          .endOf("w")
          .toDate()
      },
      "attributes.fb_id": fb_id
    });

  const getUserChats = () =>
    rawDataModel.aggregate([
      {
        $match: {
          "attributes.client": client,
          timestamp: { $gte: new Date(start), $lte: new Date(end) },
          event_name: "chat"
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
      logger.info(`Get user retention start at ${new Date()}`);
      let newee = 0,
        returnee = 0,
        total = await userDataModel.estimatedDocumentCount();

      const datas = await getUserChats();
      if (datas.length) {
        const [data] = datas;
        console.log("user retention", datas);
        await Promise.all(
          data.clients.map(async d => {
            const check = await checkUserIfExist(d);
            if (check) {
              //if another doc exist add 1 to returnee
              returnee += 1;
              return;
            }
            //if no add 1 to new
            newee += 1;
          })
        );
      }

      sendData(res, 200, {
        data: { returnee, newee, total },
        message: "Data Succesfully fetched",
        code: status["200"]
      });

      closeConnection();

      logger.info(`Get user retention success at ${new Date()}`);
    } catch (error) {
      closeConnection();
      console.log(error);
      logger.info(`Get user retention failed at ${new Date()}`);
      sendError(res, 500, {
        errorMessage: "Internal Error",
        code: status["500"]
      });
    }
  };

  main();
};
