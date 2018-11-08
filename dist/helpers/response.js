"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppResponse {
    static sendData(res, status, response) {
        const { message = "", data = {}, code = "" } = response;
        return res.send(status, { message, data, code });
    }
    static sendError(res, status = 500, errResponse) {
        const { errorMessage = "", code = "" } = errResponse;
        return res.send(status, { errorMessage, code });
    }
}
exports.default = AppResponse;
//# sourceMappingURL=response.js.map