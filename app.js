require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("./models/connection");


var indexRouter = require("./routes/index");
const eventsRouter = require("./routes/events");
const usersRouter = require("./routes/users");
const adminsRouter = require("./routes/admins");

const fileUpload = require('express-fileupload');

var app = express();

const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

app.use("/", indexRouter);
app.use("/events", eventsRouter);
app.use("/users", usersRouter);
app.use("/admins", adminsRouter);
// app.use("/users", usersRouter);
// app.use("/jobs", jobsRouter);
// app.use("/stats", statsRouter);
// app.use("/admin", adminRouter);

module.exports = app;
