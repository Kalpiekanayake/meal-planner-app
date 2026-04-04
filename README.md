# 🍽️ Meal Planner App

A full-stack web application designed to simplify meal planning, manage ingredients, and generate smart shopping lists.

---

## 🚀 Overview

Planning meals daily can be repetitive and time-consuming.  
This application helps users organize their weekly meals, track available ingredients, and automatically generate shopping lists.

---

## ⚙️ Tech Stack

- Frontend: React + Vite  
- Backend: Go (net/http)  
- Database: PostgreSQL (Neon - serverless)  
- ORM: Prisma (Go client)  
- Deployment: WSO2 Developer Platform (formerly Choreo)  

---

## ✨ Features

- Weekly meal planning  
- Ingredient (pantry) management  
- Smart shopping list generation  
- User authentication (JWT-based)  
- Cloud deployment (frontend + backend + database)  

---

## 🏗️ Project Structure

```
meal-planner-app/
│
├── frontend/        # React frontend
├── backend/         # Go backend
├── backend/openapi.yaml
├── frontend/dist/   # Built frontend (used for deployment)
└── README.md
```

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Kalpiekanayake/meal-planner-app.git
cd meal-planner-app
```

---

### 2. Backend Setup

```bash
cd backend
go run cmd/api/main.go
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---


## ☁️ Deployment

The application is deployed using:

- WSO2 Developer Platform (formerly Choreo) for frontend and backend services  
- Neon for hosting the PostgreSQL database  

---

## 📸 Screenshots

### Weekly meal planner interface
<img width="1032" height="600" alt="image" src="https://github.com/user-attachments/assets/1a72a595-9c7d-44a7-b48f-561bb3b65415" />


### Pantry Management
<img width="1021" height="599" alt="image" src="https://github.com/user-attachments/assets/1ffc94aa-6de2-4515-a4e0-58b770d0e074" />


### Deployment (Choreo)
<img width="1356" height="529" alt="image" src="https://github.com/user-attachments/assets/b9db1d2f-e49b-4050-8ed9-3382d118c7f4" />

---

## 🧠 Key Learnings

- Designing systems based on real-world problems  
- Building clean backend architecture (handlers, services, repositories)  
- Managing full-stack applications  
- Handling deployment challenges in cloud environments  
- Understanding production-level system behavior  

---

## 🔗 Related Article

👉 https://medium.com/@ekanayake.emkn/how-i-built-a-smart-meal-planner-app-with-go-react-and-choreo-f33aad676703

---

## 📌 Future Improvements

- Mobile responsiveness improvements  
- Advanced meal recommendations  
- Notification system enhancements  

---
