import { Server } from "../../node_modules/@types/restify";

import DefaultController from "./Default";
import QueueController from "./Queue";
import MessageController from "./Message";

class RootRoutes {
  server: Server;
  constructor(server: Server) {
    this.server = server;
    this.initPublicRoutes();
  }

  initPublicRoutes() {
    //validate req client query
    new DefaultController(this.server, "default").initializeRoutes();
    new QueueController(this.server, "queue").initializeRoutes();
    new MessageController(this.server, "message").initializeRoutes();
  }
}

export default RootRoutes;
