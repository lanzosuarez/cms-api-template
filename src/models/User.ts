import * as mongoose from "mongoose";
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

export default UserSchema;
