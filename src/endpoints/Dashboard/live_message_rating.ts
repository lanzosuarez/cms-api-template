import * as status from "http-status";
import AppResponse from "../../helpers/response";
import logger from "../../logger";
import * as mongoose from "mongoose";
import * as moment from "moment";

import Raw from "../../models/Raw";

const { sendData, sendError } = AppResponse;

export default (req, res, next) => {
  const conn = mongoose.createConnection(process.env.MONGO_URI_MASTER, {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      config: { autoIndex: false },
      useNewUrlParser: true
    }),
    rawDataModel = conn.model("raw-collector", Raw);

  const { min = "", max = "", client = "" } = req.query;

  const d = "$timestamp";
  const tZone = "+08:00";

  const getHourMins = (hour, type) => {
    let hoursMin = [];

    for (let x = 0; x <= 59; x++) {
      hoursMin.push({
        minute: x,
        name: moment()
          .set("h", hour)
          .set("minute", x)
          .valueOf(),
        [`${type}-count`]: 0
      });
    }

    return hoursMin;
  };

  const getMessagesRating = (dt, type) => {
    const date = moment(dt);

    console.log({
      date: date.get("date"),
      year: date.get("y"),
      hour: date.get("h"),
      month: date.get("month") + 1
    });

    return rawDataModel.aggregate([
      {
        $match: {
          event_name: "chat",
          "attributes.client": client,
          "attributes.is_echo": type
        }
      },
      {
        $project: {
          minute: { $minute: { date: d, timezone: tZone } },
          hour: { $hour: { date: d, timezone: tZone } },
          year: { $year: { date: d, timezone: tZone } },
          date: { $dayOfMonth: { date: d, timezone: tZone } },
          month: { $month: { date: d, timezone: tZone } },
          type: "$attributes.type"
        }
      },
      {
        $match: {
          date: date.get("date"),
          year: date.get("y"),
          hour: date.get("h"),
          month: date.get("month") + 1
        }
      },
      {
        $group: {
          _id: "$minute",
          count: { $sum: 1 }
        }
      }
    ]);
  };

  const assignMinutesData = (h, data, type) => {
    const messageType = type ? "outgoing" : "incoming";
    let hourMinutes = getHourMins(h, messageType);
    data.forEach(d => {
      const dateIndex = hourMinutes.findIndex(wd => d._id === wd.minute);
      if (dateIndex > -1) {
        hourMinutes[dateIndex][`${messageType}-count`] = d.count;
      }
    });
    return hourMinutes;
  };

  const closeConnection = () => conn.close();

  const main = async () => {
    try {
      const i = false,
        o = true;
      const minHour = moment(min).get("h");
      const maxHour = moment(max).get("h");
      const incomingMinMessages = await getMessagesRating(min, i),
        incomingMinM = assignMinutesData(minHour, incomingMinMessages, i);
      const incomingMaxMessages = await getMessagesRating(max, i),
        incomingMaxM = assignMinutesData(maxHour, incomingMaxMessages, i);

      const outgoingMinMessages = await getMessagesRating(min, o),
        outgoingMinM = assignMinutesData(minHour, outgoingMinMessages, o);
      const outgoingMaxMessages = await getMessagesRating(max, o),
        outgoingMaxM = assignMinutesData(maxHour, outgoingMaxMessages, o);

      sendData(res, 200, {
        data: [
          ...incomingMinM,
          ...incomingMaxM,
          ...outgoingMinM,
          ...outgoingMaxM
        ],

        message: "Data Succesfully fetched",
        code: status["200"]
      });

      closeConnection();

      logger.info(`Get active users success at ${new Date()}`);
    } catch (error) {
      closeConnection();
      console.log(error);
      logger.info(`Get Get active users  failed at ${new Date()}`);
      sendError(res, 500, {
        errorMessage: "Internal Error",
        code: status["500"]
      });
    }
  };

  main();
};
