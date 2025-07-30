const express = require("express");
const router = express.Router();

const jobs = (global.jobs = global.jobs || {});

function formatJobStatus(jobId) {
  const job = jobs[jobId];
  if (!job) return null;
  const processedLines = job.valid.length;
  const errorLines = job.invalid.length;
  const totalLines = processedLines + errorLines;
  const errors = job.invalid.map((log) => {
    let lineInfo = `Line ${log.recordNum}:`;
    if (log.error && log.row) {
      if (log.error.includes("date")) {
        return `${lineInfo} Invalid date format for event '${log.row[0]}': '${log.row[2]}'`;
      } else if (log.error.includes("Record Length")) {
        return `${lineInfo} Malformed entry: '${log.row.join("|")}'`;
      } else {
        return `${lineInfo} ${log.error}`;
      }
    }
    return `${lineInfo} Unknown error.`;
  });
  let status = job.status === "processing" ? "PROCESSING" : "COMPLETED";
  const response = {
    jobId,
    status,
    processedLines,
    errorLines,
    totalLines,
    errors,
  };
  if (job.startTime) response.startTime = job.startTime;
  if (job.endTime) response.endTime = job.endTime;
  return response;
}

router.get("/ingestion-status/:jobId", (req, res) => {
  // Use global.jobs if available, else fallback to local jobs
  const jobs = global.jobs || {};
  const job = jobs[req.params.jobId];
  if (!job)
    return res.status(404).json({ status: "error", message: "Job not found." });
  res.json(formatJobStatus(req.params.jobId));
});

module.exports = router;
