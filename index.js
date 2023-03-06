require("dotenv").config();

const { client } = require("./client");

require("./cron");
require("./events");

const { connectDB } = require("./helpers");

let { DISCORD_TOKEN } = process.env;

connectDB()
  .then((message) => {
    console.log(message);
  })
  .catch((err) => {
    console.log(err);
  });

// Log in to Discord with your client's token
client.login(DISCORD_TOKEN);
