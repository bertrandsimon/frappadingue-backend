var express = require("express");
var router = express.Router();
//const { checkBody } = require("../modules/checkbody");
const Event = require("../models/events");
// const JobType = require("../models/jobTypes");

//http://localhost:3000/events/allEvents

router.get("/allEvents", (req, res) => {
  Event.find().then((data) => {
    res.json({ result: true, all: data });
  });
});

//http://localhost:3000/events/single_event/:id
//get single event for selected event
// ie : 64b500f34b1ba69f4fe2612b

// http://localhost:3000/events/single_event/64b500f34b1ba69f4fe2612b

router.get("/single_event/:id", (req, res) => {
  Event.findById(req.params.id).then((data) =>
    res.json({ result: true, event: data })
  );
});


module.exports = router;
