const mongoose = require("mongoose");
const JobType = require("./jobTypes");

const jobSchema = mongoose.Schema({
  title: String,
  description: String,
  contract: { type: mongoose.Schema.Types.ObjectId, ref: "contracts" },
  date: Date,
  reference: String,
  store: { type: mongoose.Schema.Types.ObjectId, ref: "stores" },
  jobType: { type: mongoose.Schema.Types.ObjectId, ref: "jobTypes" },
  isTopOffer: Boolean,
  isValidated: Boolean,
  candidateFound: Boolean,
  isDisplayed: Boolean,
  jobImage: String,
});

// Add indexes for frequently queried fields
jobSchema.index({ isValidated: 1, isTopOffer: 1 }); // Compound index for common query pattern
jobSchema.index({ store: 1, isValidated: 1 }); // For postal code searches
jobSchema.index({ jobType: 1, isValidated: 1 }); // For job type searches
jobSchema.index({ date: -1 }); // For sorting by date

const Job = mongoose.model("jobs", jobSchema);

module.exports = Job;
