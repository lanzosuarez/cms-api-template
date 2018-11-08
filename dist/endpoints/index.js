"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Default_1 = require("./Default");
const Queue_1 = require("./Queue");
class RootRoutes {
    constructor(server) {
        this.server = server;
        this.initPublicRoutes();
    }
    initPublicRoutes() {
        //validate req client query
        new Default_1.default(this.server, "default").initializeRoutes();
        new Queue_1.default(this.server, "queue").initializeRoutes();
    }
}
exports.default = RootRoutes;
//# sourceMappingURL=index.js.map