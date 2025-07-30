"use client";
import { useState } from "react";
import React from "react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage("");
    setJobStatus(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://localhost:3001/api/events/ingest", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.status === 202 && data.jobId) {
        setMessage("Upload started. Job ID: " + data.jobId);
        setJobId(data.jobId);
        // Poll for status
        pollJobStatus(data.jobId);
      } else {
        setMessage(data.message || "Upload failed.");
      }
    } catch (err) {
      setMessage("Upload failed.");
    }
    setLoading(false);
  };

  const pollJobStatus = async (jobId: string) => {
    let attempts = 0;
    const poll = async () => {
      if (attempts > 30) return; // Stop after ~30s
      attempts++;
      const res = await fetch(`http://localhost:3001/api/events/ingestion-status/${jobId}`);
      const data = await res.json();
      setJobStatus(data);
      if (data.status === "PROCESSING" || data.status === "processing") {
        setTimeout(poll, 1000);
      }
    };
    poll();
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-6 py-2 relative z-10">
      <h1 className="md:text-7xl text-3xl lg:text-4xl font-bold text-center text-white relative z-20">
        CSV Event Uploader
      </h1>
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-xl shadow-md mt-8">
        <div className="flex flex-col items-center">
          <label className="w-full cursor-pointer flex flex-col items-center bg-gray-700 p-6 rounded-lg border border-dashed border-gray-500 hover:bg-gray-600">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-sm text-gray-300">
              Drag & Drop CSV file here or click to select
            </p>
          </label>
        </div>
        {file && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg text-white w-full">
            <h3 className="text-lg font-semibold mb-2">Selected File:</h3>
            <p>
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )}
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="bg-[#3cd3c4] hover:bg-[#39C3EF]/90 text-black mx-auto text-sm md:text-base transition font-medium duration-200 h-10 rounded-lg px-8 flex items-center justify-center mt-4"
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
        {message && (
          <p className="mt-4 text-center text-green-400">{message}</p>
        )}
        {jobStatus && (
          <div className="mt-6 bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold mb-4">Ingestion Status</h3>
            <pre className="text-xs whitespace-pre-wrap text-white">
              {JSON.stringify(jobStatus, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
