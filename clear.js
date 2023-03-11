require("dotenv").config();
const { Events } = require("discord.js");

const { client } = require("./client");

const { clearMessages } = require("./helpers");

let channel_id = process.argv[2];

let { DISCORD_TOKEN } = process.env;

// Log in to Discord with your client's token
client.login(DISCORD_TOKEN);

// On Initial Load
client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  clearMessages(client, channel_id);
});
