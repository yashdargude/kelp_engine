"use client";
import React, { useState, useRef } from "react";

export default function APIsExplorer() {
  // State for each API response
  const [ingestRes, setIngestRes] = useState<any>(null);
  const [statusRes, setStatusRes] = useState<any>(null);
  const [timelineRes, setTimelineRes] = useState<any>(null);
  const [searchRes, setSearchRes] = useState<any>(null);
  const [overlapRes, setOverlapRes] = useState<any>(null);
  const [gapRes, setGapRes] = useState<any>(null);
  const [influenceRes, setInfluenceRes] = useState<any>(null);

  // Form refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jobId, setJobId] = useState("");
  const [rootEventId, setRootEventId] = useState("");
  const [searchParams, setSearchParams] = useState({
    name: "",
    page: 1,
    limit: 5,
  });
  const [overlapParams, setOverlapParams] = useState({
    startDate: "",
    endDate: "",
  });
  const [gapParams, setGapParams] = useState({ startDate: "", endDate: "" });
  const [influenceParams, setInfluenceParams] = useState({
    fromEventId: "",
    toEventId: "",
  });

  const eventIdOptions = [
    "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "c8d7e6f5-a4b3-2109-8765-4321fedcba98",
    "6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d",
    "01234567-89ab-cdef-0123-456789abcdef",
    "22334455-6677-8899-aabb-ccddeeff0011",
    "11223344-5566-7788-9900-aabbccddeeff",
  ];

  const startDateOptions = [
    "2023-01-01T10:00:00Z",
    "2023-01-05T09:00:00Z",
    "2023-01-06T10:00:00Z",
    "2023-01-06T10:30:00Z",
    "2023-01-06T11:30:00Z",
    "2023-01-02T09:00:00Z",
    "2023-04-01T09:00:00Z",
    "2023-01-01T10:30:00Z",
    "2023-01-06T13:30:00Z",
    "2023-03-01T09:00:00Z",
    "2023-02-02T17:00:00Z",
    "2023-03-05T09:00:00Z",
    "2023-02-03T09:00:00Z",
  ];
  const endDateOptions = [
    "2023-01-01T11:30:00Z",
    "2023-01-05T17:00:00Z",
    "2023-01-06T11:00:00Z",
    "2023-01-06T12:00:00Z",
    "2023-01-06T13:00:00Z",
    "2023-01-02T10:00:00Z",
    "2023-04-01T10:00:00Z",
    "2023-01-01T11:00:00Z",
    "2023-01-06T14:00:00Z",
    "2023-03-01T10:00:00Z",
    "2023-02-03T09:00:00Z",
    "2023-03-05T10:00:00Z",
    "2023-02-03T12:00:00Z",
  ];

  // API handlers
  const handleIngest = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:3001/api/events/ingest", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setIngestRes(data);
    if (data.jobId) setJobId(data.jobId);
  };

  const handleStatus = async () => {
    if (!jobId) return;
    const res = await fetch(
      `http://localhost:3001/api/events/ingestion-status/${jobId}`
    );
    setStatusRes(await res.json());
  };

  const handleTimeline = async () => {
    if (!rootEventId) return;
    const res = await fetch(
      `http://localhost:3001/api/timeline/${rootEventId}`
    );
    setTimelineRes(await res.json());
  };

  const handleSearch = async () => {
    const params = new URLSearchParams({
      name: searchParams.name,
      page: String(searchParams.page),
      limit: String(searchParams.limit),
    });
    const res = await fetch(
      `http://localhost:3001/api/events/search?${params}`
    );
    setSearchRes(await res.json());
  };

  const handleOverlap = async () => {
    const params = new URLSearchParams({
      startDate: overlapParams.startDate,
      endDate: overlapParams.endDate,
    });
    const res = await fetch(
      `http://localhost:3001/api/insights/overlapping-events?${params}`
    );
    setOverlapRes(await res.json());
  };

  const handleGap = async () => {
    const params = new URLSearchParams({
      startDate: gapParams.startDate,
      endDate: gapParams.endDate,
    });
    const res = await fetch(
      `http://localhost:3001/api/insights/temporal-gaps?${params}`
    );
    setGapRes(await res.json());
  };

  const handleInfluence = async () => {
    const params = new URLSearchParams({
      sourceEventId: influenceParams.fromEventId,
      targetEventId: influenceParams.toEventId,
    });
    const res = await fetch(
      `http://localhost:3001/api/insights/event-influence?${params}`
    );
    setInfluenceRes(await res.json());
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white min-h-screen px-6 py-8 flex flex-col items-center relative">
      {/* Top Navigation Buttons */}
      <button
        className="absolute top-6 left-6 bg-cyan-700 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-lg shadow transition-colors"
        onClick={() => (window.location.href = "/")}
      >
        ← Back to Home
      </button>
      <button
        className="absolute top-6 right-6 bg-cyan-700 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-lg shadow transition-colors"
        onClick={() => (window.location.href = "/dashboard")}
      >
        Go to Dashboard →
      </button>
      <h1 className="text-4xl font-bold mb-8 text-center text-cyan-400 drop-shadow-lg">
        API's Explorer
      </h1>
      <div className="w-full max-w-4xl space-y-12">
        {/* Event Ingestion */}
        <section className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-cyan-700">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-300">
            Event Ingestion (CSV Upload)
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              className="file:bg-cyan-700 file:text-white file:rounded file:px-3 file:py-1 file:border-none file:mr-4 text-cyan-200 bg-gray-800 px-3 py-2 rounded focus:outline-cyan-400"
            />
            <button
              onClick={handleIngest}
              className="bg-cyan-600 hover:bg-cyan-400 text-white font-bold px-6 py-2 rounded-lg shadow transition-colors"
            >
              Upload CSV
            </button>
          </div>
          {ingestRes && (
            <div className="mt-4 bg-gray-800 border border-cyan-700 rounded-lg p-4 max-h-48 overflow-auto">
              <h3 className="text-cyan-400 font-bold mb-2">Result</h3>
              <pre className="text-xs whitespace-pre-wrap text-cyan-200">
                {JSON.stringify(ingestRes, null, 2)}
              </pre>
            </div>
          )}
        </section>
        {/* Ingestion Status */}
        <section className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-cyan-700">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-300">
            Ingestion Status
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              placeholder="Job ID"
              className="text-cyan-200 bg-gray-800 px-3 py-2 rounded focus:outline-cyan-400"
            />
            <button
              onClick={handleStatus}
              className="bg-cyan-600 hover:bg-cyan-400 text-white font-bold px-6 py-2 rounded-lg shadow transition-colors"
            >
              Check Status
            </button>
          </div>
          {statusRes && (
            <div className="mt-4 bg-gray-800 border border-cyan-700 rounded-lg p-4 max-h-48 overflow-auto">
              <h3 className="text-cyan-400 font-bold mb-2">Result</h3>
              <pre className="text-xs whitespace-pre-wrap text-cyan-200">
                {JSON.stringify(statusRes, null, 2)}
              </pre>
            </div>
          )}
        </section>
        {/* Timeline Query */}
        <section className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-cyan-700">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-300">
            Timeline Query
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              value={rootEventId}
              onChange={(e) => setRootEventId(e.target.value)}
              placeholder="Root Event ID"
              className="text-cyan-200 bg-gray-800 px-3 py-2 rounded focus:outline-cyan-400"
            />
            <button
              onClick={handleTimeline}
              className="bg-cyan-600 hover:bg-cyan-400 text-white font-bold px-6 py-2 rounded-lg shadow transition-colors"
            >
              Get Timeline
            </button>
          </div>
          {timelineRes && (
            <div className="mt-4 bg-gray-800 border border-cyan-700 rounded-lg p-4 max-h-48 overflow-auto">
              <h3 className="text-cyan-400 font-bold mb-2">Result</h3>
              <pre className="text-xs whitespace-pre-wrap text-cyan-200">
                {JSON.stringify(timelineRes, null, 2)}
              </pre>
            </div>
          )}
        </section>
        {/* Event Search */}
        <section className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-cyan-700">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-300">
            Event Search
          </h2>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <input
              type="text"
              value={searchParams.name}
              onChange={(e) =>
                setSearchParams((s) => ({ ...s, name: e.target.value }))
              }
              placeholder="Name"
              className="text-cyan-200 bg-gray-800 px-3 py-2 rounded focus:outline-cyan-400"
            />
            <input
              type="number"
              value={searchParams.page}
              onChange={(e) =>
                setSearchParams((s) => ({ ...s, page: Number(e.target.value) }))
              }
              placeholder="Page"
              className="text-cyan-200 bg-gray-800 px-3 py-2 rounded focus:outline-cyan-400 w-24"
            />
            <input
              type="number"
              value={searchParams.limit}
              onChange={(e) =>
                setSearchParams((s) => ({ ...s, limit: Number(e.target.value) }))
              }
              placeholder="Limit"
              className="text-cyan-200 bg-gray-800 px-3 py-2 rounded focus:outline-cyan-400 w-24"
            />
            <button
              onClick={handleSearch}
              className="bg-cyan-600 hover:bg-cyan-400 text-white font-bold px-6 py-2 rounded-lg shadow transition-colors"
            >
              Search Events
            </button>
          </div>
          {searchRes && (
            <div className="mt-4 bg-gray-800 border border-cyan-700 rounded-lg p-4 max-h-48 overflow-auto">
              <h3 className="text-cyan-400 font-bold mb-2">Result</h3>
              <pre className="text-xs whitespace-pre-wrap text-cyan-200">
                {JSON.stringify(searchRes, null, 2)}
              </pre>
            </div>
          )}
        </section>
        {/* Insights */}
        <section className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-cyan-700">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-300">Insights</h2>
          <div className="mb-8 pb-4 border-b border-cyan-700">
            <h3 className="font-bold text-cyan-400 mb-2">Overlapping Events</h3>
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <label className="mr-2 text-cyan-200">Start Date:</label>
              <select
                value={overlapParams.startDate}
                onChange={(e) =>
                  setOverlapParams((s) => ({ ...s, startDate: e.target.value }))
                }
                className="text-cyan-200 bg-gray-800 px-3 py-2 rounded focus:outline-cyan-400"
              >
                <option value="">Select Start Date</option>
                {startDateOptions.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
              <label className="mr-2 text-cyan-200">End Date:</label>
              <select
                value={overlapParams.endDate}
                onChange={(e) =>
                  setOverlapParams((s) => ({ ...s, endDate: e.target.value }))
                }
                className="text-cyan-200 bg-gray-800 px-3 py-2 rounded focus:outline-cyan-400"
              >
                <option value="">Select End Date</option>
                {endDateOptions.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
              <button
                onClick={handleOverlap}
                className="bg-cyan-600 hover:bg-cyan-400 text-white font-bold px-6 py-2 rounded-lg shadow transition-colors"
              >
                Find Overlaps
              </button>
            </div>
            {overlapRes && (
              <div className="mt-2 bg-gray-800 border border-cyan-700 rounded-lg p-4 max-h-40 overflow-auto">
                <h4 className="text-cyan-400 font-bold mb-2">Result</h4>
                <pre className="text-xs whitespace-pre-wrap text-cyan-200">
                  {JSON.stringify(overlapRes, null, 2)}
                </pre>
              </div>
            )}
          </div>
          <div className="mb-8 pb-4 border-b border-cyan-700">
            <h3 className="font-bold text-cyan-400 mb-2">Temporal Gaps</h3>
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <label className="mr-2 text-cyan-200">Start Date:</label>
              <select
                value={gapParams.startDate}
                onChange={(e) =>
                  setGapParams((s) => ({ ...s, startDate: e.target.value }))
                }
                className="text-cyan-200 bg-gray-800 px-3 py-2 rounded focus:outline-cyan-400"
              >
                <option value="">Select Start Date</option>
                {startDateOptions.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
              <label className="mr-2 text-cyan-200">End Date:</label>
              <select
                value={gapParams.endDate}
                onChange={(e) =>
                  setGapParams((s) => ({ ...s, endDate: e.target.value }))
                }
                className="text-cyan-200 bg-gray-800 px-3 py-2 rounded focus:outline-cyan-400"
              >
                <option value="">Select End Date</option>
                {endDateOptions.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
              <button
                onClick={handleGap}
                className="bg-cyan-600 hover:bg-cyan-400 text-white font-bold px-6 py-2 rounded-lg shadow transition-colors"
              >
                Find Gaps
              </button>
            </div>
            {gapRes && (
              <div className="mt-2 bg-gray-800 border border-cyan-700 rounded-lg p-4 max-h-40 overflow-auto">
                <h4 className="text-cyan-400 font-bold mb-2">Result</h4>
                <pre className="text-xs whitespace-pre-wrap text-cyan-200">
                  {JSON.stringify(gapRes, null, 2)}
                </pre>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-cyan-400 mb-2">Event Influence</h3>
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <label className="mr-2 text-cyan-200">From Event ID:</label>
              <select
                value={influenceParams.fromEventId}
                onChange={(e) =>
                  setInfluenceParams((s) => ({ ...s, fromEventId: e.target.value }))
                }
                className="text-cyan-200 bg-gray-800 px-3 py-2 rounded focus:outline-cyan-400"
              >
                <option value="">Select Event ID</option>
                {eventIdOptions.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              <label className="mr-2 text-cyan-200">To Event ID:</label>
              <select
                value={influenceParams.toEventId}
                onChange={(e) =>
                  setInfluenceParams((s) => ({ ...s, toEventId: e.target.value }))
                }
                className="text-cyan-200 bg-gray-800 px-3 py-2 rounded focus:outline-cyan-400"
              >
                <option value="">Select Event ID</option>
                {eventIdOptions.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              <button
                onClick={handleInfluence}
                className="bg-cyan-600 hover:bg-cyan-400 text-white font-bold px-6 py-2 rounded-lg shadow transition-colors"
              >
                Find Influence
              </button>
            </div>
            {influenceRes && (
              <div className="mt-2 bg-gray-800 border border-cyan-700 rounded-lg p-4 max-h-40 overflow-auto">
                <h4 className="text-cyan-400 font-bold mb-2">Result</h4>
                <pre className="text-xs whitespace-pre-wrap text-cyan-200">
                  {JSON.stringify(influenceRes, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
