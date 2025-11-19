var express = require("express");
var router = express.Router();
//const { checkBody } = require("../modules/checkbody");
const Event = require("../models/events");
const { cacheMiddleware, clearCache } = require("../modules/cache");


// GET all events
// http://localhost:3000/events/allEvents

router.get("/allEvents", cacheMiddleware(300), (req, res) => {
  Event.find()
  .sort({ date: 1 })
  .lean() // Use lean() for better performance - returns plain JS objects
  .then((data) => {
    res.json({ result: true, all: data });
  })
  .catch((error) => {
    res.status(500).json({ result: false, error: error.message });
  });
});

// GET event by id
//http://localhost:3000/events/64db8801af6df4463b654a88
router.get("/:id", cacheMiddleware(300), (req, res) => {
 
  Event.findById(req.params.id)
  .lean()
  .then((data) => {
    if (data) {
      res.json({ result: true, event: data });
    } else {
      res.json({ result: false, error: "event not found" });
    }
  })
  .catch((error) => {
    res.status(500).json({ result: false, error: error.message });
  });
});

// DELETE single event
// http://localhost:3000/events/single_event/:id
// http://localhost:3000/events/single_event/64db8801af6df4463b654a88

router.get("/single_event/:id", cacheMiddleware(300), (req, res) => {
  Event.findById(req.params.id)
  .lean()
  .then((data) => {
    res.json({ result: true, event: data });
  })
  .catch((error) => {
    res.status(500).json({ result: false, error: error.message });
  });
});

// POST new event
// http://localhost:3000/events/
// date sample example for test : 2023-07-19T06:30:00.000Z

  router.post("/", (req, res) => {
 
  const newEvent = new Event({
    name: req.body.name,
    location: req.body.location,
    date: req.body.date,
    zip_code: req.body.zip_code,
    start_hour: req.body.start_hour,
    active: req.body.active,
    max_capacity: req.body.max_capacity,
    description: req.body.description,
    banner_img: req.body.banner_img,
    year: req.body.year,
    thumb_image: req.body.thumb_image,
    format_s_price: req.body.format_s_price,
    format_l_price: req.body.format_l_price,
    format_s_stripe_paylink: req.body.format_s_stripe_paylink,
    format_l_stripe_paylink: req.body.format_l_stripe_paylink,
  });
 
  newEvent.save().then(() => {
    // Clear cache when new event is added
    clearCache("/events");
    res.json({ result: true, newEvent: newEvent });
  })
  .catch((error) => {
    res.status(500).json({ result: false, error: error.message });
  });
});


// DELETE event with ID
// http://localhost:3000/events/delete/:id
// http://localhost:3000/events/delete/64b500f34b1ba69f4fe2612d

router.delete("/delete/:id", (req, res) => {
  Event.deleteOne({
    _id: req.params.id,
  }).then((data) => {
    if (data.deletedCount > 0) {
      // Clear cache when event is deleted
      clearCache("/events");
      res.json({ result: true, data: data });
    } else {
      res.json({ result: false, error: "event not found" });
    }
  })
  .catch((error) => {
    res.status(500).json({ result: false, error: error.message });
  });
});



module.exports = router;
