# Pathlock Assignments — Fullstack Projects by Adi Dhawan

This repository contains two assignment projects prepared for Pathlock:

1. Basic-Task-Manager — A simple Task Manager (backend + frontend)
2. Mini-Project-Manager — A Project Manager with Smart Scheduler (backend + frontend)

## Repo structure

Pathlock Assignments/
├── Basic-Task-Manager/
│   ├── basic-task-api/
│   └── basic-task-ui/
└── Mini-Project-Manager/
    ├── mini-project-api/
    └── mini-project-ui/

## Quick start

### Basic Task Manager
Backend:
cd "Basic-Task-Manager"/basic-task-api
dotnet restore
dotnet run

makefile
Copy code
Frontend:
cd "Basic-Task-Manager"/basic-task-ui
npm install
npm run dev

makefile
Copy code

### Mini Project Manager
Backend:
cd "Mini-Project-Manager"/mini-project-api
dotnet restore
dotnet run --urls "http://localhost:5003;https://localhost:7012"

makefile
Copy code
Frontend:
cd "Mini-Project-Manager"/mini-project-ui
npm install
npm run dev

markdown
Copy code

## Notes
* Each project has its own README inside its folder with more detailed instructions.
* Keep secrets and `.env` files local — they are excluded by `.gitignore`.
* Use a GitHub Personal Access Token (PAT) when pushing if asked for a password.

## Author
Adi Dhawan
