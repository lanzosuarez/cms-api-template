import { AppCollectionNames } from "../types";
import { Model, connection, Schema, model } from "mongoose";

import AppModels from "./exporter";

export default class Models {
  static models = {};

  static getModel(collectionName: AppCollectionNames, client): Model<any> {
    const modelName = `${client}-${collectionName}`;
    return connection.models[modelName];
  }

  static loadModels() {
    AppModels.forEach((modelLoader: () => void) => {
      modelLoader();
    });
  }

  static initializeModels(client: string) {
    this.loadModels();
    Object.keys(this.models).forEach((model: any) => {
      this.models[model](client);
    });
  }

  static createModel(
    collectionName: AppCollectionNames,
    fields
  ): ((client: string) => Model<any>) {
    return (client: string): Model<any> => {
      let definedSchema: Schema = new Schema(fields);
      console.log(`Created ${client}-${collectionName} model`);
      return model<any>(`${client}-${collectionName}`, definedSchema);
    };
  }

  static addModel(
    modelKey: AppCollectionNames,
    model: ((client: string) => Model<any>)
  ) {
    this.models[modelKey] = model;
  }
}
