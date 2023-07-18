var express = require("express");
var router = express.Router();
//const { checkBody } = require("../modules/checkbody");
const Event = require("../models/events");


// GET all events
// http://localhost:3000/events/allEvents

router.get("/allEvents", (req, res) => {
  Event.find().then((data) => {
    res.json({ result: true, all: data });
  });
});

// GET single event for selected event
// http://localhost:3000/events/single_event/:id
// http://localhost:3000/events/single_event/64b500f34b1ba69f4fe2612d

router.get("/single_event/:id", (req, res) => {
  Event.findById(req.params.id).then((data) =>
    res.json({ result: true, event: data })
  );
});

// POST new event
// http://localhost:3000/events/
// date sample example for test : 2023-07-19T06:30:00.000Z

  router.post("/", (req, res) => {
 
  const newEvent = new Event({
    name: req.body.name,
    location: req.body.location,
    date: req.body.date,
    zip_code: req.body.zipCode,
    start_hour: req.body.startHour,
    active: req.body.active,
    max_capacity: req.body.maxCapacity,
    description: req.body.description,
    banner_img: req.body.bannerImg,
    price: req.body.price,
    year: req.body.year,
    thumb_image: req.body.thumbImage,
  });
 
  newEvent.save().then(() => {
    res.json({ result: true, newEvent: newEvent });
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
      console.log(data);
      res.json({ result: true, data: data });
    } else {
      res.json({ result: false, error: "event not found" });
    }
  });
});



module.exports = router;
