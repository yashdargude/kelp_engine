"use client";
import { useEffect, useState } from "react";
import { fetchAllTableData } from "../lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import React from "react";
import { SparklesCore } from "./ui/sparkles";

// ✅ Define Type For Events (Frontend - camelCase)
type Event = {
  eventId: string;
  eventName: string;
  startDate: string;
  endDate: string;
  parentId: string | null;
  researchValue: number | null;
  description: string | null;
};

// ✅ Define Type For API Response (Backend - snake_case)
type ApiEvent = {
  eventid: string;
  eventname: string;
  startdate: string;
  enddate: string;
  parentid: string | null;
  researchvalue: number | null;
  description: string | null;
};

export default function StatsTable() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Event;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        console.log("Fetching events from API...");
        console.log(
          "API URL:",
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
          }/api/table-data/all`
        );

        const data = await fetchAllTableData();
        console.log("API Response:", data);

        if (data && data.success) {
          console.log("Raw events data:", data.events);
          console.log("First event sample:", data.events?.[0]);

          // Map API fields from snake_case to camelCase
          const mappedEvents = (data.events || []).map((e: ApiEvent) => ({
            eventId: e.eventid,
            eventName: e.eventname,
            startDate: e.startdate,
            endDate: e.enddate,
            parentId: e.parentid,
            researchValue: e.researchvalue,
            description: e.description,
          }));

          setEvents(mappedEvents);
          console.log("Events set:", mappedEvents.length, "events");
          console.log("Mapped first event:", mappedEvents[0]);
        } else {
          console.error("API returned unsuccessful response:", data);
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        console.error(
          "Error details:",
          error instanceof Error ? error.message : String(error)
        );
        setEvents([]);
      }
    }
    loadEvents();
  }, []);

  const sortTable = (key: keyof Event, direction: "asc" | "desc") => {
    setSortConfig({ key, direction });

    setEvents((prevEvents) => {
      return [...prevEvents].slice().sort((a, b) => {
        let valA: any = a[key];
        let valB: any = b[key];

        // Handle date sorting
        if (key === "startDate" || key === "endDate") {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }
        // Handle number sorting
        else if (typeof valA === "number" && typeof valB === "number") {
          // Keep as numbers
        }
        // Handle string sorting
        else {
          valA = String(valA || "");
          valB = String(valB || "");
        }

        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6">
      <div className="h-[10rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
        <h1 className="md:text-7xl text-3xl lg:text-4xl font-bold text-center text-white relative z-20">
          Events Timeline
        </h1>
        <div className="w-[20rem] h-5 relative">
          {/* Gradients */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

          {/* Core component */}
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 justify-center sm:justify-center md:justify-start ml-10">
        <button
          onClick={() => sortTable("eventName", "asc")}
          className="relative inline-flex h-10 sm:h-8 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 sm:px-3 py-2 sm:py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Sort by Name ↑
          </span>
        </button>
        <button
          onClick={() => sortTable("startDate", "asc")}
          className="relative inline-flex h-10 sm:h-8 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 sm:px-3 py-2 sm:py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Sort by Start Date ↑
          </span>
        </button>
        <button
          onClick={() => sortTable("researchValue", "desc")}
          className="relative inline-flex h-10 sm:h-8 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 sm:px-3 py-2 sm:py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Sort by Research Value ↓
          </span>
        </button>
      </div>

      <div className="overflow-x-auto m-4 sm:m-6 md:m-10 rounded-xl">
        <Table className="w-full border border-gray-200">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold text-center border-b border-gray-700">
              <TableHead className="text-center uppercase tracking-wide text-gray-300 px-4 py-3">
                Event Name
              </TableHead>
              <TableHead className="text-center uppercase tracking-wide text-gray-300 px-4 py-3">
                Start Date
              </TableHead>
              <TableHead className="text-center uppercase tracking-wide text-gray-300 px-4 py-3">
                End Date
              </TableHead>
              <TableHead className="text-center uppercase tracking-wide text-gray-300 px-4 py-3">
                Research Value
              </TableHead>
              <TableHead className="text-center uppercase tracking-wide text-gray-300 px-4 py-3">
                Parent ID
              </TableHead>
              <TableHead className="text-center uppercase tracking-wide text-gray-300 px-4 py-3">
                Description
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(() => {
              console.log("Rendering events:", events.length, "events");
              return null;
            })()}
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-white text-center py-8">
                  No events found. Loading...
                </TableCell>
              </TableRow>
            ) : (
              events.map((event, index) => (
                <TableRow
                  key={`${event.eventId}-${index}`}
                  className="border-b hover:bg-gray-900"
                >
                  <TableCell className="text-white font-semibold text-center">
                    {event.eventName}
                  </TableCell>
                  <TableCell className="text-white font-semibold text-center">
                    {formatDate(event.startDate)}
                  </TableCell>
                  <TableCell className="text-white font-semibold text-center">
                    {formatDate(event.endDate)}
                  </TableCell>
                  <TableCell className="text-white font-semibold text-center">
                    {event.researchValue || "N/A"}
                  </TableCell>
                  <TableCell className="truncate text-white max-w-xs text-center">
                    {event.parentId
                      ? event.parentId.substring(0, 8) + "..."
                      : "Root"}
                  </TableCell>
                  <TableCell className="text-white text-center max-w-md">
                    <div
                      className="truncate"
                      title={event.description || "No description"}
                    >
                      {event.description || "No description"}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
