const { createHmac, randomBytes } = require("crypto");

const mongoose = require("mongoose");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/User-Avatar.png",
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// NOTE : Always used normal function in pre hook in mongoose.
userSchema.pre("save", function (next) {
  console.log("USER pre running .......");
  const user = this;
  // console.log(`🚀 ~ file: user.js:40 ~ user:`, user);
  // console.log(user.isModified("password"));
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  console.log("Match Password .......");
  // console.log(this);
  const user = await this.findOne({ email });
  // console.log(`🚀 ~ file: user.js:59 ~ user:`, user);

  if (!user) throw new Error("User not found!");

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== userProvidedHash)
    throw new Error("Incorrect Password");

  // LEARN : Exclude few key from object returned by mongoose (e.g find operation, etc)
  // const { salt: salt1, password: password1, ...result } = user.toObject();

  // POINT : Return user data excluded salt and password
  // return result;

  const token = createTokenForUser(user);
  // POINT : Return token
  return token;
});

const User = mongoose.model("User", userSchema, "User");

module.exports = User;
