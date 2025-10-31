# PM App — Project & Task Manager (Fullstack)

This is a fullstack project management tool built with **ASP.NET Core 8** for the backend and **React + Vite** for the frontend.  
It lets users register, log in, create projects, manage tasks, and auto-schedule dependencies via a simple AI-like scheduler.

---

## 🚀 Features

✅ User authentication with JWT  
✅ Create, edit, delete projects  
✅ Add, update, toggle, and remove tasks  
✅ Scheduler endpoint that orders tasks using dependency analysis  
✅ SQLite database for lightweight persistence  
✅ Self-contained test script (`test-all.sh`) for backend verification  
✅ Frontend UI with automatic proxy to backend  
✅ Optional debug panel for network logs

---

## 🧩 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Backend** | ASP.NET Core 8, Entity Framework Core, SQLite |
| **Frontend** | React (Vite), Axios |
| **Auth** | JWT-based authentication |
| **Styling** | Plain CSS (in `src/styles.css`) |
| **Data** | SQLite (`pm.db`) |

---

## 🛠️ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/pm-app.git
cd pm-api
2. Backend setup
Prerequisites
.NET SDK 8.x or newer

SQLite3 (optional, for CLI inspection)

Run locally
bash
Copy code
cd pm-api
export JWT_SECRET="$(openssl rand -base64 32)"
dotnet build
dotnet run --urls "http://localhost:5002;https://localhost:7011"
If you see:

nginx
Copy code
Now listening on: http://localhost:5002
Now listening on: https://localhost:7011
your backend is running fine.

3. Database
SQLite file (pm.db) will be auto-created.
To reset: delete it and rerun the app.
Inspect with:

bash
Copy code
sqlite3 pm.db "SELECT * FROM Users;"
4. Frontend setup
bash
Copy code
cd pm-ui
npm install
npm run dev
Vite runs at http://localhost:5173.

5. Proxy setup
In pm-ui/vite.config.js:

js
Copy code
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7011',
        secure: false,
        changeOrigin: true
      }
    }
  }
}
⚡ Test Backend Endpoints
bash
Copy code
chmod +x test-all.sh
./test-all.sh
Expected outputs:
✅ Register/Login
✅ Project CRUD
✅ Task CRUD
✅ Scheduler output

Example:

json
Copy code
{
  "recommendedOrder": ["Design API", "Implement Backend", "Build Frontend", "E2E Test"]
}
🎨 UI Overview
Frontend has:

Auth forms

Project & Task views

Scheduler panel (WIP)

Debug toggle for logs

🧰 File Structure (Backend)
pgsql
Copy code
pm-api/
├── Controllers/
├── Data/
├── DTOs/
├── Models/
├── Services/
├── appsettings.json
└── Program.cs
🧭 Common Fixes
HTTPS warning → “Advanced → Proceed”

Port in use → change to 5003/7012

JWT missing → export JWT_SECRET before running

Styling broken → check src/styles.css

🧪 Manual API Testing
Register

bash
Copy code
curl -k -X POST https://localhost:7011/api/Auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123","fullName":"Test User"}'
Login

bash
Copy code
curl -k -X POST https://localhost:7011/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'
Projects

bash
Copy code
curl -k -H "Authorization: Bearer <TOKEN>" https://localhost:7011/api/Projects
🧠 Scheduler Payload Example
payload.json

json
Copy code
{
  "tasks": [
    { "title": "Design API", "estimatedHours": 5 },
    { "title": "Implement Backend", "dependencies": ["Design API"] }
  ]
}
Run:

bash
Copy code
curl -k -X POST "https://localhost:7011/api/Projects/1/Schedule" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d @payload.json | jq .
💡 Notes
Works offline

No external DB

Designed for demo and prototyping

📄 License
MIT — free to use, modify, and build on.
