"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const endpoints_1 = require("../../helpers/endpoints");
const active_users_1 = require("./active_users");
const top_messages_1 = require("./top_messages");
const top_exit_messages_1 = require("./top_exit_messages");
const message_activity_1 = require("./message_activity");
const user_activity_1 = require("./user_activity");
const recent_transcripts_1 = require("./recent_transcripts");
const live_message_rating_1 = require("./live_message_rating");
class DashboardController {
    constructor(server, subject) {
        this.subject = "";
        this.subject = subject;
        this.server = server;
    }
    initializeRoutes() {
        this.server.get({ path: endpoints_1.createPath("v1", `${this.subject}/active-users`) }, active_users_1.default);
        this.server.get({ path: endpoints_1.createPath("v1", `${this.subject}/top-exit-messages`) }, top_exit_messages_1.default);
        this.server.get({ path: endpoints_1.createPath("v1", `${this.subject}/top-messages`) }, top_messages_1.default);
        this.server.get({ path: endpoints_1.createPath("v1", `${this.subject}/message-activity`) }, message_activity_1.default);
        this.server.get({ path: endpoints_1.createPath("v1", `${this.subject}/user-activity`) }, user_activity_1.default);
        this.server.get({ path: endpoints_1.createPath("v1", `${this.subject}/recent-transcripts`) }, recent_transcripts_1.default);
        this.server.get({ path: endpoints_1.createPath("v1", `${this.subject}/live-message-rating`) }, live_message_rating_1.default);
    }
}
exports.default = DashboardController;
//# sourceMappingURL=index.js.map