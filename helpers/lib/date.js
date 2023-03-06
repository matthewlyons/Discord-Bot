const moment = require("moment");

module.exports = {
  getNextSaturday() {
    let eventDay = moment(moment().day("saturday")).format("YYYY-MM-DD");
    return eventDay;
  },
  eventSelection() {
    let nextSaturday = module.exports.getNextSaturday();
    let currentDay = moment(nextSaturday);

    let animeDay = moment("2023-03-04");

    let diff = Math.floor(moment.duration(currentDay.diff(animeDay)).asWeeks());
    return diff % 2 > 0 ? "Game Night" : "Anime";
  },
};
