var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkbody");
const Job = require("../models/jobs");
const Applicant = require("../models/applicants");
const Contract = require("../models/contracts");
const JobType = require("../models/jobTypes");
const Store = require("../models/stores");
const { cacheMiddleware, clearCache } = require("../modules/cache");

// http://localhost:3000/jobs/
// creat a new job advertisement
router.post("/", (req, res) => {
  if (!checkBody(req.body, ["title"])) {
    res.json({ result: false, error: "Missing or empty field" });
    return;
  }

  // job not yet registred => creat new job advertisement
  const newJob = new Job({
    title: req.body.title,
    date: new Date(),
    reference: req.body.reference,
    description: req.body.description,
    contract: req.body.contract,
    store: req.body.store,
    jobType: req.body.job_type,
    isTopOffer: req.body.isTopOffer,
    isValidated: req.body.isValidated,
    candidateFound: req.body.candidateFound,
    isDisplayed: req.body.isDisplayed,
    jobImage: req.body.jobImage,
  });
  // save the new  job advertisement
  newJob.save().then(() => {
    // Clear cache when new job is added
    clearCache("/jobs");
    res.json({ result: true, newjob: newJob });
  })
  .catch((error) => {
    res.status(500).json({ result: false, error: error.message });
  });
});

// router get search all, by validated or not, by top Offers or not
//http://localhost:3000/jobs/
// router get search all
router.get("/", cacheMiddleware(300), async (req, res) => {
  try {
    // Use MongoDB queries instead of JavaScript filtering for better performance
    const [allOffers, topOffers, allJobs, offersValidated, offersNotValidated] = await Promise.all([
      Job.find()
        .populate("contract")
        .populate("store")
        .populate("jobType")
        .lean(),
      Job.find({ isTopOffer: true, isValidated: true })
        .populate("contract")
        .populate("store")
        .populate("jobType")
        .lean(),
      Job.find({ isTopOffer: false, isValidated: true })
        .populate("contract")
        .populate("store")
        .populate("jobType")
        .lean(),
      Job.find({ isValidated: true })
        .populate("contract")
        .populate("store")
        .populate("jobType")
        .lean(),
      Job.find({ isValidated: false })
        .populate("contract")
        .populate("store")
        .populate("jobType")
        .lean(),
    ]);

    res.json({
      result: true,
      allOffers,
      topOffers,
      allJobs,
      offersValidated,
      offersNotValidated,
    });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

//http://localhost:3000/jobs/code/:postalCode
//search by postal code (offer validated only)
router.get("/code/:postalCode", cacheMiddleware(300), async (req, res) => {
  try {
    // First find stores with matching postal code, then find jobs
    const stores = await Store.find({ postalCode: req.params.postalCode }).lean();
    const storeIds = stores.map(store => store._id);
    
    const postal = await Job.find({
      store: { $in: storeIds },
      isValidated: true
    })
      .populate("contract")
      .populate("store")
      .populate("jobType")
      .lean();

    res.json({ result: true, storeSelected: postal });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

//http://localhost:3000/jobs/type/:jobtype
// search by jobTag (offer validated only)
router.get("/type/:jobtype", cacheMiddleware(300), async (req, res) => {
  try {
    // First find job type, then find jobs with that type
    const jobType = await JobType.findOne({ typeName: req.params.jobtype }).lean();
    
    if (!jobType) {
      return res.json({ result: false, error: "job type not found" });
    }

    const typeOfJob = await Job.find({
      jobType: jobType._id,
      isValidated: true
    })
      .populate("contract")
      .populate("store")
      .populate("jobType")
      .lean();

    res.json({ result: true, Jobtag: typeOfJob });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});
//http://localhost:3000/jobs/id/:id
// search offer by Id
router.get("/id/:id", cacheMiddleware(300), (req, res) => {
  Job.findOne({
    _id: req.params.id,
  })
  .populate("contract")
  .populate("store")
  .populate("jobType")
  .lean()
  .then((data) => {
    if (data) {
      res.json({ result: true, job: data });
    } else {
      res.json({ result: false, error: "job advertisement not found" });
    }
  })
  .catch((error) => {
    res.status(500).json({ result: false, error: error.message });
  });
});

//http://localhost:3000/jobs/delete/:delete
//delete jobs with id
router.delete("/delete/:delete", (req, res) => {
  Job.deleteOne({
    _id: req.params.delete,
  }).then((data) => {
    if (data.deletedCount > 0) {
      // Clear cache when job is deleted
      clearCache("/jobs");
      res.json({ result: true, data: data.reference });
    } else {
      res.json({ result: false, error: "job not found" });
    }
  })
  .catch((error) => {
    res.status(500).json({ result: false, error: error.message });
  });
});
//http://localhost:3000/jobs/type
//create new jobType
router.post("/type", (req, res) => {
  const newJobType = new JobType({
    typeName: req.body.type,
  });
  newJobType.save();
});
//http://localhost:3000/jobs/liked
//add a new liked job to applicant
router.post("/liked", (req, res) => {
  Applicant.updateOne(
    { token: req.body.token },
    { $push: { likedJobs: req.body.idJob } }
  ).then((data) => {
    const isGood = data.modifiedCount > 0;
    console.log(data);
    res.json({ result: isGood });
  });
});
//http://localhost:3000/jobs/applied
//add a new applied job to applicant
router.post("/applied", (req, res) => {
  Applicant.updateOne(
    { token: req.body.token },
    { $push: { appliedJobs: req.body.idJob } }
  ).then((data) => {
    const isGood = data.modifiedCount > 0;
    res.json({ result: isGood });
  });
});

//http://localhost:3000/jobs/allTypes
//get all types
router.get("/allTypes", cacheMiddleware(600), (req, res) => {
  JobType.find()
  .lean()
  .then((data) => {
    res.json({ result: true, all: data });
  })
  .catch((error) => {
    res.status(500).json({ result: false, error: error.message });
  });
});

//http://localhost:3000/jobs/byTypes
//sort jobs by types

router.get("/byTypes", cacheMiddleware(300), async (req, res) => {
  try {
    const types = await JobType.find().lean();
    const typeIds = types.map(type => type._id);
    
    // Fetch all jobs with populated fields
    const jobs = await Job.find()
      .populate("contract")
      .populate("store")
      .populate("jobType")
      .lean();

    // Use Map for O(1) lookup instead of filter
    const jobsByTypeMap = new Map();
    types.forEach((type) => {
      jobsByTypeMap.set(type.typeName.toString(), {
        key: type.typeName,
        nb: 0,
        data: [],
      });
    });

    // Group jobs by type
    jobs.forEach((job) => {
      if (job.jobType && jobsByTypeMap.has(job.jobType.typeName)) {
        const typeData = jobsByTypeMap.get(job.jobType.typeName);
        typeData.nb++;
        typeData.data.push(job);
      }
    });

    const sortedJobs = Array.from(jobsByTypeMap.values());
    res.json({ result: true, jobsByType: sortedJobs });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

//http://localhost:3000/jobs/update/:key
//Change value for one key in one job
router.post("/update/:key", (req, res) => {
  Job.findOne({ _id: req.body.id })
  .then((data) => {
    if (!data) {
      return res.json({ result: false, error: "job not found" });
    }
    const newValue = data[req.params.key];
    Job.updateOne({ _id: data._id }, { [req.params.key]: !newValue })
    .then((data) => {
      // Clear cache when job is updated
      clearCache("/jobs");
      res.json({ result: data.modifiedCount > 0 });
    });
  })
  .catch((error) => {
    res.status(500).json({ result: false, error: error.message });
  });
});

//http://localhost:3000/jobs/inputData
//all data for input autocomplete
router.get("/inputData", cacheMiddleware(600), async (req, res) => {
  try {
    const [jobs, stores] = await Promise.all([
      Job.find().select("title").lean(),
      Store.find().select("postalCode storeName").lean(),
    ]);

    // Use Set for unique values (faster than filter + indexOf)
    const jobNameSet = new Set(jobs.map((el) => el.title));
    const jobName = Array.from(jobNameSet);
    
    const storeData = stores.map((el) => {
      return `${el.postalCode} ${el.storeName}`;
    });

    res.json({ result: true, postes: jobName, stores: storeData });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

//http://localhost:3000/jobs/deleteLiked
//delete one job liked
router.delete("/deleteLiked", (req, res) => {
  Applicant.updateOne(
    { token: req.body.token },
    { $pull: { likedJobs: req.body.idJob } }
  ).then((data) => {
    res.json({ result: data.modifiedCount > 0 });
  })
  .catch((error) => {
    res.status(500).json({ result: false, error: error.message });
  });
});
//localhost:3000/jobs/deleteApplied
//delete one job applied
router.delete("/deleteApplied", (req, res) => {
  Applicant.updateOne(
    { token: req.body.token },
    { $pull: { appliedJobs: req.body.idJob } }
  ).then((data) => res.json({ result: data.modifiedCount > 0 }))
  .catch((error) => {
    res.status(500).json({ result: false, error: error.message });
  });
});

module.exports = router;
