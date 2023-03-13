const { Events } = require("discord.js");
const { client } = require("./client");

const Event = require("./models/Event");

const { getNextSaturday } = require("./helpers");

// On Initial Load
client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Event: User Reacts to Message
client.on(Events.MessageReactionAdd, async (reaction, user) => {
  // Check if bot reaction
  try {
    if (reaction.message.author.id === user.id) {
      return;
    }
  } catch (err) {
    console.log(err);
    return;
  }

  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the message:", error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }

  let eventDate = getNextSaturday();

  const eventObj = await Event.findOne({ date: eventDate });

  let { id, username } = user;
  let userObj = { id, username };

  // Now the message has been cached and is fully available
  if (reaction.emoji.name === "👍") {
    console.log(username, ": Added a Thumbs Up");
    eventObj.coming.push(userObj);
  } else if (reaction.emoji.name === "👎") {
    console.log(username, ": Added a Thumbs Down");
    eventObj.not_coming.push(userObj);
  }
  eventObj.save();
});

// Event: User Removes Reaction from Message
client.on(Events.MessageReactionRemove, async (reaction, user) => {
  // Check if bot reaction
  if (reaction.message.author.id === user.id) {
    return;
  }
  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the message:", error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }

  let eventDate = getNextSaturday();

  const eventObj = await Event.findOne({ date: eventDate });

  let { id, username } = user;

  // Now the message has been cached and is fully available
  if (reaction.emoji.name === "👍") {
    console.log(username, ": Removed a Thumbs Up");
    let updatedArray = eventObj.coming.filter((x) => {
      return x.id !== id;
    });
    eventObj.coming = updatedArray;
  } else if (reaction.emoji.name === "👎") {
    console.log(username, ": Removed a Thumbs Down");
    let updatedArray = eventObj.not_coming.filter((x) => {
      return x.id !== id;
    });
    eventObj.not_coming = updatedArray;
  }
  eventObj.save();
});
