const mongoose = require("mongoose");
const connectionString = process.env.MONGO_URI;

const connection = () => {
  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log("✅✅✅ Database connected ✅✅✅");
    })
    .catch((error) => {
      console.log("❌❌❌ Unable to connect to db ❌❌❌");
    });
};

module.exports = connection;
