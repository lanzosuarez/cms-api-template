import { Server } from "../../../node_modules/@types/restify";
import { RoutesController } from "../../types/AppTypes";
import { createPath } from "../../helpers/endpoints";

import create_queue from "./create";
import del_queue from "./delete";
import update_queue from "./update";
import get_all from "./get_all";
import get_specific from "./get_specific";
import paginate_queue from "./paginate_queue";
import queues_count from "./queues_count";
import assign_queue from "./assign_queue";

export default class QrController implements RoutesController {
  subject = "";
  server: Server;
  constructor(server: Server, subject: string) {
    this.subject = subject;
    this.server = server;
  }

  initializeRoutes() {
    //get one
    this.server.get(
      { path: createPath("v1", `${this.subject}`) },
      get_specific
    );
    //get all
    this.server.get({ path: createPath("v1", `${this.subject}/all`) }, get_all);
    //paginate
    this.server.get(
      { path: createPath("v1", `${this.subject}/paginate`) },
      paginate_queue
    );
    this.server.get(
      { path: createPath("v1", `${this.subject}/paginate_count`) },
      queues_count
    );
    //create
    this.server.post({ path: createPath("v1", this.subject) }, create_queue);
    //delete
    this.server.del(
      { path: createPath("v1", this.subject, ["_id"]) },
      del_queue
    );
    //assign
    this.server.patch(
      { path: createPath("v1", `${this.subject}/assign`, ["_id"]) },
      assign_queue
    );
    //update
    this.server.patch(
      { path: createPath("v1", this.subject, ["_id"]) },
      update_queue
    );
  }
}
