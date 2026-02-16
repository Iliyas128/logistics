# 🚚 Logistics — Full-Stack Courier Management System

Full-stack logistics/courier management web app built with **React (Vite)**, **Node.js (Express)** and **MongoDB**.

Users can sign up with **OTP email verification**, create shipment orders with **tariff + extra service pricing**, track shipments by order number, and generate a **PDF waybill**. Admins can manage and update order statuses.

---

## 🏗 Tech Stack

### Frontend
- React + Vite
- SCSS
- PDF waybill generation
- Environment-based API configuration (`VITE_API_BASE_URL`)

### Backend
- Node.js + Express
- MongoDB
- JWT Authentication
- OTP Email Verification
- Role-Based Access Control (User/Admin)

---

## ✨ Features

### 👤 User
- Signup with OTP email verification
- Login with JWT authentication
- Create shipment orders
- Tariff & extra-service pricing logic
- Track shipment by order number
- Generate PDF waybill

### 🛠 Admin
- Admin login
- View all orders
- Update order status / manage lifecycle

---

## ⚙️ Environment Setup

### Backend (`Backend/.env`)
Create `Backend/.env` (do **NOT** commit it). Use `Backend/.env.example` as a template:

```env
MONGODB_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
ADMIN_ORDER_EMAIL=
Frontend (PCU/.env)
Create PCU/.env (do NOT commit it). Use PCU/.env.example as a template:

env
Копировать код
VITE_API_BASE_URL=http://localhost:5000
▶️ Run Locally
1) Clone
bash
Копировать код
git clone https://github.com/Iliyas128/logistics.git
cd logistics
2) Start Backend
bash
Копировать код
cd Backend
npm install
npm run dev
Backend runs at:

http://localhost:5000

3) Start Frontend
bash
Копировать код
cd ../PCU
npm install
npm run dev
Frontend runs at:

http://localhost:5173

📁 Project Structure
text
Копировать код
logistics/
├─ Backend/
│  ├─ controllers/
│  ├─ routes/
│  ├─ models/
│  ├─ middleware/
│  ├─ utils/
│  └─ server.js
└─ PCU/
   ├─ src/
   ├─ public/
   └─ vite.config.js
🧠 Engineering Highlights
Clean separation of concerns (routes / controllers / middleware)

Environment-based configuration (ready for deployment)

Business logic isolation (tariff calculation utilities)

Secure authentication patterns (OTP + JWT)

Admin workflow for order lifecycle management

🔮 Future Improvements
CI/CD pipeline (GitHub Actions)

Health checks (/health, /ready)

Structured logging & metrics

Tests (unit/integration)

Docker deployment

📄 License
Educational / Demonstration project

yaml
Копировать код

---

## ✅ Ещё 2 файла, которые нужно добавить (чтобы было идеально)

### 1) `Backend/.env.example`
```env
MONGODB_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
ADMIN_ORDER_EMAIL=
2) PCU/.env.example
env
Копировать код
VITE_API_BASE_URL=http://localhost:5000
И убедись, что .env НЕ коммитится (обычно в .gitignore уже есть):

Backend/.env

PCU/.env
