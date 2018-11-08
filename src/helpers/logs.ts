import logger from "../logger";

export default class LogsHelper {
  static logRequests(method: string, client: string) {
    logger.info(`${method} request from  ${client} at ${new Date()}`);
  }

  static successLog(method: string, client: string) {
    logger.info(`${method} request from  ${client} succedded at ${new Date()}`);
  }

  static failureLog(method: string, client: string) {
    logger.info(`${method} request from  ${client} failed at ${new Date()}`);
  }
}
