# Table Data API Documentation

This document describes the new Table Data API endpoints for fetching events data from the database.

## Endpoints

### 1. GET /api/table-data

Fetch all events with pagination and sorting.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 100, max: 1000)
- `sortBy` (optional): Field to sort by (default: startDate)
- `sortOrder` (optional): Sort order - asc/desc (default: desc)

**Valid sortBy values:**
- `eventId`
- `eventName`
- `startDate`
- `endDate`
- `parentId`
- `researchValue`
- `description`

**Example Request:**
```bash
curl "http://localhost:3001/api/table-data?page=1&limit=50&sortBy=startDate&sortOrder=desc"
```

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "eventId": "uuid-here",
      "eventName": "Event Name",
      "startDate": "2023-01-01T00:00:00Z",
      "endDate": "2023-01-31T23:59:59Z",
      "parentId": "parent-uuid-or-null",
      "researchValue": 85,
      "description": "Event description"
    }
  ],
  "totalEvents": 150,
  "page": 1,
  "limit": 50,
  "totalPages": 3
}
```

### 2. GET /api/table-data/all

Fetch all events without pagination.

**Query Parameters:**
- `sortBy` (optional): Field to sort by (default: startDate)
- `sortOrder` (optional): Sort order - asc/desc (default: desc)

**Example Request:**
```bash
curl "http://localhost:3001/api/table-data/all?sortBy=eventName&sortOrder=asc"
```

**Response:**
```json
{
  "success": true,
  "events": [...],
  "totalEvents": 150
}
```

### 3. GET /api/table-data/count

Get total count of events.

**Example Request:**
```bash
curl "http://localhost:3001/api/table-data/count"
```

**Response:**
```json
{
  "success": true,
  "totalEvents": 150
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `500`: Internal Server Error

## Frontend Integration

The frontend StatsTable component now uses these endpoints:

```typescript
import { fetchAllTableData, fetchTableData } from "../lib/api";

// Fetch all events
const data = await fetchAllTableData();

// Fetch with pagination
const data = await fetchTableData({ 
  page: 1, 
  limit: 50, 
  sortBy: 'startDate', 
  sortOrder: 'desc' 
});
```

## File Structure

```
backend/
├── models/
│   └── tableDataModel.js      # Database operations
├── controllers/
│   └── tableDataController.js # Business logic
├── routes/
│   └── tableDataRoutes.js     # API endpoints
├── validators/
│   └── tableDataValidator.js  # Input validation
└── index.js                   # Route registration
```

## Security Features

- **SQL Injection Prevention**: All user inputs are validated and sanitized
- **Parameter Validation**: Query parameters are validated before processing
- **Rate Limiting**: Built-in limits on record fetching (max 1000 per request)
- **Error Handling**: Comprehensive error handling and logging 