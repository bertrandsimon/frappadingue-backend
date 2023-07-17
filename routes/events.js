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


module.exports = router;
