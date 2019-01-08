"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
    name: {
        first: String,
        last: String
    },
    messenger_id: String,
    image: String,
    timestamp: { type: Date, default: Date.now },
    user_age: String,
    user_location: String,
    user_gender: String
});
exports.default = UserSchema;
//# sourceMappingURL=User.js.map