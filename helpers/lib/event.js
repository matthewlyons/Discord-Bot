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
  eventConfirmationContent(type, happening) {
    if (happening) {
      if (type == "Game Night") {
        return ".\n------\nGame Night is Confirmed for this Weekend\n--------";
      } else {
        return ".\n------\nAnime is Confirmed for this Weekend\n--------";
      }
    } else {
      if (type == "Game Night") {
        return ".\n------\nGame Night is Canceled for this Weekend\n--------";
      } else {
        return ".\n------\nAnime is Canceled for this Weekend\n--------";
      }
    }
  },
  adminMessageContent(type, happening, users) {
    if (type == "Game Night") {
      let message = [".", "------", "Game Night Results:"];
      message.push(happening ? "Happening" : "Not Happening");
      message.push("------");
      message.push("Attendance List:");
      users.forEach((x) => {
        message.push(x.username);
      });
      message.push("------");
      return message.join("\n");
    } else {
      let message = [".", "------", "Anime Results:"];
      message.push(happening ? "Happening" : "Not Happening");
      message.push("------");
      message.push("Attendance List:");
      users.forEach((x) => {
        message.push(x.username);
      });
      message.push("------");
      return message.join("\n");
    }
  },
};
