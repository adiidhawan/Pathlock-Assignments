---

```markdown
# Home Assignment 1 – Basic Task Manager

## Overview
A minimal full-stack Task Management app built using .NET 8 (C#) and React + TypeScript.  
It allows users to add, update, delete, and toggle tasks through a simple RESTful API displayed in a clean, responsive frontend UI.

---

## Tech Stack

| Layer | Technology | Description |
|-------|-------------|-------------|
| Backend | .NET 8 (C#) | REST API using controllers and in-memory task service |
| Frontend | React + TypeScript | UI built with functional components and Axios for API calls |
| Build Tools | Vite / npm | Modern React tooling for fast development |
| Data Storage | In-memory | Temporary storage (resets when server restarts) |

---

## Project Structure

```

basic-task-manager/
│
├── basic-task-api/             # .NET 8 backend
│   ├── Controllers/            # API Controllers
│   ├── Services/               # Business logic
│   ├── Models/                 # Data models
│   ├── Program.cs              # App entry point
│   └── ...
│
└── basic-task-ui/              # React + TypeScript frontend
├── src/
│   ├── components/         # UI components
│   ├── App.tsx             # Main app file
│   ├── main.tsx            # Entry file
│   └── ...
├── package.json
├── vite.config.ts
└── ...

```

---

## Backend Setup (.NET 8 API)

### 1. Prerequisites
- .NET SDK 8.0+
- PowerShell or bash terminal

### 2. Run the backend server
```

cd basic-task-api
dotnet restore
dotnet run

```

The server starts (by default) on:
```

[http://localhost:5002](http://localhost:5002)
[https://localhost:7011](https://localhost:7011)

```

---

## API Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Add a new task |
| PUT | /api/tasks/{id} | Update or toggle a task |
| DELETE | /api/tasks/{id} | Delete a task |

**Example – Create Task**
```

POST /api/tasks
Content-Type: application/json

{
"title": "Buy groceries",
"isCompleted": false
}

```

**Example – Toggle Task**
```

PUT /api/tasks/1

```

**Example – Delete Task**
```

DELETE /api/tasks/1

```

---

## Frontend Setup (React + TypeScript)

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Install dependencies
```

cd basic-task-ui
npm install

```

### 3. Environment variables
Create a `.env` file inside `basic-task-ui/`:
```

VITE_API_BASE=[http://localhost:5002/api](http://localhost:5002/api)

```

### 4. Run the frontend
```

npm run dev

```
Then open:  
http://localhost:5173

### 5. Build for production
```

npm run build

```

---

## Development Workflow

1. Start backend:
```

cd basic-task-api
dotnet run

```
2. Start frontend:
```

cd basic-task-ui
npm run dev

````
3. Open http://localhost:5173  
4. Add, toggle, and delete tasks — all updates sync instantly.

---

## Notes

- Data is stored in-memory; resets when backend restarts.  
- Frontend reads API base URL from `.env`.  
- Designed for local testing.

---

## Example Usage

1. Launch both servers.  
2. Open http://localhost:5173  
3. Add a new task.  
4. Click a task title to toggle completion.  
5. Click delete (X) to remove it.

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|--------|----------|
| Backend not reachable | Wrong port | Check backend is on port 5002 or update `.env` |
| CORS error | Port mismatch | Add CORS policy for `http://localhost:5173` in Program.cs |
| 500 error | Invalid JSON | Verify POST/PUT request format |
| Blank page | Frontend not running | Run `npm run dev` |

---

## Example CORS Setup in Program.cs

```csharp
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
 options.AddPolicy(name: MyAllowSpecificOrigins,
                   policy =>
                   {
                       policy.WithOrigins("http://localhost:5173")
                             .AllowAnyHeader()
                             .AllowAnyMethod();
                   });
});

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);
````

---

## Example API Response

```
[
  {
    "id": 1,
    "title": "Finish project report",
    "isCompleted": true
  },
  {
    "id": 2,
    "title": "Fix React build errors",
    "isCompleted": false
  }
]
```

---

## Deployment Notes

If deploying later (Render, Vercel, etc.):

* Host `.NET API` separately.
* Update `.env`:

  ```
  VITE_API_BASE=https://your-api-domain.com/api
  ```
* Rebuild frontend:

  ```
  npm run build
  ```
* Deploy `dist/` folder to any static host.

---

## License

MIT License — free to use, modify, or extend.

---

## Author

Adi Dhawan

```

---

