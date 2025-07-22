# 🧠 CyberTask – AI-Powered Todo & Task Collaboration App

CyberTask is a full-stack, real-time Todo Management Web Application built for productivity, collaboration, and smart task prioritization using AI.

> 🚧 **Live Demo**: Coming Soon  
> 📽 **Loom Demo Video**: Will be shown during the interview  
> 📦 **Backend API**: In progress  
> 🔗 **GitHub Repo**: [https://github.com/Kishore-86/to-do-app](https://github.com/Kishore-86/to-do-app)

---

## 🔥 Features (Planned & In Progress)

- [x] Google Login (OAuth 2.0)
- [x] Create/Edit/Delete Tasks (CRUD)
- [ ] Share Tasks with Email/Username
- [ ] Real-time Updates using Socket.IO
- [ ] AI-Based Task Priority Suggestions (OpenAI API)
- [ ] Gamification (XP bar, badges)
- [ ] Responsive UI (Mobile + Desktop)
- [ ] Dark/Light Theme Toggle
- [ ] Task Filtering: Priority, Status, Due Today, Overdue
- [x] Toast Notifications (planned)
- [ ] Offline Support
- [x] Modular, Scalable Code Structure

---

## 🧱 Tech Stack

| Frontend     | Backend           | Realtime   | Auth         | Database       | Deployment       |
|--------------|--------------------|------------|--------------|----------------|------------------|
| React + Vite | Node.js + Express  | Socket.IO  | Google OAuth + JWT | MongoDB Atlas  | Vercel + Render  |
| Tailwind CSS | RESTful API        |            | Passport.js  | Mongoose       |                  |

---

## 🗂️ Folder Structure

/to-do-app
├── backend
│ ├── routes/
│ ├── models/
│ ├── controllers/
│ └── server.js
├── frontend
│ └── (under development)
└── README.md


---

## 📌 Assumptions

- User sharing works via username/email lookup.
- Real-time updates will use Socket.IO with client-server sync.
- AI-based suggestions powered by OpenAI (task analysis).
- Auth via Google using Passport.js or Firebase OAuth.

---

## 🖼️ Architecture (Planned)

**Frontend (React + Vite)** ⟶ **Backend (Express API)** ⟶ **MongoDB Atlas**  
⟶ [Planned: Socket.IO Realtime Layer + OpenAI Integration]

*(Architecture diagram will be explained in interview)*

---

## 📽️ Demo (WIP)

A short Loom video will be added post-submission. For now, I will walk through the code and explain everything during the interview.

---

## 🧠 AI Tools Used

- ChatGPT (used for planning routes, UI ideas, and code architecture)
- Figma (UI Wireframes - optional)
- Postman (for backend API testing)

---

## 📌 Note

This project is a part of a hackathon run by [Katomaran](https://www.katomaran.com)

---

## 🙏 Special Thanks

Thanks to the Katomaran team for this opportunity to build and showcase full-stack engineering + AI skills.
