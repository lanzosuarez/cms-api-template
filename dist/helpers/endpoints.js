"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPath = (activeVersion, uri = "", params = []) => {
    let stringParams = "";
    params.forEach(p => (stringParams += `/:${p}`));
    return `/api/${activeVersion}/${uri}${stringParams}`;
};
//# sourceMappingURL=endpoints.js.map