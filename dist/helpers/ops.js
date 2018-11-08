"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OpsHelpers {
    static generateRange(range, arr = true, startingVal = 0, startFromZero = true) {
        if (arr) {
            return [...new Array(range)].map((_, index) => index);
        }
        else {
            return [...new Array(range)].map((_, index) => ({
                [startFromZero ? index : index + 1]: startingVal
            }));
        }
    }
}
exports.default = OpsHelpers;
//# sourceMappingURL=ops.js.map