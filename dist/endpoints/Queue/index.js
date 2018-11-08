"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const endpoints_1 = require("../../helpers/endpoints");
const create_1 = require("./create");
const delete_1 = require("./delete");
const update_1 = require("./update");
const get_all_1 = require("./get_all");
const get_specific_1 = require("./get_specific");
const paginate_queue_1 = require("./paginate_queue");
const assign_queue_1 = require("./assign_queue");
class QrController {
    constructor(server, subject) {
        this.subject = "";
        this.subject = subject;
        this.server = server;
    }
    initializeRoutes() {
        //get one
        this.server.get({ path: endpoints_1.createPath("v1", `${this.subject}`) }, get_specific_1.default);
        //get all
        this.server.get({ path: endpoints_1.createPath("v1", `${this.subject}/all`) }, get_all_1.default);
        //paginate
        this.server.get({ path: endpoints_1.createPath("v1", `${this.subject}/paginate`) }, paginate_queue_1.default);
        //create
        this.server.post({ path: endpoints_1.createPath("v1", this.subject) }, create_1.default);
        //delete
        this.server.del({ path: endpoints_1.createPath("v1", this.subject, ["_id"]) }, delete_1.default);
        //assign
        this.server.patch({ path: endpoints_1.createPath("v1", `${this.subject}/assign`, ["_id"]) }, assign_queue_1.default);
        //update
        this.server.patch({ path: endpoints_1.createPath("v1", this.subject, ["_id"]) }, update_1.default);
    }
}
exports.default = QrController;
//# sourceMappingURL=index.js.map