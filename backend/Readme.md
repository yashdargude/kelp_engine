# Kelp-Engine Inc. Backend

A robust Node.js backend for Kelp-Engine Inc., using PostgreSQL and Express, following clean architecture and OOP principles. Supports event ingestion, timeline queries, event search, and advanced insights.

## Table of Contents

- Project Overview
- Setup & Installation
- Environment Variables
- API Documentation
- Example curl Commands
- Design Choices & Architecture
- Testing & Development
- Folder Structure
- License

---

## Setup & Installation

### 1. Database Table Creation

To execute the `events_table.sql` file and create the table in your PostgreSQL database, use the following command in your terminal (zsh):

```zsh
psql -U <your_db_user> -d kelp_engine -f backend/events_table.sql
```

Replace `<your_db_user>` with your actual PostgreSQL username (e.g., `yashdargude`).
You’ll be prompted for your password if required.

This will run the script and create the table and indexes in your `kelp_engine` database.

### 2. Backend Setup

1. Clone the repository.
2. Install dependencies:
   ```zsh
   cd backend
   npm install
   ```
3. Configure your PostgreSQL database and update `.env`:
   ```env
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/kelp_engine
   PORT=3000
   ```


## 3 .Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)

### 4 . Postman Collection

##to test all the api just download the postman collection from the repo and import it into your postman web or app and you can test all the api's

- kelp_engine.postman_collection.json

## API Documentation

### 1. Event Ingestion

- **POST** `/api/events/ingest`
  - Upload CSV file (`multipart/form-data`, field: `file`)
  - Response: `{ status, jobId, message }`
  - Errors: 400 (missing file), 500 (server error)

### 2. Ingestion Status

- **GET** `/api/events/ingestion-status/:jobId`
  - Response: `{ jobId, status, processedLines, errorLines, errors, startTime, endTime }`
  - Errors: 404 (job not found)

### 3. Timeline Query

- **GET** `/api/timeline/:rootEventId`
  - Response: Nested JSON timeline for the event
  - Errors: 404 (event not found), 500 (DB error)

### 4. Event Search

- **GET** `/api/events/search`
  - Query params: `name`, `startDate`, `endDate`, `parentId`, `page`, `limit`, `sort`
  - Response: `{ events: [...], totalEvents, page, limit }`
  - Errors: 400 (bad params), 500 (DB error)

### 5. Insights

- **GET** `/api/insights/overlapping-events?startDate&endDate`
  - Response: List of overlapping event pairs
- **GET** `/api/insights/temporal-gaps?startDate&endDate`
  - Response: Largest gap in event data
- **GET** `/api/insights/event-influence?fromEventId&toEventId`
  - Response: Shortest path (min duration) between two events

## Example curl Commands

**Event Ingestion:**

```zsh
curl -F "file=@Kelp_Sample_Data.csv" http://localhost:3000/api/events/ingest
```

**Check Ingestion Status:**

```zsh
curl http://localhost:3000/api/events/ingestion-status/<jobId>
```

**Timeline Query:**

```zsh
curl http://localhost:3000/api/timeline/<rootEventId>
```

**Event Search:**

```zsh
curl "http://localhost:3000/api/events/search?name=Phase&page=1&limit=2"
```

**Overlapping Events Insight:**

```zsh
curl "http://localhost:3000/api/insights/overlapping-events?startDate=2020-01-01&endDate=2022-01-01"
```

**Temporal Gaps Insight:**

```zsh
curl "http://localhost:3000/api/insights/temporal-gaps?startDate=2020-01-01&endDate=2022-01-01"
```

**Event Influence Insight:**

```zsh
curl "http://localhost:3000/api/insights/event-influence?fromEventId=<id1>&toEventId=<id2>"
```

## Error Codes

- 200: Success
- 202: Accepted (ingestion started)
- 400: Bad request / missing parameters
- 404: Not found
- 500: Internal server/database error

## Design Choices & Architecture

- **Separation of Concerns:** Controllers, models, routes, validators, and utils are organized in dedicated folders for maintainability and scalability.
- **Clean Architecture:** Business logic is separated from routing and persistence. Models handle DB access, controllers handle request logic, and routes define endpoints.
- **Async & Robust:** All DB and file operations are async, with error handling and job tracking for ingestion.
- **Validation:** Input validation is performed for all APIs to ensure data integrity.
- **Testing:** Comprehensive unit tests for all routes using Jest and Supertest, with proper resource cleanup.
- **Production Readiness:** CORS enabled, shell script for setup, `.env` for config, and `.gitignore` for security.
- **Extensibility:** Modular design allows easy addition of new features and APIs.

## Testing & Development

- Unit tests for all routes in `backend/tests/`
- Run tests:
  ```zsh
  npm test
  ```
- Test runner uses Jest & Supertest. Ensure DB is running for integration tests.

## Folder Structure

- `controllers/` - Route logic
- `models/` - DB models
- `routes/` - Express route definitions
- `validators/` - Input validation
- `utils/` - Helpers (e.g., job manager)
- `tests/` - Jest/Supertest test files
- `uploads/` - Temporary CSV uploads

## License

MIT

---

For more details, see the code and Postman collection in `postman_collections/kelp_engine.postman_collection.json`.
