import { Server } from "../../node_modules/@types/restify";

import DefaultController from "./Default";
import QueueController from "./Queue";

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
  }
}

export default RootRoutes;
