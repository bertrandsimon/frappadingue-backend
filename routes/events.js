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
// http://localhost:3000/events/single_event/64b500f34b1ba69f4fe2612d
//get single event for selected event


router.get("/single_event/:id", (req, res) => {
  Event.findById(req.params.id).then((data) =>
    res.json({ result: true, event: data })
  );
});


//http://localhost:3000/events/delete/:id
//delete jobs with id
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
