const express = require("express");
const multer = require("multer");
const { ingestEvents } = require("../controllers/eventController");
const { createJob, getJob } = require("../utils/jobManager");
const { getAllEvents, checkDbStatus } = require("../models/eventModel");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/events", async (req, res) => {
  try {
    const events = await getAllEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/db-status", async (req, res) => {
  try {
    const status = await checkDbStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.post("/api/events/ingest", upload.single("file"), async (req, res) => {
  const jobId = createJob();
  let filePath;
  if (req.file) {
    filePath = req.file.path;
  } else if (req.body.filePath) {
    filePath = req.body.filePath;
  } else {
    return res
      .status(400)
      .json({ status: "error", jobId, message: "No file provided." });
  }
  setImmediate(() => ingestEvents(filePath, jobId));
  res
    .status(202)
    .json({
      status: "Ingestion initiated",
      jobId,
      message: "CSV ingestion started.",
    });
});

router.get("/api/events/ingest/:jobId", (req, res) => {
  const job = getJob(req.params.jobId);
  if (!job)
    return res.status(404).json({ status: "error", message: "Job not found." });
  res.json(job);
});

module.exports = router;
