let { PINEBROOK_ID } = process.env;

const Message = require("../../models/Message");

module.exports = {
  async sendMessage(client, user, text, reactions) {
    try {
      const guild = client.guilds.cache.get(PINEBROOK_ID);
      let res = await guild.members.fetch();
      client.users.cache
        .get(user)
        .send(text)
        .then(function (message) {
          if (reactions) {
            reactions.forEach((x) => {
              message.react(x);
            });
          }
          let newMessage = new Message({
            channel_id: message.channelId,
            message_id: message.id,
          });
          newMessage.save();
        });
    } catch (error) {
      console.log(error);
    }
  },
  async deleteMessage(client, channel_id, message_id, mongo) {
    try {
      client.channels.fetch(channel_id).then((channel) => {
        channel.messages.delete(message_id);
      });
      let foundMessage = await Message.findByIdAndRemove(mongo);
      console.log(foundMessage);
    } catch (error) {
      console.log(error);
    }
  },
  async clearMessages(client, channel_id) {
    console.log("Deleting Messages");
    console.log(channel_id);
    try {
      client.channels.fetch(channel_id).then(async (channel) => {
        let messages = await channel.messages.fetch();
        console.log(channel);
        messages.forEach((x) => {
          x.delete();
        });
      });
    } catch (error) {
      console.log(error);
    }
  },
  async getUsers(client) {
    const guild = client.guilds.cache.get(PINEBROOK_ID);
    let res = await guild.members.fetch();
    return res;
  },
  async getUsersWithEvent(client, event) {
    const guild = client.guilds.cache.get(PINEBROOK_ID);
    let res = await guild.members.fetch();
    let users = [];
    res.forEach((member) => {
      if (member.roles.cache.some((role) => role.name === event)) {
        let { username, id } = member.user;
        users.push({ username, id });
      }
    });
    return users;
  },
  async homeOwnerComing(users) {
    return true;
  },
};
