🍽️ Meal Planner App
A full-stack web application designed to simplify meal planning, manage ingredients, and generate smart shopping lists.

🚀 Overview
Planning meals daily can be repetitive and time-consuming.
This application helps users organize their weekly meals, track available ingredients, and automatically generate shopping lists.

⚙️ Tech Stack
Frontend: React + Vite
Backend: Go (net/http)
Database: PostgreSQL (Neon - serverless)
ORM: Prisma (Go client)
Deployment: WSO2 Developer Platform (formerly Choreo)

✨ Features
Weekly meal planning
Ingredient (pantry) management
Smart shopping list generation
User authentication (JWT-based)
Cloud deployment (frontend + backend + database)

🏗️ Project Structure
meal-planner-app/
│
├── frontend/        # React frontend
├── backend/         # Go backend
├── backend/openapi.yaml
├── frontend/dist/   # Built frontend (used for deployment)
└── README.md

☁️ Deployment
The application is deployed using:
WSO2 Developer Platform (formerly Choreo) for frontend and backend services
Neon for hosting the PostgreSQL database

📸 Screenshots

<img width="1050" height="601" alt="image" src="https://github.com/user-attachments/assets/50dab430-4c00-455d-aaa1-755d2ac28ba9" />
Weekly meal planner interface

<img width="1039" height="538" alt="image" src="https://github.com/user-attachments/assets/b79a3ca0-696e-4ce4-9a82-c7685de6ea50" />
Pantry management system

<img width="1357" height="546" alt="image" src="https://github.com/user-attachments/assets/d194ab21-6566-4a1c-ab4b-e86172db4ddd" />
Choreo deployment dashboard


🧠 Key Learnings
Designing systems based on real-world problems
Building clean backend architecture (handlers, services, repositories)
Managing full-stack applications
Handling deployment challenges in cloud environments
Understanding production-level system behavior

🔗 Related Article
This project is explained in detail in a Medium article:


📌 Future Improvements
Mobile responsiveness improvements
Advanced meal recommendations
Notification system enhancements
