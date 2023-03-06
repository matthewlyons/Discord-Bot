const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  message_id: {
    type: String,
    required: true,
  },
  channel_id: {
    type: String,
    required: true,
  },
});

module.exports = Message = mongoose.model("message", MessageSchema);
