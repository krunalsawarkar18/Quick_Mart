👤 Author

Krunal Sawarkar

Email: [krunalsawarkar2004@gmail.com]
# Quick Market

Quick Market is a full-stack grocery ecommerce platform built to demonstrate production-minded MERN engineering, polished frontend execution, and admin-focused business workflows in a single portfolio project.

It combines a responsive customer storefront with a role-based admin workspace for catalog control, order operations, customer visibility, and delivery-status management.

Detailed project documentation: [docs/PROJECT_DOCUMENTATION.md](./docs/PROJECT_DOCUMENTATION.md)

## Why This Project Stands Out

- Full-stack architecture with separate React/Vite frontend and Express/MongoDB backend
- Role-based experience for both customers and admins
- Modern grocery-style storefront with responsive UI and mobile-specific refinements
- Product catalog, search, categories, cart, checkout, address book, and order history
- Admin dashboard for products, categories, orders, customer visibility, and fulfillment flow
- Stripe checkout integration alongside Cash on Delivery
- JWT authentication and protected routes across customer and admin areas
- Order lifecycle tracking from pending to delivered

## Core Features

### Customer Experience

- Browse products by category and search query
- View rich product details and similar-product suggestions
- Add items to cart and manage quantities
- Save, edit, and remove delivery addresses
- Place orders with Cash on Delivery or Stripe
- Track delivery progress from the account orders page
- Cancel eligible orders before dispatch completion

### Admin Experience

- Secure admin login and gated admin registration flow
- Create, edit, and delete products
- Create, edit, and delete categories
- View customer order details, delivery addresses, and item-level order summaries
- Update order delivery status from the admin panel
- Monitor customers, order volume, revenue, and operational metrics
- Review recent customer orders directly from the admin dashboard

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Lucide React

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- Stripe

## Architecture

```text
frontend/   -> React + Vite client application
backend/    -> Express API, MongoDB models, auth, cart, order, admin routes
```

## Security Notes

- Secrets are loaded through environment variables and are not meant to be committed
- `.env` files, logs, build outputs, and dependency folders should stay ignored
- `README.md` intentionally avoids publishing live secrets or reusable private credentials
- For any deployed version, rotate demo credentials, use strong environment secrets, and add Stripe webhooks before production use

## Local Setup

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment files

Copy the example files and set your own local values:

- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`

### 3. Seed sample data

```bash
cd backend
npm run seed
```

### 4. Start the project

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

## Environment Variables

### Backend

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_SIGNUP_KEY`
- `STRIPE_SECRET_KEY`
- `CLIENT_URL`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `SEED_CUSTOMER_EMAIL`
- `SEED_CUSTOMER_PASSWORD`

### Frontend

- Add the frontend variables you use for local or deployed API access

## Suggested Portfolio Talking Points

- Built a responsive MERN ecommerce application with customer and admin workflows
- Implemented role-based authentication, protected routes, and JWT-backed sessions
- Designed order management flows with delivery-status tracking and admin controls
- Integrated Stripe payment support with a custom checkout flow
- Created a modern mobile-friendly grocery storefront and admin dashboard UX

## Recruiter Keywords

`MERN Stack`, `React`, `Vite`, `Node.js`, `Express`, `MongoDB`, `Mongoose`, `Tailwind CSS`, `JWT Authentication`, `Stripe Integration`, `Admin Dashboard`, `Ecommerce`, `Responsive Design`, `Role-Based Access Control`, `REST API`, `Order Management`, `Full-Stack JavaScript`

## Project Status

This project is portfolio-ready for showcasing:

- full-stack development
- UI polish and responsive design
- CRUD-heavy admin tooling
- ecommerce workflow implementation
- authentication and payment integration

## Important Note

If you publish this repository, keep real environment files private and use your own deployment credentials, database connection strings, and Stripe keys.

The seed script also expects local seed-account credentials from environment variables, so reusable demo passwords do not need to live in the repository.
