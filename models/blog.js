// FIXME : Boiler plate code

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({}, { timestamps: true });

const User = mongoose.model("User", userSchema, "User");

module.exports = User;
