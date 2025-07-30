const express = require("express");
const multer = require("multer");
const { Pool } = require("pg");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { parseParentId } = require("../validators/eventValidator");

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const jobs = (global.jobs = global.jobs || {});

router.post("/ingest", upload.single("file"), async (req, res) => {
  const jobId = uuidv4();
  jobs[jobId] = {
    status: "processing",
    valid: [],
    invalid: [],
    startTime: new Date().toISOString(),
  };
  let filePath;
  if (req.file) {
    filePath = req.file.path;
  } else if (req.body && req.body.filePath) {
    filePath = req.body.filePath;
  } else {
    jobs[jobId].status = "failed";
    return res
      .status(400)
      .json({ status: "error", jobId, message: "No file provided." });
  }

  try {
    if (!fs.existsSync(filePath)) {
      jobs[jobId].status = "failed";
      return res.status(400).json({ status: "error", jobId, message: "File not found." });
    }
    setImmediate(() => {
      let recordNum = 1;
      const readline = require("readline");
      const stream = fs.createReadStream(filePath);
      const rl = readline.createInterface({ input: stream });
      rl.on("line", async (line) => {
        if (!line.trim()) return recordNum++;
        const row = line.split("|");
        let log = { recordNum, row };
        if (row.length === 6) {
          row.splice(5, 0, null);
        }
        if (row.length !== 7) {
          log.status = "invalid";
          log.action = "skipped";
          log.error = `Invalid Record Length: expect 7, got ${row.length}`;
          jobs[jobId].invalid.push(log);
          return recordNum++;
        }
        row[4] = parseParentId(row[4]);
        const uuidRegex =
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!uuidRegex.test(row[0])) {
          log.status = "invalid";
          log.action = "skipped";
          log.error = "Invalid eventId UUID format";
          jobs[jobId].invalid.push(log);
          return recordNum++;
        }
        if (row[4] && row[4] !== null && !uuidRegex.test(row[4])) {
          log.status = "invalid";
          log.action = "skipped";
          log.error = "Invalid parentId UUID format";
          jobs[jobId].invalid.push(log);
          return recordNum++;
        }
        if (isNaN(Date.parse(row[2])) || isNaN(Date.parse(row[3]))) {
          log.status = "invalid";
          log.action = "skipped";
          log.error = "Invalid date format";
          jobs[jobId].invalid.push(log);
          return recordNum++;
        }
        if (!row[0] || !row[1] || !row[2] || !row[3] || !row[5] || !row[6]) {
          log.status = "invalid";
          log.action = "skipped";
          log.error = "Missing required fields";
          jobs[jobId].invalid.push(log);
          return recordNum++;
        }
        try {
          await pool.query(
            "INSERT INTO events (eventId, eventName, startDate, endDate, parentId, researchValue, description) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (eventId) DO NOTHING",
            row
          );
          log.status = "valid";
          log.action = "inserted";
          jobs[jobId].valid.push(log);
        } catch (err) {
          log.status = "valid";
          log.action = "db_error";
          log.error = err.message;
          jobs[jobId].invalid.push(log);
        }
        recordNum++;
      });
      rl.on("close", () => {
        jobs[jobId].status = "completed";
        jobs[jobId].endTime = new Date().toISOString();
      });
      rl.on("error", (err) => {
        jobs[jobId].status = "failed";
        jobs[jobId].error = err.message;
      });
    });
    return res.status(202).json({
      status: "Ingestion initiated",
      jobId,
      message: "CSV ingestion started.",
    });
  } catch (err) {
    jobs[jobId].status = "failed";
    return res.status(500).json({ status: "error", jobId, message: err.message });
  }
});

module.exports = router;
