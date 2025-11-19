const mongoose = require("mongoose");

const jobTypeSchema = mongoose.Schema({
  typeName: String,
});

// Add index for frequently queried field
jobTypeSchema.index({ typeName: 1 }); // For job type name lookups

const JobType = mongoose.model("jobTypes", jobTypeSchema);

module.exports = JobType;
