# 🚚 Logistics – Full-Stack Courier Management System

A full-stack logistics management platform built with **React + Node.js + MongoDB**.

The system allows users to create shipment orders, track deliveries, calculate tariffs, and manage logistics operations with role-based access control.

---

## 🏗 Tech Stack

### Frontend
- ⚛ React + Vite
- 🎨 SCSS
- 📄 PDF waybill generation
- 🌍 Environment-based API configuration

### Backend
- 🟢 Node.js + Express
- 🍃 MongoDB
- 🔐 JWT Authentication
- 📧 OTP Email Verification
- 🛡 Role-Based Access Control (User / Admin)

---

## ✨ Features

### 👤 User
- Signup with OTP email verification
- Login with JWT authentication
- Create shipment orders
- Dynamic tariff & extra-service pricing
- Track order by order number
- Generate shipment PDF

### 🛠 Admin
- Secure admin login
- View all orders
- Update shipment status
- Order lifecycle management

---

## 🔐 Authentication Flow

1. User registers
2. OTP sent via email
3. Account verified
4. JWT token issued
5. Protected routes via middleware

---

## ⚙️ Environment Setup

### Backend (`Backend/.env`)

Create a `.env` file inside `Backend`:

MONGODB_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
ADMIN_ORDER_EMAIL=

yaml
Копировать код

---

### Frontend (`PCU/.env`)

Create a `.env` file inside `PCU`:

VITE_API_BASE_URL=http://localhost:5000

yaml
Копировать код

---

## 🖥 Local Development

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Iliyas128/logistics.git
cd logistics
2️⃣ Start Backend
bash
Копировать код
cd Backend
npm install
npm run dev
Backend runs at:

arduino
Копировать код
http://localhost:5000
3️⃣ Start Frontend
bash
Копировать код
cd PCU
npm install
npm run dev
Frontend runs at:

arduino
Копировать код
http://localhost:5173
📁 Project Structure
arduino
Копировать код
logistics/
│
├── Backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
├── PCU/
│   ├── src/
│   ├── public/
│   └── vite.config.js
🧠 Engineering Highlights
Clean separation of concerns (routes / controllers / middleware)

Environment-based configuration

Production-oriented API structure

Business logic isolation (tariff calculation utilities)

Secure authentication patterns

🔮 Future Improvements
Docker containerization

CI/CD pipeline

Health check endpoint

Structured logging

Load testing

Automated testing

📄 License
Educational / Demonstration project
