# 🧠 Mini Education App

A small mobile learning app where users play a safety-identification game and track their progress through a backend API.

---

# 📱 Features

## 🎮 Learn Screen

- Displays an unsafe scenario image
- User selects the correct safety issue from multiple choices
- Immediate visual feedback (correct / incorrect)
- Tracks attempts, correct answers, and time spent

## 📊 Earn Screen

- Fetches real data from backend
- Displays:
  - Total games played
  - Total correct answers
  - Total attempts
  - Average score
  - Total time spent

---

# 🚀 Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Coding4Fun44/Mini-Education-App
cd mini-education-app
```

## 2️⃣ Backend Setup

Navigate to backend folder:

```bash
cd backend
npm install
node server.js
```

Server will run at:

http://localhost:3000

## 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd mini-education-app
npm install
npx expo start
```

---

# 🏗 Tech Choices

## 📱 Frontend

- Expo (React Native):
  - Fast setup
  - No native configuration required
  - Ideal for MVP development

- Expo Router:
  - File-based routing
  - Clean screen structure

- React Hooks:
  - Simple state management
  - No need for Redux for MVP scope

## 🖥 Backend

- Node.js + Express:
  - Lightweight REST API
  - Simple routing structure

- SQLite (better-sqlite3):
  - Zero configuration
  - Local embedded database
  - Perfect for small-scale apps

SQLite was chosen over Postgres/Mongo to reduce setup complexity and keep the project self-contained.

## 🧩 API Endpoints

- POST /sessions
  Creates a new game session.

- PUT /sessions/:id
  Updates session after game completes.

- GET /stats
  Returns aggregated statistics:

{
"totalGames": number,
"totalCorrectAnswers": number,
"totalAttempts": number,
"averageScore": number,
"totalDuration": number
}

---

# 🎯 Product & Engineering Decisions

## ✅ What Was Simplified (MVP Focus)

- No authentication
- No user accounts
- No persistent question storage in DB (hardcoded questions)
- No advanced animations
- No offline sync
- Backend kept in a single file

These decisions were intentional to focus on:

- Core gameplay loop
- Clean API design
- Clear state management
- Working end-to-end functionality

# 🚀 Improvements With More Time

- Add user authentication
- Store questions in database
- Add question randomization
- Add progress indicator (e.g., 2/5)
- Add animations for answer feedback
- Add loading & error UI states polish
- Add Docker support
- Improve UI/UX polish and accessibility
