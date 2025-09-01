🚗 Vehicle Rental Booking System

A full-stack web application for renting vehicles (cars and bikes).
It allows users to make bookings through a step-by-step form with live validation and backend integration.


---

✨ Features

Multi-step booking flow (Name → Wheels → Vehicle Type → Model → Dates → Review → Submit)

Vehicle types and models fetched dynamically from the database

Prevents double-booking using date validation

TailwindCSS design with progress bar and clean UI

Backend powered by Sequelize ORM (migrations + seeders)

SQL schema and seeds included



---

🛠 Tech Stack

Frontend: React + TailwindCSS

Backend: Node.js, Express, Sequelize

Database: SQL (with migrations & seeders)



---

⚙️ How to Run the Project

1️⃣ Clone the Repository

git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

2️⃣ Setup Backend

cd backend
npm install
npx sequelize db:migrate
npx sequelize db:seed:all
npm start

3️⃣ Setup Frontend

cd frontend
npm install
npm start


---

📂 Project Structure

backend/   → Node.js backend (server.js, config, migrations, models, seeders)
frontend/  → React frontend (App.jsx, index.js, Tailwind setup)
database/  → Schema + seed SQL files
.gitignore → Ignore node_modules, build outputs, env files
README.md  → Project documentation


---

👨‍💻 Author

Shreyash Pramod Desai

