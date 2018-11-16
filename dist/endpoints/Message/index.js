"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const endpoints_1 = require("../../helpers/endpoints");
const create_1 = require("./create");
const paginate_count_1 = require("./paginate_count");
const paginte_message_1 = require("./paginte_message");
const get_unread_count_1 = require("./get_unread_count");
const read_messages_1 = require("./read_messages");
class MessageController {
    constructor(server, subject) {
        this.subject = "";
        this.subject = subject;
        this.server = server;
    }
    initializeRoutes() {
        //unread
        this.server.get({ path: endpoints_1.createPath("v1", `${this.subject}/unread`) }, get_unread_count_1.default);
        this.server.patch({ path: endpoints_1.createPath("v1", `${this.subject}/read`) }, read_messages_1.default);
        //paginate
        this.server.get({ path: endpoints_1.createPath("v1", `${this.subject}/paginate`) }, paginte_message_1.default);
        this.server.get({ path: endpoints_1.createPath("v1", `${this.subject}/paginate_count`) }, paginate_count_1.default);
        //create
        this.server.post({ path: endpoints_1.createPath("v1", this.subject) }, create_1.default);
    }
}
exports.default = MessageController;
//# sourceMappingURL=index.js.map