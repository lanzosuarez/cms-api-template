import * as restify from "restify";
import RootRoutes from "./endpoints";
import logger from "./logger";
import * as log4js from "log4js";
import { APP, APP_CONFIG } from "./config";
import * as corsMiddleware from "restify-cors-middleware";
import DatabaseHelpers from "./helpers/database";
import Models from "./models";
import SocketService from "./services/SocketService";

const { APP_NAME, APP_CLIENTS } = APP;

class App {
  public server: restify.Server;
  private appName: string;
  private appClients: string[];
  private static LOGGER: log4js.Logger;
  public appSocket;

  constructor(appName: string, appClients: string[]) {
    App.LOGGER = log4js.getLogger("App");
    App.LOGGER.level = "debug";
    App.LOGGER.info("Starting server");
    this.server = restify.createServer();
    this.appName = appName;
    this.appClients = appClients;

    //set up restify plugins
    this.initMiddleware();

    this.main();
  }

  private initMiddleware(): void {
    // SET UP RESTIFY PLUGINS
    const server = this.server;
    const cors = corsMiddleware({
      origins: ["*"],
      allowHeaders: ["Content-Type", "authorization-token"],
      allowMethods: ["PATCH", "GET", "POST", "DELETE", "OPTIONS"]
    });
    server.pre(cors.preflight);
    server.use(cors.actual);

    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());
    server.use(restify.plugins.gzipResponse());
  }

  private initSocket(): void {
    this.appSocket = new SocketService(this.server);
  }

  private async main() {
    try {
      logger.info(`${this.appName} STARTED AT: ${new Date()}`);
      console.log("Connect to database");
      await DatabaseHelpers.connect(APP_CONFIG.mongoConfig.url);
      console.log("load models");
      await this.initModels();
      console.log("Listen to port");
      await this.listenToPort();
      this.initSocket();

      console.log("Mount Routes");
      this.mountRoutes();
      logger.info(`${this.appName} SUCCESSFULLY STARTED AT: ${new Date()}`);
    } catch (err) {
      logger.info(`${this.appName} FAILED TO START: ${new Date()}`);
      throw new Error(err);
    }
  }

  private listenToPort(): Promise<any> {
    return new Promise((resolve, reject) => {
      const port = process.env.PORT || 3000;
      this.server.listen(port, err => {
        if (err) {
          reject(err);
        }
        console.log(`server is listening onn ${port}`);
        resolve(1);
      });
    });
  }

  private initModels(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.appClients.forEach((client: string) =>
          Models.initializeModels(client)
        );
        resolve(1);
      } catch (error) {
        reject(error);
      }
    });
  }

  private mountRoutes(): void {
    //mount api routes
    new RootRoutes(this.server);
  }
}

export default new App(APP_NAME, APP_CLIENTS);
