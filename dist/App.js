"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const endpoints_1 = require("./endpoints");
const logger_1 = require("./logger");
const log4js = require("log4js");
const config_1 = require("./config");
const corsMiddleware = require("restify-cors-middleware");
const database_1 = require("./helpers/database");
const models_1 = require("./models");
const SocketService_1 = require("./services/SocketService");
const { APP_NAME, APP_CLIENTS } = config_1.APP;
class App {
    constructor(appName, appClients) {
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
    initMiddleware() {
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
    initSocket() {
        this.appSocket = new SocketService_1.default(this.server);
    }
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`${this.appName} STARTED AT: ${new Date()}`);
                console.log("Connect to database");
                yield database_1.default.connect(config_1.APP_CONFIG.mongoConfig.url);
                console.log("load models");
                yield this.initModels();
                console.log("Listen to port");
                yield this.listenToPort();
                this.initSocket();
                console.log("Mount Routes");
                this.mountRoutes();
                logger_1.default.info(`${this.appName} SUCCESSFULLY STARTED AT: ${new Date()}`);
            }
            catch (err) {
                logger_1.default.info(`${this.appName} FAILED TO START: ${new Date()}`);
                throw new Error(err);
            }
        });
    }
    listenToPort() {
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
    initModels() {
        return new Promise((resolve, reject) => {
            try {
                this.appClients.forEach((client) => models_1.default.initializeModels(client));
                resolve(1);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    mountRoutes() {
        //mount api routes
        new endpoints_1.default(this.server);
    }
}
exports.default = new App(APP_NAME, APP_CLIENTS);
//# sourceMappingURL=App.js.map