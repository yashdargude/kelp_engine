-- ArchaeoData Inc. Events Table DDL
-- Run this script in your PostgreSQL database to create the required table and index

CREATE TABLE events (
  eventId UUID PRIMARY KEY,
  eventName VARCHAR(255) NOT NULL,
  startDate TIMESTAMP NOT NULL,
  endDate TIMESTAMP NOT NULL,
  parentId UUID,
  researchValue INTEGER,
  description TEXT
);

-- Optional: Indexes for performance (example)
CREATE INDEX idx_events_startDate ON events(startDate);
CREATE INDEX idx_events_endDate ON events(endDate);
CREATE INDEX idx_events_parentId ON events(parentId);
