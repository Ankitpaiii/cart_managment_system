# Online Shopping System

A modern, full-stack e-commerce web application built with Next.js, Express.js, Prisma, and PostgreSQL. Features a minimal, elegant, collection-style UI inspired by premium e-commerce sites.

## 🎯 Project Overview

This is an academic team project demonstrating:
- Full-stack web development
- RESTful API architecture
- Database design following ER diagrams
- Modern frontend with React/Next.js
- Type-safe development with TypeScript

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: 
  - Zustand (cart, auth)
  - TanStack Query (server state)
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Security**: Helmet, CORS

## 📁 Project Structure

```
Portfolio/
├── frontend/           # Next.js application
│   ├── app/           # App router pages
│   ├── components/    # React components
│   ├── lib/           # Utilities, stores, API
│   └── public/        # Static assets
│
├── backend/           # Express.js API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, error handling
│   │   └── utils/        # Prisma, JWT utilities
│   └── prisma/
│       └── schema.prisma # Database schema
│
├── tech_stack.md         # Technology decisions
├── implementation_plan.md # Development roadmap
└── design_doc.md         # UI/UX specifications
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database

### 1. Clone and Install

```bash
cd Portfolio

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/online_shopping_db"
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Set Up Database

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:3000`

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login customer
- `GET /api/auth/profile` - Get profile (protected)

### Products
- `GET /api/products` - Get all products (pagination, filtering)
- `GET /api/products/:id` - Get product by ID

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category with products

### Orders
- `GET /api/orders` - Get customer orders (protected)
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/:id` - Get order details (protected)

### Payments
- `POST /api/payments` - Record payment (protected)
- `GET /api/payments/:orderId` - Get payment (protected)

### Addresses
- `GET /api/addresses` - Get customer addresses (protected)
- `POST /api/addresses` - Create address (protected)
- `PUT /api/addresses/:id` - Update address (protected)
- `DELETE /api/addresses/:id` - Delete address (protected)

## 🎨 Design Philosophy

- **Minimal & Elegant**: Clean layouts with generous spacing
- **Image-Forward**: Product imagery takes center stage
- **Subtle Animations**: Purposeful, not decorative
- **Responsive**: Mobile-first design approach
- **Accessible**: Keyboard navigation and ARIA labels

## 📦 Database Schema

7 core models following the ER diagram:
- **Customer**: User accounts
- **Address**: Customer addresses
- **Category**: Product categories
- **Product**: Product catalog
- **Order**: Customer orders
- **OrderItem**: Order line items
- **Payment**: Payment records

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- CORS configuration
- Security headers with Helmet
- Input validation

## 🧪 Testing

```bash
# Backend (when implemented)
cd backend
npm test

# Frontend (when implemented)
cd frontend
npm test
```

## 📝 Development Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎓 Academic Context

This project demonstrates:
- ER diagram to database implementation
- RESTful API design principles
- Modern web development practices
- Type-safe full-stack development
- State management patterns
- Authentication and authorization

## 👥 Team Collaboration

- Use Git for version control
- Test APIs with Postman
- Review code before merging
- Follow TypeScript best practices
- Maintain clear documentation

## 📄 License

This is an academic project for educational purposes.

---

**Built with ❤️ for learning and demonstration**
