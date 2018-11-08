"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const exporter_1 = require("./exporter");
class Models {
    static getModel(collectionName, client) {
        const modelName = `${client}-${collectionName}`;
        return mongoose_1.connection.models[modelName];
    }
    static loadModels() {
        exporter_1.default.forEach((modelLoader) => {
            modelLoader();
        });
    }
    static initializeModels(client) {
        this.loadModels();
        Object.keys(this.models).forEach((model) => {
            this.models[model](client);
        });
    }
    static createModel(collectionName, fields) {
        return (client) => {
            let definedSchema = new mongoose_1.Schema(fields);
            console.log(`Created ${client}-${collectionName} model`);
            return mongoose_1.model(`${client}-${collectionName}`, definedSchema);
        };
    }
    static addModel(modelKey, model) {
        this.models[modelKey] = model;
    }
}
Models.models = {};
exports.default = Models;
//# sourceMappingURL=index.js.map