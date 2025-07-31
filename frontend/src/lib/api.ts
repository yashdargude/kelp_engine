export async function uploadLogFiles(files: FileList) {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append("logfiles", file));

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    }/api/upload-logs`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) throw new Error("Failed to upload files");

  return response.json();
}

export async function fetchStats() {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    }/api/stats`
  );
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
}

export async function fetchJobStats(jobId: string) {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    }/api/stats/${jobId}`
  );
  if (!response.ok) throw new Error(`Failed to fetch stats for job ${jobId}`);
  return response.json();
}

export async function fetchQueueStatus() {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    }/api/queue-status`
  );
  if (!response.ok) throw new Error("Failed to fetch queue status");
  return response.json();
}

// Events API functions
export async function fetchEvents(params?: {
  name?: string;
  startDate?: string;
  endDate?: string;
  parentId?: string;
  page?: number;
  limit?: number;
  sort?: string;
  eventId?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
  }

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    }/api/events/search?${searchParams.toString()}`
  );

  if (!response.ok) throw new Error("Failed to fetch events");
  return response.json();
}

// Table Data API functions
export async function fetchTableData(params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
  }

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    }/api/table-data?${searchParams.toString()}`
  );
  console.log("Table Data Response:", response);

  if (!response.ok) throw new Error("Failed to fetch table data");
  return response.json();
}

export async function fetchAllTableData(params?: {
  sortBy?: string;
  sortOrder?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
  }

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    }/api/table-data/all?${searchParams.toString()}`
  );

  if (!response.ok) throw new Error("Failed to fetch all table data");
  return response.json();
}

export async function fetchEventById(eventId: string) {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    }/api/events/search?eventId=${eventId}`
  );

  if (!response.ok) throw new Error(`Failed to fetch event ${eventId}`);
  return response.json();
}

export async function fetchTimeline(rootEventId: string) {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    }/api/timeline/${rootEventId}`
  );

  if (!response.ok)
    throw new Error(`Failed to fetch timeline for event ${rootEventId}`);
  return response.json();
}
