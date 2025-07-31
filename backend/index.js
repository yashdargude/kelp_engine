require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const ingestRoutes = require("./routes/ingestRoutes");
const statusRoutes = require("./routes/statusRoutes");
const eventRoutes = require("./routes/eventRoutes");
const timelineRoutes = require("./routes/timelineRoutes");
const eventSearchRoutes = require("./routes/eventSearchRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const temporalGapRoutes = require("./routes/temporalGapRoutes");
const eventInfluenceRoutes = require("./routes/eventInfluenceRoutes");
const tableDataRoutes = require("./routes/tableDataRoutes");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const upload = multer({ dest: "uploads/" });
const jobs = {};

app.use("/api/events", ingestRoutes);
app.use("/api/events", statusRoutes);
app.use("/", eventRoutes);
app.use("/api", timelineRoutes);
app.use("/api", eventSearchRoutes);
app.use("/api", insightsRoutes);
app.use("/api", temporalGapRoutes);
app.use("/api", eventInfluenceRoutes);
app.use("/api", tableDataRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
