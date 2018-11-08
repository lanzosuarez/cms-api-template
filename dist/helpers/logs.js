"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
class LogsHelper {
    static logRequests(method, client) {
        logger_1.default.info(`${method} request from  ${client} at ${new Date()}`);
    }
    static successLog(method, client) {
        logger_1.default.info(`${method} request from  ${client} succedded at ${new Date()}`);
    }
    static failureLog(method, client) {
        logger_1.default.info(`${method} request from  ${client} failed at ${new Date()}`);
    }
}
exports.default = LogsHelper;
//# sourceMappingURL=logs.js.map