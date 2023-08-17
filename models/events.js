const mongoose = require("mongoose");

const eventsSchema = mongoose.Schema({
  name: String,
  location: String,
  date: String,
  zip_code: String,
  start_hour: String,
  active: Boolean,
  max_capacity: String,
  description: String,
  //banner_img: String,
  year: String,
  thumb_image: String,
  price: Number,
  format_s_price: Number,
  format_l_price: Number,
  format_s_stripe_paylink: String,
  format_l_stripe_paylink: String,
});

const Event = mongoose.model("events", eventsSchema);

module.exports = Event;
