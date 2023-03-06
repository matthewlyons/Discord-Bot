const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnimeSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
});

module.exports = Anime = mongoose.model("anime", AnimeSchema);
