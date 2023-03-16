const cron = require("node-cron");

const { client } = require("./client");

const Message = require("./models/Message");
const Event = require("./models/Event");

const {
  sendMessage,
  getNextSaturday,
  getUsersByRole,
  deleteMessage,
  eventSelection,
  eventMessageContent,
  homeOwnerComing,
  eventReminderContent,
  adminMessageContent,
  eventConfirmationContent,
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
    let users = await getUsersByRole(client, type);

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
  async function () {
    // Get Next Saturday
    let date = getNextSaturday();
    let type = eventSelection();

    // Get Users for Event
    let users = await getUsersByRole(client, type);

    // Get Event By Date
    const eventObj = await Event.findOne({ date });

    // Get Users by Event
    let { happening, coming } = eventObj;

    let numUsers = users.length;
    let numUsersComing = coming.length;

    // Check if Ammount of Users coming is over threshold
    if (type == "Anime") {
      happening = numUsers == numUsersComing;
    } else {
      happening = numUsersComing > 4 && homeOwnerComing();
    }

    // Send Admins a Summary of Who is Attending
    // Get Admin Users
    let adminUsers = await getUsersByRole(client, "Admin");

    // Get Content for Message
    let adminContent = adminMessageContent(type, happening, coming);

    // Send Admin Users Messages
    adminUsers.forEach((x) => {
      sendMessage(client, x.id, adminContent);
    });

    // Send Users Cancelled or Approved Notice
    let userContent = eventConfirmationContent(type, happening);
    eventObj.coming.forEach((x) => {
      sendMessage(client, x.id, userContent);
    });
    if (!happening) {
      eventObj.happening = false;
      eventObj.save();
      return;
    }
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
  async function () {
    // Get Next Saturday
    let date = getNextSaturday();

    // Get Event By Date
    const eventObj = await Event.findOne({ date });

    // Check if Event is happening
    if (eventObj.happening) {
      // Get Event Type
      let type = eventSelection();

      // Get Content for Message
      let messageContent = eventReminderContent(type);

      // Message confirmed users to remind them
      eventObj.coming.forEach((x) => {
        sendMessage(client, x.id, messageContent);
      });
    }
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
