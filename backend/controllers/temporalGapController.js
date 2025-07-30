const temporalGapModel = require("../models/temporalGapModel");

class TemporalGapController {
  async findLargestGap(req, res) {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ message: "startDate and endDate are required." });
      }
      const events = await temporalGapModel.getEventsInRange(
        startDate,
        endDate
      );
      if (!events || events.length < 2) {
        return res.json({
          largestGap: null,
          message:
            "No significant temporal gaps found within the specified range, or too few events.",
        });
      }
      // Sort events by startDate
      events.sort((a, b) => new Date(a.startdate) - new Date(b.startdate));
      let largestGap = null;
      let maxDuration = 0;
      let precedingEvent = null;
      let succeedingEvent = null;
      // Check gap before first event
      let gapStart = new Date(startDate);
      let gapEnd = new Date(events[0].startdate);
      let gapDuration = (gapEnd - gapStart) / 60000;
      if (gapDuration > maxDuration) {
        maxDuration = gapDuration;
        largestGap = {
          startOfGap: gapStart.toISOString(),
          endOfGap: gapEnd.toISOString(),
          durationMinutes: Math.round(gapDuration),
        };
        precedingEvent = null;
        succeedingEvent = {
          event_id: events[0].eventid,
          event_name: events[0].eventname,
          start_date: events[0].startdate,
        };
      }
      // Check gaps between events
      for (let i = 0; i < events.length - 1; i++) {
        let gapStart = new Date(events[i].enddate);
        let gapEnd = new Date(events[i + 1].startdate);
        let gapDuration = (gapEnd - gapStart) / 60000;
        if (gapDuration > maxDuration) {
          maxDuration = gapDuration;
          largestGap = {
            startOfGap: gapStart.toISOString(),
            endOfGap: gapEnd.toISOString(),
            durationMinutes: Math.round(gapDuration),
          };
          precedingEvent = {
            event_id: events[i].eventid,
            event_name: events[i].eventname,
            end_date: events[i].enddate,
          };
          succeedingEvent = {
            event_id: events[i + 1].eventid,
            event_name: events[i + 1].eventname,
            start_date: events[i + 1].startdate,
          };
        }
      }
      // Check gap after last event
      gapStart = new Date(events[events.length - 1].enddate);
      gapEnd = new Date(endDate);
      gapDuration = (gapEnd - gapStart) / 60000;
      if (gapDuration > maxDuration) {
        maxDuration = gapDuration;
        largestGap = {
          startOfGap: gapStart.toISOString(),
          endOfGap: gapEnd.toISOString(),
          durationMinutes: Math.round(gapDuration),
        };
        precedingEvent = {
          event_id: events[events.length - 1].eventid,
          event_name: events[events.length - 1].eventname,
          end_date: events[events.length - 1].enddate,
        };
        succeedingEvent = null;
      }
      if (!largestGap || maxDuration < 1) {
        return res.json({
          largestGap: null,
          message:
            "No significant temporal gaps found within the specified range, or too few events.",
        });
      }
      largestGap.precedingEvent = precedingEvent;
      largestGap.succeedingEvent = succeedingEvent;
      return res.json({
        largestGap,
        message: "Largest temporal gap identified.",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new TemporalGapController();
