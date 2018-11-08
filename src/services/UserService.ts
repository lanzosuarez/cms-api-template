import axios from "axios";

const APP_NAME = "smsupermalls";
const API_URL = process.env.AUTH_SERVICE_URL;

export default class UserService {
  static getBestAgent() {
    return axios.get(`${API_URL}/user/best_agent`, {
      params: { bypass_key: process.env.BYPASS_TOKEN, app: APP_NAME }
    });
  }

  static getAgent(id) {
    return axios.get(`${API_URL}/user`, {
      params: {
        bypass_key: process.env.BYPASS_TOKEN,
        app: APP_NAME,
        by: "id",
        value: id
      }
    });
  }

  static updateAgentQueue(id, update) {
    return axios.patch(`${API_URL}/user/${id}`, update, {
      params: { bypass_key: process.env.BYPASS_TOKEN }
    });
  }
}
