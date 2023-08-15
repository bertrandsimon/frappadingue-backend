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
  price: String,
  year: String,
  thumb_image: String,
  format_s_price: String,
  format_l_price: String,
  format_s_stripe_paylink: String,
  format_l_stripe_paylink: String,
});

const Event = mongoose.model("events", eventsSchema);

module.exports = Event;
