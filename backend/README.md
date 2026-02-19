# Online Shopping System - Backend

A RESTful API backend for an e-commerce platform built with Node.js, Express, Prisma, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Language**: TypeScript

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/          # API route definitions
│   ├── middleware/      # Auth, error handling
│   ├── utils/           # Prisma client, JWT utilities
│   └── index.ts         # Server entry point
├── prisma/
│   └── schema.prisma    # Database schema
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/online_shopping_db"
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login customer
- `GET /api/auth/profile` - Get customer profile (protected)

### Customers
- `GET /api/customers/:id` - Get customer by ID (protected)
- `PUT /api/customers/:id` - Update customer (protected)

### Addresses
- `GET /api/addresses` - Get all addresses for logged-in customer (protected)
- `POST /api/addresses` - Create new address (protected)
- `PUT /api/addresses/:id` - Update address (protected)
- `DELETE /api/addresses/:id` - Delete address (protected)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products
- `GET /api/products` - Get all products (with pagination, filtering, sorting)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders for logged-in customer (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `POST /api/orders` - Create new order (protected)

### Payments
- `POST /api/payments` - Record payment (protected)
- `GET /api/payments/:orderId` - Get payment by order ID (protected)

## Database Schema

The database follows the ER diagram with these entities:
- Customer (User)
- Address
- Category
- Product
- Order
- OrderItem
- Payment

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Notes

- All protected routes require a Bearer token in the Authorization header
- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 7 days (configurable)
- Product listing supports pagination, category filtering, and sorting
