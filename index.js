require("dotenv").config();
const PORT = process.env.PORT || 8000;

const express = require("express");
const path = require("path");
var cookieParser = require("cookie-parser");
const connection = require("./connection/connection");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middleware/authentication");

const blogModel = require("./models/blog");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

connection();

// POINT : middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
// LEARN : how to serve static files or folders
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await blogModel.find({});

  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

// POINT : Routes
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

// POINT : Listing
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
