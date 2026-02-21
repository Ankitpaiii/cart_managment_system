# 🛒 Decentralized E-Commerce & Proof-of-Life Authentication System

A modern, full-stack e-commerce web application featuring state-of-the-art **Face Liveness Authentication**. Built with **Next.js**, **Express.js**, **Prisma**, and **PostgreSQL**, this project implements advanced database concepts (Triggers, Cursors) and a premium, responsive UI.

### 🌐 Live Deployment
* **Frontend (Vercel):** [https://cart-managment-system.vercel.app/](https://cart-managment-system.vercel.app/)
* **Backend API (Render):** [https://cart-managment-api.onrender.com/health](https://cart-managment-api.onrender.com/health)

---

## 🎯 High-Level Architecture & Features

### 1. Advanced Security & Face Liveness
* Replaced traditional passwords with **Face-API.js** biometric authentication.
* Real-time webcam integration for Proof-of-Life verification during Registration and Login.
* High-security verification blocking spoofing and flat-image attacks.

### 2. Advanced Database Concepts (PostgreSQL)
* **Triggers:** Automated stock decrementation upon order placement, preventing negative stock. Custom `log_audit_event()` triggers track all administrative modifications.
* **Stored Procedures & Cursors:** Implemented `get_categories_report()` using SQL Cursors to loop through categories and calculate live aggregate stock values mathematically at the database layer.

### 3. Premium UI/UX Design
* Modern aesthetic using Tailwind CSS & Shadcn/UI.
* Glassmorphism, dynamic animations (Framer Motion), and responsive category cards.
* Skeleton loaders and beautiful Toast notifications for state changes.

---

## 🛠️ Tech Stack

### Frontend Architecture
* **Framework**: Next.js 15 (React 19)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Biometrics**: face-api.js
* **State Management**: Zustand
* **Deployment**: Vercel

### Backend Architecture
* **Runtime**: Node.js
* **Framework**: Express.js
* **Language**: TypeScript
* **Database**: PostgreSQL (Hosted on Render)
* **ORM**: Prisma
* **Authentication**: JWT & Bcrypt (fallback)
* **Deployment**: Render Web Services

---

## 🚀 Running Locally

### Prerequisites
* Node.js v20+
* Local PostgreSQL Database or external Postgres Provider

### 1. Clone & Install
```bash
git clone https://github.com/Ankitpaiii/cart_managment_system.git
cd cart_managment_system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Create `.env` files in both directories.

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/online_shopping_db"
PORT=5002
NODE_ENV=development
JWT_SECRET=super-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5002/api
```

### 3. Setup Database & Seed
```bash
cd backend
# Push the schema to your database
npx prisma db push

# Run the advanced SQL file to add Triggers and Cursors
npx prisma db execute --file prisma/final_cleanup.sql --schema prisma/schema.prisma

# Seed database with sample products
npm run seed
```

### 4. Start Development Servers
**Backend:**
```bash
cd backend
npm run dev
# Server running on http://localhost:5002
```

**Frontend:**
```bash
cd frontend
npm run dev
# App running on http://localhost:3000
```

---

## 📚 API Endpoints

### 🔐 Auth & Verification
* `POST /api/auth/register` - Save face vector & credentials
* `POST /api/auth/verify` - Liveness login via webcam
* `POST /api/auth/login` - Fallback standard login

### 🛒 E-Commerce
* `GET /api/products` - Fetch paginated product catalog
* `GET /api/categories` - Fetch categories with product counts
* `POST /api/orders` - Checkout & triggers DB stock subtraction
* `GET /api/orders` - Customer order history
* `GET /api/admin/dashboard` - Admin analytics via Stored Procedures

---

## 📂 Project Structure
```
cart_management_system/
├── frontend/                     # Next.js Application
│   ├── app/                      # Next.js App Router (Pages)
│   ├── components/ui/            # Reusable Shadcn Components
│   ├── lib/api/                  # Axios Interceptors & Client
│   └── public/models/            # Face-API Machine Learning Models
│
├── backend/                      # Express API
│   ├── prisma/                   # Schema, Seeds, and Raw SQL
│   ├── src/controllers/          # API Logic
│   ├── src/middleware/           # JWT & Error Handling
│   └── src/index.ts              # Server Entry Point
```

---
**Built for modern e-commerce & high-security biometric research.**
