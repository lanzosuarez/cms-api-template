"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../../config/index");
class DefaultController {
    constructor(server, subject) {
        this.subject = "";
        this.subject = `/${subject}`;
        this.server = server;
    }
    initializeRoutes() {
        this.server.get({ path: "/" }, (req, res, next) => {
            console.log(req.query);
            res.send({ message: `Welcome to ${index_1.APP.APP_NAME}` });
        });
    }
}
exports.default = DefaultController;
//# sourceMappingURL=index.js.map