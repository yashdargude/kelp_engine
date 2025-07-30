const jobs = {};
const { v4: uuidv4 } = require("uuid");

function createJob() {
  const jobId = uuidv4();
  jobs[jobId] = { status: "processing", valid: [], invalid: [] };
  return jobId;
}

function getJob(jobId) {
  return jobs[jobId];
}

function updateJob(jobId, update) {
  Object.assign(jobs[jobId], update);
}

module.exports = { createJob, getJob, updateJob, jobs };
