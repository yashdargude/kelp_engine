const timelineModel = require("../models/timelineModel");

class TimelineController {
  async buildTimeline(eventId) {
    const event = await timelineModel.getEventById(eventId);
    if (!event) return null;
    const children = await timelineModel.getChildren(eventId);
    const durationMinutes = Math.round(
      (new Date(event.enddate) - new Date(event.startdate)) / 60000
    );
    return {
      event_id: event.eventid,
      event_name: event.eventname,
      description: event.description,
      start_date: event.startdate,
      end_date: event.enddate,
      duration_minutes: durationMinutes,
      parent_event_id: event.parentid,
      children: await Promise.all(
        children.map((child) => this.buildTimeline(child.eventid))
      ),
    };
  }

  async getTimeline(req, res) {
    const { rootEventId } = req.params;
    const timeline = await this.buildTimeline(rootEventId);
    if (!timeline) return res.status(404).json({ error: "Event not found" });
    res.json(timeline);
  }
}

module.exports = new TimelineController();
