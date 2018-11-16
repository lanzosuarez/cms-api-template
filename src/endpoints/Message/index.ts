import { Server } from "../../../node_modules/@types/restify";
import { RoutesController } from "../../types/AppTypes";
import { createPath } from "../../helpers/endpoints";

import create_message from "./create";
import paginate_count from "./paginate_count";
import paginate_message from "./paginte_message";
import getUnreadCount from "./get_unread_count";
import read_messages from "./read_messages";

export default class MessageController implements RoutesController {
  subject = "";
  server: Server;
  constructor(server: Server, subject: string) {
    this.subject = subject;
    this.server = server;
  }

  initializeRoutes() {
    //unread
    this.server.get(
      { path: createPath("v1", `${this.subject}/unread`) },
      getUnreadCount
    );

    this.server.patch(
      { path: createPath("v1", `${this.subject}/read`) },
      read_messages
    );
    //paginate
    this.server.get(
      { path: createPath("v1", `${this.subject}/paginate`) },
      paginate_message
    );
    this.server.get(
      { path: createPath("v1", `${this.subject}/paginate_count`) },
      paginate_count
    );
    //create
    this.server.post({ path: createPath("v1", this.subject) }, create_message);
  }
}
