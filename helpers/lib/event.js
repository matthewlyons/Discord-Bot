module.exports = {
  eventMessageContent(type) {
    if (type == "Game Night") {
      return ".\n------\nWill you be over for Game Night this Saturday at 6PM?\n\nReact  👍  for yes,  👎  for no\n--------";
    } else {
      return ".\n------\nWill you be over for Anime this Saturday at Noon?\n\nReact  👍  for yes,  👎  for no\n--------";
    }
  },
  eventReminderContent(type) {
    if (type == "Game Night") {
      return ".\n------\nReminder:\nGame Night is Tomorrow at 6PM\n--------";
    } else {
      return ".\n------\nReminder:\nAnime is Tomorrow at Noon\n--------";
    }
  },
};
