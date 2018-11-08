import * as mongoose from "mongoose";

export default class DatabaseHelpers {
  static connect(DATABASE_URI: string, cb = () => {}): Promise<any> {
    (<any>mongoose).Promise = global.Promise;
    mongoose.connect(
      DATABASE_URI,
      {
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        config: { autoIndex: false },
        useNewUrlParser: true
      }
    );
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
    } else {
      return [];
    }
  }

  static getPaginateDocs(
    model: mongoose.Model<any>,
    query = {},
    fields: string = "",
    page: number = 1,
    pageSize: number = 30
  ): Promise<any[]> {
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
