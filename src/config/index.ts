import { AppSettings } from "../types";
export const APP: AppSettings = {
  APP_NAME: "smsupermalls",
  APP_VERSION: "v1",
  APP_CLIENTS: ["chatbot-smsupermalls"],
  DATABASE_URL: process.env.MONGODB_URI
};

export const APP_CONFIG = {
  mongoConfig: {
    url: APP.DATABASE_URL,
    options: {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      config: { autoIndex: false },
      useNewUrlParser: true
    }
  }
};
