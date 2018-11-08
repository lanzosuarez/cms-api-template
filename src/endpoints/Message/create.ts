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

  const main = async () => {
    try {
      logger.info(`Create queue at ${new Date()}`);

      let message = new MessageModel(req.body);
      message = await message.save();
      const queue: Queue = await QueueModel.findById(message.queue);
      
      //socket here
      switch (message.type) {
        case 0: {
          //from client emit to agent and admin
          App.appSocket.emitClientMessage({ message, agent: queue.agent });
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
            agent: queue.agent
          });
          break;
        }
      }

      sendData(res, 201, {
        data: null,
        message: "Data Succesfully created",
        code: status["201"]
      });

      logger.info(`Create qr success at ${new Date()}`);
    } catch (error) {
      console.error(error);
      logger.info(`Create qr failed at ${new Date()}`);
      sendError(res, 500, {
        errorMessage: "Internal Error",
        code: status["500"]
      });
    }
  };

  main();
};
