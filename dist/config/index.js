"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP = {
    APP_NAME: "CHATBOT-QR-SERVICE",
    APP_VERSION: "v1",
    APP_CLIENTS: ["chatbot-levis"],
    DATABASE_URL: process.env.MONGODB_URI
};
exports.APP_CONFIG = {
    mongoConfig: {
        url: exports.APP.DATABASE_URL,
        options: {
            autoReconnect: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000,
            config: { autoIndex: false },
            useNewUrlParser: true
        }
    }
};
//# sourceMappingURL=index.js.map