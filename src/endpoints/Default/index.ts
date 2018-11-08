import { APP } from "./../../config/index";
import { Server } from "../../../node_modules/@types/restify";
import { RoutesController } from "../../types/AppTypes";

export default class DefaultController implements RoutesController {
  subject = "";
  server: Server;
  constructor(server: Server, subject: string) {
    this.subject = `/${subject}`;
    this.server = server;
  }

  initializeRoutes() {
    this.server.get({ path: "/" }, (req, res, next) => {
      console.log(req.query);
      res.send({ message: `Welcome to ${APP.APP_NAME}` });
    });
  }
}
