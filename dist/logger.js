"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
class AppLogger {
    constructor() {
        this.logger = winston.createLogger({
            level: "info",
            format: winston.format.json(),
            transports: [
                //
                // - Write to all logs with level `info` and below to `combined.log`
                // - Write all logs error (and below) to `error.log`.
                //
                new winston.transports.File({ filename: "error.log", level: "error" }),
                new winston.transports.File({ filename: "combined.log" })
            ]
        });
        if (process.env.NODE_ENV !== "production") {
            this.logger.add(new winston.transports.Console({
                format: winston.format.simple()
            }));
        }
    }
}
exports.default = new AppLogger().logger;
//# sourceMappingURL=logger.js.map