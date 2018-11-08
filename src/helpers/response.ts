import { SuccessResponseBody, ErrorResponseBody } from "./../types/AppTypes";
import { Response } from "../../node_modules/@types/restify";

export default class AppResponse {
  static sendData(
    res: Response,
    status: number,
    response: SuccessResponseBody
  ) {
    const { message = "", data = {}, code = "" } = response;
    return res.send(status, { message, data, code });
  }

  static sendError(
    res: Response,
    status = 500,
    errResponse: ErrorResponseBody
  ) {
    const { errorMessage = "", code = "" } = errResponse;
    return res.send(status, { errorMessage, code });
  }
}
