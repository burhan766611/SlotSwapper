# SlotSwapper

SlotSwapper is a full stack MERN web application that allows users to create and manage their event slots and swap them with other users.  
It helps users manage schedules easily and handle slot swapping requests in a smooth way.

---

## 🧠 Overview

- Users can register and login securely using JWT authentication.
- Users can add, update, delete and view their events.
- Users can send slot swap requests to other users.
- Other users can accept or reject swap requests.
- The app uses MongoDB for data storage and cookies for authentication.
- Frontend is made using React + GSAP for animations, and backend is built using Node.js + Express.

---

## ⚙️ Tech Stack

**Frontend:** React, Vite, TailwindCSS, GSAP  
**Backend:** Node.js, Express.js, MongoDB, JWT, Cookie-Parser  
**Database:** MongoDB Atlas  
**Deployment:** Netlify (Frontend), Render (Backend)

---

## 🧩 Project Structure

SlotSwapper/
│
├── backend/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── index.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ ├── components/
│ ├── pages/
│ ├── App.jsx
│ └── package.json
│
├── README.md
└── .gitignore


## 🚀 How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/slotswapper.git
cd slotswapper

| Method | Endpoint                 | Description                   | Auth |
| :----: | :----------------------- | :---------------------------- | :--: |
|  POST  | `/api/auth/register`     | Register new user             |   ❌  |
|  POST  | `/api/auth/login`        | Login user and set cookie     |   ❌  |
|  POST  | `/api/auth/logout`       | Logout user and clear cookie  |   ✅  |
|   GET  | `/api/auth/me`           | Get logged-in user info       |   ✅  |
|   GET  | `/api/events`            | Get all events                |   ✅  |
|  POST  | `/api/events`            | Create a new event            |   ✅  |
|   PUT  | `/api/events/:id`        | Update event by ID            |   ✅  |
| DELETE | `/api/events/:id`        | Delete event by ID            |   ✅  |
|  POST  | `/api/swaps`             | Send a swap request           |   ✅  |
|   GET  | `/api/swaps`             | Get all swap requests         |   ✅  |
|  POST  | `/api/swap-response/:id` | Accept or reject swap request |   ✅  |
