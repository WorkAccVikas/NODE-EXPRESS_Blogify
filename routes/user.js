const { Router } = require("express");
const userModel = require("../models/user");

const router = Router();

router.route("/signin").get((req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  try {
    console.log("signin route");
    const { email, password } = req.body;

    const token = await userModel.matchPasswordAndGenerateToken(
      email,
      password
    );

    console.log("Token = ", token);
    // DESC : Set cookie
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Email or Password is incorrect",
    });
  }
});

router.post("/signup", async (req, res) => {
  console.log("signup route");
  const { fullName, email, password } = req.body;

  await userModel.create({
    fullName,
    email,
    password,
  });

  return res.redirect("/");
});

/** DESC : logout functionality :
 *  First clear cookie and then redirect to home page
 */
router.get("/logout", (req, res) => {
  return res.clearCookie("token").redirect("/");
});

module.exports = router;
