import * as status from "http-status";
import AppResponse from "../../helpers/response";
import logger from "../../logger";
import Models from "../../models";
import { AppCollectionNames, Message, Queue } from "../../types";
import { APP } from "../../config";
import App from "../../App";

const { Message, Queue } = AppCollectionNames;
const { sendData, sendError } = AppResponse;
const { getModel } = Models;

export default (req, res, next) => {
  const MessageModel = getModel(Message, APP.APP_CLIENTS[0]);
  const QueueModel = getModel(Queue, APP.APP_CLIENTS[0]);

  const updateQueueLastActivity = async msg => {
    const { queue } = req.body;
    await QueueModel.findByIdAndUpdate(queue, { $set: { last_activity: msg } });
  };

  const main = async () => {
    try {
      logger.info(`Create message at ${new Date()}`);
      let message = new MessageModel(req.body);
      message = await message.save();
      await updateQueueLastActivity(message._id);

      const agent = req.body.agent._id;

      //socket here
      switch (message.type) {
        case 0: {
          console.log("client message");
          //from client emit to agent and admin
          App.appSocket.emitClientMessage({
            message,
            agent
          });
          break;
        }
        case 1: {
          //from agent emit to admin
          App.appSocket.emitAgentMessageToAdmin({ message });
          break;
        }
        case 2: {
          //from admin emit to agent
          App.appSocket.emitAdminMessageToAgent({
            message,
            agent
          });
          break;
        }
      }

      sendData(res, 201, {
        data: message,
        message: "Data Succesfully created",
        code: status["201"]
      });

      logger.info(`Create message success at ${new Date()}`);
    } catch (error) {
      console.error(error);
      logger.info(`Create message failed at ${new Date()}`);
      sendError(res, 500, {
        errorMessage: "Internal Error",
        code: status["500"]
      });
    }
  };

  main();
};
