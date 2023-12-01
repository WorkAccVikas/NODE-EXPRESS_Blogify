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
  console.log("signin route");
  const { email, password } = req.body;

  const user = await userModel.matchPassword(email, password);

  console.log("User = ", user);
  return res.redirect("/");
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

module.exports = router;
