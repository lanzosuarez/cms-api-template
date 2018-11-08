"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
class DatabaseHelpers {
    static connect(DATABASE_URI, cb = () => { }) {
        mongoose.Promise = global.Promise;
        mongoose.connect(DATABASE_URI, {
            autoReconnect: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000,
            config: { autoIndex: false },
            useNewUrlParser: true
        });
        return new Promise((resolve, reject) => {
            mongoose.connection
                .on("error", error => reject(error))
                .once("open", () => {
                cb();
                resolve(`Successfully connected to ${DATABASE_URI}`);
            });
        });
    }
    static populateQuery(populate = "") {
        if (populate.length > 0) {
            const qParams = populate.split(" ");
            return qParams.map(params => {
                const [path, select] = params.split(";");
                return {
                    path,
                    select: select.replace(new RegExp(",", "g"), " ")
                };
            });
        }
        else {
            return [];
        }
    }
    static getPaginateDocs(model, query = {}, fields = "", page = 1, pageSize = 30) {
        return model
            .find(query, fields)
            .sort({ timestamp: -1 })
            .skip((Number(page) - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .catch(err => {
            throw err;
        });
    }
}
exports.default = DatabaseHelpers;
//# sourceMappingURL=database.js.map