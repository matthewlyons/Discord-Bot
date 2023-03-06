const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const EventSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  happening: {
    type: Boolean,
    default: true,
  },
  coming: [UserSchema],
  not_coming: [UserSchema],
});

module.exports = Event = mongoose.model("event", EventSchema);
