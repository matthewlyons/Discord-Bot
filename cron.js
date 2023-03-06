const cron = require("node-cron");

const { client } = require("./client");

const Message = require("./models/Message");
const Event = require("./models/Event");

const {
  sendMessage,
  getNextSaturday,
  getUsersWithEvent,
  deleteMessage,
  eventSelection,
  eventMessageContent,
} = require("./helpers");

/*
Date: Monday
Use: Initial Request
*/
cron.schedule(
  "0 12 * * 1",
  async function () {
    let type = eventSelection();
    let date = getNextSaturday();

    // Check if Event Already Exists
    const eventObj = await Event.find({ date });
    if (eventObj.length > 0) {
      console.log("Event Exists.");
      console.log("Exiting");
      return;
    }

    // Create Event
    let newEvent = new Event({ date, type });
    newEvent.save();

    // Get Users for Event
    let users = await getUsersWithEvent(client, type);

    // Get Content for Message
    let messageContent = eventMessageContent(type);

    // Send Users Messages
    users.forEach((x) => {
      sendMessage(client, x.id, messageContent, ["👍", "👎"]);
    });
  },
  {
    scheduled: true,
    timezone: "America/Los_Angeles",
  }
);

/*
Date: Tuesday
Use: Confirmation of Event Status
*/
cron.schedule(
  "0 12 * * 2",
  function () {
    // Send Matt a Summary of Who is Attending
    // Send Users Cancelled or Approved Notice
    console.log("Tuesday");
  },
  {
    scheduled: true,
    timezone: "America/Los_Angeles",
  }
);

/*
Date: Friday
Use: Remind Confirmed Users for the Event
*/
cron.schedule(
  "0 12 * * 5",
  function () {
    // Check if Event is happening
    // Message users to remind them
    console.log("Friday");
  },
  {
    scheduled: true,
    timezone: "America/Los_Angeles",
  }
);

/*
Date: Sunday
Use: Remove All Old Messages
*/
cron.schedule(
  "0 12 * * 7",
  async function () {
    // Get all Messages from MongoDB
    let messages = await Message.find();

    // Delete All Messages in Discord
    messages.forEach((x) => {
      let { channel_id, message_id, _id } = x;
      deleteMessage(client, channel_id, message_id, _id);
    });
  },
  {
    scheduled: true,
    timezone: "America/Los_Angeles",
  }
);
