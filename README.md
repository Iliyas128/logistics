📦 Logistics – Full-Stack Courier Management System
🚀 Overview

Logistics is a full-stack courier management web application designed to handle shipment creation, tariff calculation, order tracking, and administrative order management.

The system simulates a real-world logistics workflow including user authentication with OTP verification, order pricing logic, and role-based access control.

This project demonstrates backend system design, distributed-ready architecture patterns, and production-oriented engineering practices.

🏗 Architecture

Frontend:

React + Vite

SCSS styling

PDF waybill generation

Environment-based API configuration

Backend:

Node.js + Express

MongoDB

JWT authentication

OTP email verification

Role-based access control (User/Admin)

✨ Core Features
👤 User

Signup with OTP email verification

Login with JWT authentication

Create shipment orders

Tariff + extra service pricing logic

Track order by order number

Generate PDF waybill

🛠 Admin

Secure admin login

View all orders

Update shipment status

Order management panel

🔐 Authentication Flow

User registers

OTP sent via email

Account verified

JWT issued upon login

Protected routes via middleware

💰 Business Logic

Dynamic tariff calculation

Extra services pricing (insurance, etc.)

Order number generation

Status updates lifecycle

⚙️ Environment Configuration
Backend (Backend/.env)

Create a .env file inside Backend:

MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
ADMIN_ORDER_EMAIL=optional_admin_email

Frontend (PCU/.env)

Create a .env file inside PCU:

VITE_API_BASE_URL=http://localhost:5000

🖥 Local Development Setup
1️⃣ Clone Repository
git clone https://github.com/Iliyas128/logistics.git
cd logistics

2️⃣ Backend Setup
cd Backend
npm install
npm run dev


Backend runs at:

http://localhost:5000

3️⃣ Frontend Setup
cd PCU
npm install
npm run dev


Frontend runs at:

http://localhost:5173

📁 Project Structure
logistics/
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── PCU/
│   ├── src/
│   ├── public/
│   └── vite.config.js

🧠 Engineering Focus

This project emphasizes:

Separation of concerns (controllers / routes / services)

Environment-based configuration

Secure authentication patterns

Production-ready API structuring

Scalable backend architecture patterns

📌 Future Improvements

Docker deployment

CI/CD pipeline

Health checks endpoint

Logging & metrics

Unit & integration tests

📄 License

For educational and demonstration purposes.
