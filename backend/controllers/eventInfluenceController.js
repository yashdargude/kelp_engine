const eventInfluenceModel = require("../models/eventInfluenceModel");

class EventInfluenceController {
  async findShortestPath(req, res) {
    try {
      const { sourceEventId, targetEventId } = req.query;
      if (!sourceEventId || !targetEventId) {
        return res
          .status(400)
          .json({ message: "sourceEventId and targetEventId are required." });
      }
      const events = await eventInfluenceModel.getAllEvents();
      // Build event map and adjacency list
      const eventMap = {};
      const childrenMap = {};
      events.forEach((e) => {
        eventMap[e.eventid] = e;
        if (!childrenMap[e.eventid]) childrenMap[e.eventid] = [];
      });
      events.forEach((e) => {
        if (e.parentid && eventMap[e.parentid]) {
          if (!childrenMap[e.parentid]) childrenMap[e.parentid] = [];
          childrenMap[e.parentid].push(e.eventid);
        }
      });
      // Dijkstra's algorithm for shortest path (duration as cost)
      const queue = [{ id: sourceEventId, path: [], cost: 0 }];
      const visited = new Set();
      let shortest = null;
      while (queue.length) {
        queue.sort((a, b) => a.cost - b.cost);
        const { id, path, cost } = queue.shift();
        if (visited.has(id)) continue;
        visited.add(id);
        const event = eventMap[id];
        if (!event) continue;
        const duration = Math.round(
          (new Date(event.enddate) - new Date(event.startdate)) / 60000
        );
        const newPath = [
          ...path,
          {
            event_id: event.eventid,
            event_name: event.eventname,
            duration_minutes: duration,
          },
        ];
        const newCost = cost + duration;
        if (id === targetEventId) {
          if (!shortest || newCost < shortest.cost) {
            shortest = { path: newPath, cost: newCost };
          }
          continue;
        }
        for (const childId of childrenMap[id] || []) {
          if (!visited.has(childId)) {
            queue.push({ id: childId, path: newPath, cost: newCost });
          }
        }
      }
      if (!shortest) {
        return res.json({
          sourceEventId,
          targetEventId,
          shortestPath: [],
          totalDurationMinutes: 0,
          message: "No temporal path found from source to target event.",
        });
      }
      return res.json({
        sourceEventId,
        targetEventId,
        shortestPath: shortest.path,
        totalDurationMinutes: shortest.cost,
        message: "Shortest temporal path found from source to target event.",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new EventInfluenceController();
