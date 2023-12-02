const JWT = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY;

function createTokenForUser(userObj) {
  const payload = {
    _id: userObj._id,
    fullName: userObj.fullName,
    email: userObj.email,
    profileImageURL: userObj.profileImageURL,
    role: userObj.role,
  };

  const token = JWT.sign(payload, SECRET_KEY);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, SECRET_KEY);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
