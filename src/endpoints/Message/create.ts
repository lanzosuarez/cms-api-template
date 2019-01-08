import * as status from "http-status";
import AppResponse from "../../helpers/response";
import logger from "../../logger";
import Models from "../../models";
import { AppCollectionNames, Message, Queue } from "../../types";
import { APP } from "../../config";
import App from "../../App";
import MessengerService from "../../services/MessengerService";

import * as mongoose from "mongoose";

import Raw from "../../models/Raw";

const { Message, Queue } = AppCollectionNames;
const { sendData, sendError } = AppResponse;
const { getModel } = Models;

export default (req, res, next) => {
  const conn = mongoose.createConnection(process.env.MONGO_URI_MASTER, {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      config: { autoIndex: false },
      useNewUrlParser: true
    }),
    rawDataModel = conn.model("raw-collector", Raw);

  const MessageModel = getModel(Message, APP.APP_CLIENTS[0]);
  const QueueModel = getModel(Queue, APP.APP_CLIENTS[0]);
  const [_, client] = APP.APP_CLIENTS[0].split("-");

  const updateQueueLastActivity = async msg => {
    const { queue } = req.body;
    return QueueModel.findByIdAndUpdate(queue, {
      $set: { last_activity: msg }
    });
  };

  const getMessageType = () => {
    const { message } = req.body;

    const { text, attachments } = message;
    if (text && attachments && attachments.length > 0) {
      return "template";
    } else if (text) {
      return "text";
    } else if (attachments && attachments.length > 0) {
      return "image";
    }
  };

  const sendMessage = fb_id => {
    const { message } = req.body;

    const { text, attachments } = message;
    if (text && attachments && attachments.length > 0) {
      MessengerService.sendMessageText(text, fb_id);
      attachments.forEach(attachment =>
        MessengerService.sendMessageWithAttachment(attachment, fb_id)
      );
    } else if (text) {
      MessengerService.sendMessageText(text, fb_id);
    } else if (attachments && attachments.length > 0) {
      attachments.forEach(attachment =>
        MessengerService.sendMessageWithAttachment(attachment, fb_id)
      );
    }

    createRaw(fb_id, true, req.body.message, getMessageType());
    console.log("create raw");
  };

  const createRaw = (fb_id, is_echo, message, type) => {
    const attributes = {
      fb_id,
      is_echo,
      type,
      client,
      message
    };

    const raw = new rawDataModel({
      attributes,
      event_name: "chat",
      event_source: "msbf",
      numerical_value: 1
    });

    raw.save();
  };

  const main = async () => {
    try {
      logger.info(`Create message at ${new Date()}`);
      let message = new MessageModel(req.body);
      message = await message.save();
      const queue = await updateQueueLastActivity(message._id);

      const agent = req.body.agent._id;

      //socket here
      switch (message.type) {
        case 0: {
          console.log("client message");
          //from client emit to agent and admin
          App.appSocket.emitClientMessage({
            message,
            agent,
            queue
          });
          const { fb_id } = await QueueModel.findById(req.body.queue);
          createRaw(fb_id, false, req.body.message, getMessageType());
          break;
        }
        case 1: {
          //from agent emit to admin
          App.appSocket.emitAgentMessageToAdmin({ message, queue });
          const { fb_id } = await QueueModel.findById(req.body.queue);
          sendMessage(fb_id);
          break;
        }
        case 2: {
          //from admin emit to agent
          App.appSocket.emitAdminMessageToAgent({
            message,
            agent,
            queue
          });
          const { fb_id } = await QueueModel.findById(req.body.queue);
          sendMessage(fb_id);
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
