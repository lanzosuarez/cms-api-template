import { Server } from "../../../node_modules/@types/restify";
import { RoutesController } from "../../types/AppTypes";
import { createPath } from "../../helpers/endpoints";

import active_users from "./active_users";
import top_messages from "./top_messages";
import top_exit_messages from "./top_exit_messages";
import message_activity from "./message_activity";
import user_activity from "./user_activity";
import recent_transcripts from "./recent_transcripts";
import live_message_rating from "./live_message_rating";

export default class DashboardController implements RoutesController {
  subject = "";
  server: Server;
  constructor(server: Server, subject: string) {
    this.subject = subject;
    this.server = server;
  }

  initializeRoutes() {
    this.server.get(
      { path: createPath("v1", `${this.subject}/active-users`) },
      active_users
    );
    this.server.get(
      { path: createPath("v1", `${this.subject}/top-exit-messages`) },
      top_exit_messages
    );
    this.server.get(
      { path: createPath("v1", `${this.subject}/top-messages`) },
      top_messages
    );
    this.server.get(
      { path: createPath("v1", `${this.subject}/message-activity`) },
      message_activity
    );
    this.server.get(
      { path: createPath("v1", `${this.subject}/user-activity`) },
      user_activity
    );
    this.server.get(
      { path: createPath("v1", `${this.subject}/recent-transcripts`) },
      recent_transcripts
    );
    this.server.get(
      { path: createPath("v1", `${this.subject}/live-message-rating`) },
      live_message_rating
    );
  }
}
