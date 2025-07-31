"use client";
import React, { useState, useRef } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export default function ApiExplorerComponent() {
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
    const res = await fetch(`${API_BASE_URL}/api/events/ingest`, {
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
      `${API_BASE_URL}/api/events/ingestion-status/${jobId}`
    );
    setStatusRes(await res.json());
  };

  const handleTimeline = async () => {
    if (!rootEventId) return;
    const res = await fetch(`${API_BASE_URL}/api/timeline/${rootEventId}`);
    setTimelineRes(await res.json());
  };

  const handleSearch = async () => {
    const params = new URLSearchParams({
      name: searchParams.name,
      page: String(searchParams.page),
      limit: String(searchParams.limit),
    });
    const res = await fetch(`${API_BASE_URL}/api/events/search?${params}`);
    setSearchRes(await res.json());
  };

  const handleOverlap = async () => {
    const params = new URLSearchParams({
      startDate: overlapParams.startDate,
      endDate: overlapParams.endDate,
    });
    const res = await fetch(
      `${API_BASE_URL}/api/insights/overlapping-events?${params}`
    );
    setOverlapRes(await res.json());
  };

  const handleGap = async () => {
    const params = new URLSearchParams({
      startDate: gapParams.startDate,
      endDate: gapParams.endDate,
    });
    const res = await fetch(
      `${API_BASE_URL}/api/insights/temporal-gaps?${params}`
    );
    setGapRes(await res.json());
  };

  const handleInfluence = async () => {
    const params = new URLSearchParams({
      sourceEventId: influenceParams.fromEventId,
      targetEventId: influenceParams.toEventId,
    });
    const res = await fetch(
      `${API_BASE_URL}/api/insights/event-influence?${params}`
    );
    setInfluenceRes(await res.json());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-6 py-8">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <button
          className="group relative inline-flex items-center justify-center px-8 py-3 font-medium text-white transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          onClick={() => (window.location.href = "/")}
        >
          <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40 ease"></span>
          <span className="relative flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </span>
        </button>

        <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          API Explorer
        </h1>

        <button
          className="group relative inline-flex items-center justify-center px-8 py-3 font-medium text-white transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          onClick={() => (window.location.href = "/dashboard")}
        >
          <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40 ease"></span>
          <span className="relative flex items-center gap-2">
            Go to Dashboard
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Event Ingestion */}
        <div className="group relative bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-3xl blur-xl"></div>
          <div className="relative">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Event Ingestion
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                className="file:bg-purple-600 file:text-white file:rounded-lg file:px-4 file:py-2 file:border-none file:mr-4 text-purple-200 bg-gray-800/50 px-4 py-3 rounded-lg focus:outline-purple-400 border border-purple-500/30 backdrop-blur-sm"
              />
              <button
                onClick={handleIngest}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Upload CSV
              </button>
            </div>
            {ingestRes && (
              <div className="mt-6 bg-gray-900/80 border border-purple-500/30 rounded-xl p-4 max-h-48 overflow-auto backdrop-blur-sm">
                <h3 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Result
                </h3>
                <pre className="text-xs whitespace-pre-wrap text-purple-200">
                  {JSON.stringify(ingestRes, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Ingestion Status */}
        <div className="group relative bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 hover:border-green-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/25">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-3xl blur-xl"></div>
          <div className="relative">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Ingestion Status
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <input
                type="text"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                placeholder="Job ID"
                className="text-green-200 bg-gray-800/50 px-4 py-3 rounded-lg focus:outline-green-400 border border-green-500/30 backdrop-blur-sm"
              />
              <button
                onClick={handleStatus}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Check Status
              </button>
            </div>
            {statusRes && (
              <div className="mt-6 bg-gray-900/80 border border-green-500/30 rounded-xl p-4 max-h-48 overflow-auto backdrop-blur-sm">
                <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Result
                </h3>
                <pre className="text-xs whitespace-pre-wrap text-green-200">
                  {JSON.stringify(statusRes, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Query */}
        <div className="group relative bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-xl border border-orange-500/30 rounded-3xl p-8 hover:border-orange-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10 rounded-3xl blur-xl"></div>
          <div className="relative">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Timeline Query
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <input
                type="text"
                value={rootEventId}
                onChange={(e) => setRootEventId(e.target.value)}
                placeholder="Root Event ID"
                className="text-orange-200 bg-gray-800/50 px-4 py-3 rounded-lg focus:outline-orange-400 border border-orange-500/30 backdrop-blur-sm"
              />
              <button
                onClick={handleTimeline}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Get Timeline
              </button>
            </div>
            {timelineRes && (
              <div className="mt-6 bg-gray-900/80 border border-orange-500/30 rounded-xl p-4 max-h-48 overflow-auto backdrop-blur-sm">
                <h3 className="text-orange-400 font-bold mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Result
                </h3>
                <pre className="text-xs whitespace-pre-wrap text-orange-200">
                  {JSON.stringify(timelineRes, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Event Search */}
        <div className="group relative bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-3xl blur-xl"></div>
          <div className="relative">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Event Search
            </h2>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <input
                type="text"
                value={searchParams.name}
                onChange={(e) =>
                  setSearchParams((s) => ({ ...s, name: e.target.value }))
                }
                placeholder="Name"
                className="text-cyan-200 bg-gray-800/50 px-4 py-3 rounded-lg focus:outline-cyan-400 border border-cyan-500/30 backdrop-blur-sm"
              />
              <input
                type="number"
                value={searchParams.page}
                onChange={(e) =>
                  setSearchParams((s) => ({
                    ...s,
                    page: Number(e.target.value),
                  }))
                }
                placeholder="Page"
                className="text-cyan-200 bg-gray-800/50 px-4 py-3 rounded-lg focus:outline-cyan-400 border border-cyan-500/30 backdrop-blur-sm w-24"
              />
              <input
                type="number"
                value={searchParams.limit}
                onChange={(e) =>
                  setSearchParams((s) => ({
                    ...s,
                    limit: Number(e.target.value),
                  }))
                }
                placeholder="Limit"
                className="text-cyan-200 bg-gray-800/50 px-4 py-3 rounded-lg focus:outline-cyan-400 border border-cyan-500/30 backdrop-blur-sm w-24"
              />
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Search Events
              </button>
            </div>
            {searchRes && (
              <div className="mt-6 bg-gray-900/80 border border-cyan-500/30 rounded-xl p-4 max-h-48 overflow-auto backdrop-blur-sm">
                <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Result
                </h3>
                <pre className="text-xs whitespace-pre-wrap text-cyan-200">
                  {JSON.stringify(searchRes, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Insights Section - Full Width */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="group relative bg-gradient-to-br from-pink-600/20 to-purple-600/20 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-8 hover:border-pink-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/25">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-purple-600/10 rounded-3xl blur-xl"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 flex items-center gap-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              Insights & Analytics
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Overlapping Events */}
              <div className="bg-gray-900/50 border border-pink-500/30 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="font-bold text-pink-400 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Overlapping Events
                </h3>
                <div className="flex flex-col gap-3 mb-4">
                  <select
                    value={overlapParams.startDate}
                    onChange={(e) =>
                      setOverlapParams((s) => ({
                        ...s,
                        startDate: e.target.value,
                      }))
                    }
                    className="text-pink-200 bg-gray-800/50 px-3 py-2 rounded-lg focus:outline-pink-400 border border-pink-500/30 backdrop-blur-sm text-sm"
                  >
                    <option value="">Select Start Date</option>
                    {startDateOptions.map((date) => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                  <select
                    value={overlapParams.endDate}
                    onChange={(e) =>
                      setOverlapParams((s) => ({
                        ...s,
                        endDate: e.target.value,
                      }))
                    }
                    className="text-pink-200 bg-gray-800/50 px-3 py-2 rounded-lg focus:outline-pink-400 border border-pink-500/30 backdrop-blur-sm text-sm"
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
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-sm"
                  >
                    Find Overlaps
                  </button>
                </div>
                {overlapRes && (
                  <div className="bg-gray-800/80 border border-pink-500/30 rounded-lg p-3 max-h-32 overflow-auto backdrop-blur-sm">
                    <h4 className="text-pink-400 font-bold mb-2 text-sm">
                      Result
                    </h4>
                    <pre className="text-xs whitespace-pre-wrap text-pink-200">
                      {JSON.stringify(overlapRes, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Temporal Gaps */}
              <div className="bg-gray-900/50 border border-pink-500/30 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="font-bold text-pink-400 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Temporal Gaps
                </h3>
                <div className="flex flex-col gap-3 mb-4">
                  <select
                    value={gapParams.startDate}
                    onChange={(e) =>
                      setGapParams((s) => ({ ...s, startDate: e.target.value }))
                    }
                    className="text-pink-200 bg-gray-800/50 px-3 py-2 rounded-lg focus:outline-pink-400 border border-pink-500/30 backdrop-blur-sm text-sm"
                  >
                    <option value="">Select Start Date</option>
                    {startDateOptions.map((date) => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                  <select
                    value={gapParams.endDate}
                    onChange={(e) =>
                      setGapParams((s) => ({ ...s, endDate: e.target.value }))
                    }
                    className="text-pink-200 bg-gray-800/50 px-3 py-2 rounded-lg focus:outline-pink-400 border border-pink-500/30 backdrop-blur-sm text-sm"
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
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-sm"
                  >
                    Find Gaps
                  </button>
                </div>
                {gapRes && (
                  <div className="bg-gray-800/80 border border-pink-500/30 rounded-lg p-3 max-h-32 overflow-auto backdrop-blur-sm">
                    <h4 className="text-pink-400 font-bold mb-2 text-sm">
                      Result
                    </h4>
                    <pre className="text-xs whitespace-pre-wrap text-pink-200">
                      {JSON.stringify(gapRes, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Event Influence */}
              <div className="bg-gray-900/50 border border-pink-500/30 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="font-bold text-pink-400 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Event Influence
                </h3>
                <div className="flex flex-col gap-3 mb-4">
                  <select
                    value={influenceParams.fromEventId}
                    onChange={(e) =>
                      setInfluenceParams((s) => ({
                        ...s,
                        fromEventId: e.target.value,
                      }))
                    }
                    className="text-pink-200 bg-gray-800/50 px-3 py-2 rounded-lg focus:outline-pink-400 border border-pink-500/30 backdrop-blur-sm text-sm"
                  >
                    <option value="">From Event ID</option>
                    {eventIdOptions.map((id) => (
                      <option key={id} value={id}>
                        {id.substring(0, 8)}...
                      </option>
                    ))}
                  </select>
                  <select
                    value={influenceParams.toEventId}
                    onChange={(e) =>
                      setInfluenceParams((s) => ({
                        ...s,
                        toEventId: e.target.value,
                      }))
                    }
                    className="text-pink-200 bg-gray-800/50 px-3 py-2 rounded-lg focus:outline-pink-400 border border-pink-500/30 backdrop-blur-sm text-sm"
                  >
                    <option value="">To Event ID</option>
                    {eventIdOptions.map((id) => (
                      <option key={id} value={id}>
                        {id.substring(0, 8)}...
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleInfluence}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-sm"
                  >
                    Find Influence
                  </button>
                </div>
                {influenceRes && (
                  <div className="bg-gray-800/80 border border-pink-500/30 rounded-lg p-3 max-h-32 overflow-auto backdrop-blur-sm">
                    <h4 className="text-pink-400 font-bold mb-2 text-sm">
                      Result
                    </h4>
                    <pre className="text-xs whitespace-pre-wrap text-pink-200">
                      {JSON.stringify(influenceRes, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
