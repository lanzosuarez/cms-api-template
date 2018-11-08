"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const APP_NAME = "smsupermalls";
const API_URL = process.env.AUTH_SERVICE_URL;
class UserService {
    static getBestAgent() {
        return axios_1.default.get(`${API_URL}/user/best_agent`, {
            params: { bypass_key: process.env.BYPASS_TOKEN, app: APP_NAME }
        });
    }
    static getAgent(id) {
        return axios_1.default.get(`${API_URL}/user`, {
            params: {
                bypass_key: process.env.BYPASS_TOKEN,
                app: APP_NAME,
                by: "id",
                value: id
            }
        });
    }
    static updateAgentQueue(id, update) {
        return axios_1.default.patch(`${API_URL}/user/${id}`, update, {
            params: { bypass_key: process.env.BYPASS_TOKEN }
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=UserService.js.map