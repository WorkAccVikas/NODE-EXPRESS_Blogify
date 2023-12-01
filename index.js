require("dotenv").config();
const PORT = process.env.PORT || 8000;

const express = require("express");
const path = require("path");
const connection = require("./connection/connection");
const userRoutes = require("./routes/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

connection();

// POINT : middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.render("home"));

// POINT : Routes
app.use("/user", userRoutes);

// POINT : Listing
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
