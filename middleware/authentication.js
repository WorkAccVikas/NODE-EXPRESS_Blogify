const { validateToken } = require("../services/authentication");

// DESC : Here, use of closure
function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    // DESC : Get cookie data
    const tokenCookieValue = req.cookies[cookieName];

    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {}

    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
