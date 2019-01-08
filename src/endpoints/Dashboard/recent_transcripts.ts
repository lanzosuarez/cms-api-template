import * as status from "http-status";
import AppResponse from "../../helpers/response";
import logger from "../../logger";
import * as mongoose from "mongoose";

import Session from "../../models/Session";
import User from "../../models/User";

const { sendData, sendError } = AppResponse;

export default (req, res, next) => {
  const conn = mongoose.createConnection(process.env.MONGO_URI_MASTER, {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      config: { autoIndex: false },
      useNewUrlParser: true
    }),
    SessionModel = conn.model("sm-sessions", Session),
    UseModel = conn.model("sm-users", User);

  const getUser = messenger_id => UseModel.findOne({ messenger_id }, "name");

  const getRecentTranscripts = () =>
    SessionModel.find()
      .sort({ last_activity: -1 })
      .limit(5);

  const getTransCriptsUser = transcripts =>
    transcripts.map(async t => {
      const user = await getUser(t.messenger_id);
      return { ...t._doc, user };
    });

  const closeConnection = () => conn.close();

  const main = async () => {
    try {
      let transcripts: any = await getRecentTranscripts();
      let ts = await Promise.all(getTransCriptsUser(transcripts));

      sendData(res, 200, {
        data: ts,
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
