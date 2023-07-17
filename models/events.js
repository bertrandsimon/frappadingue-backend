const mongoose = require("mongoose");

const eventsSchema = mongoose.Schema({
  name: String,
  location: String,
  date: Date,
  zip_code: Number,
  start_hour: Date,
  active: Boolean,
  max_capacity: String,
  description: String,
  banner_img: String,
  price: Number,
  year: Number,
  thumb_image: String,
});

const Event = mongoose.model("events", eventsSchema);

module.exports = Event;
