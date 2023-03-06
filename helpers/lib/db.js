const mongoose = require("mongoose");

let { MONGO_URI } = process.env;

module.exports = {
  async connectDB() {
    return new Promise((resolve, reject) => {
      mongoose
        .connect(MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(async () => {
          resolve("MongoDB Connected");
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
};
