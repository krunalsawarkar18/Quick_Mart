# Quick Market Project Documentation

## 1. Executive Summary

Quick Market is a full-stack grocery ecommerce platform designed to showcase a complete customer shopping flow and an operational admin workspace in one project.

The platform supports:

- customer product discovery and shopping
- account creation and authentication
- cart, address, checkout, and order workflows
- admin-side catalog management
- admin-side order operations and delivery-status updates
- Stripe checkout support alongside Cash on Delivery

This project was built as a portfolio-grade product that demonstrates both frontend polish and backend business logic, with a structure that can be extended into a production-ready system.

## 2. Business Goal

The goal of Quick Market is to simulate a modern grocery storefront where customers can order daily essentials quickly, while administrators can manage inventory and fulfillment from a dedicated control panel.

From an engineering perspective, the project demonstrates:

- full-stack application architecture
- role-based access control
- REST API design
- data modeling with MongoDB
- modern React UI development
- order and delivery lifecycle handling
- secure environment-variable based configuration

## 3. Product Scope

### Customer Scope

- browse featured and category-based products
- search the catalog
- view product details
- add products to cart
- manage address book
- place orders
- view and track order status
- cancel eligible orders

### Admin Scope

- access a dedicated admin area
- create, edit, and remove products
- create, edit, and remove categories
- review customer orders
- inspect customer and delivery details
- update delivery status
- view operational metrics and recent orders

## 4. Tech Stack

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
- JWT
- Stripe SDK

## 5. High-Level Architecture

```text
Customer/Admin Browser
        |
        v
 React + Vite Frontend
        |
        v
 Express REST API
        |
        v
 MongoDB Database
```

### Frontend Responsibilities

- routing and role-aware navigation
- UI rendering for customer and admin flows
- local session persistence
- cart and checkout interaction
- order-status presentation

### Backend Responsibilities

- authentication and authorization
- catalog and category CRUD
- cart storage and synchronization
- address and order persistence
- admin operations
- payment-session creation

## 6. Repository Structure

```text
backend/
  src/
    config/
    middleware/
    models/
    routes/
    seeds/
    utils/

frontend/
  src/
    api/
    components/
    context/
    pages/
    utils/

docs/
  PROJECT_DOCUMENTATION.md
```

## 7. Key Functional Modules

### 7.1 Authentication

The platform uses JWT-based authentication for both customers and admins.

Key capabilities:

- customer login and registration
- admin login and gated admin registration
- protected customer account routes
- protected admin-only routes

Relevant backend area:

- `backend/src/routes/authRoutes.js`

Relevant frontend area:

- `frontend/src/context/AuthContext.jsx`
- `frontend/src/components/ProtectedRoute.jsx`

### 7.2 Product Catalog

The catalog supports product browsing, category filtering, search, featured products, and detailed product views.

Key capabilities:

- category-based browsing
- search-driven filtering
- rich product cards and product details page
- similar-product suggestions on product details

Relevant backend area:

- `backend/src/routes/productRoutes.js`
- `backend/src/routes/categoryRoutes.js`

Relevant frontend area:

- `frontend/src/pages/HomePage.jsx`
- `frontend/src/pages/ProductsPage.jsx`
- `frontend/src/pages/ProductDetailsPage.jsx`

### 7.3 Cart and Checkout

The cart supports guest-style local persistence and authenticated synchronization. Checkout supports address selection, order placement, and payment-method selection.

Key capabilities:

- cart quantity updates
- address management before checkout
- COD flow
- Stripe checkout redirect flow

Relevant backend area:

- `backend/src/routes/cartRoutes.js`
- `backend/src/routes/addressRoutes.js`
- `backend/src/routes/orderRoutes.js`

Relevant frontend area:

- `frontend/src/context/CartContext.jsx`
- `frontend/src/pages/CartPage.jsx`
- `frontend/src/pages/CheckoutPage.jsx`

### 7.4 Order Management

Orders move through a delivery lifecycle visible to both customers and admins.

Supported statuses:

- `Pending`
- `Confirmed`
- `Packed`
- `Out for Delivery`
- `Delivered`
- `Cancelled`

The same order record is used across both customer and admin workflows, so admin-side status updates are reflected in the customer order view.

Relevant backend area:

- `backend/src/routes/orderRoutes.js`
- `backend/src/routes/adminRoutes.js`
- `backend/src/utils/orderHelpers.js`

Relevant frontend area:

- `frontend/src/pages/OrdersPage.jsx`
- `frontend/src/pages/AdminOrdersPage.jsx`
- `frontend/src/utils/orderStatus.js`

### 7.5 Admin Operations

The admin area is designed as an operations workspace rather than a simple CRUD screen.

Key capabilities:

- dashboard metrics
- recent-order visibility
- product and category management
- customer order detail visibility
- delivery-status control

Relevant frontend area:

- `frontend/src/components/layout/AdminShell.jsx`
- `frontend/src/pages/AdminDashboardPage.jsx`
- `frontend/src/pages/AdminProductsPage.jsx`
- `frontend/src/pages/AdminCategoriesPage.jsx`
- `frontend/src/pages/AdminOrdersPage.jsx`

## 8. Data Model Overview

### User

Stores identity, role, phone, and encrypted password.

### Product

Stores product information including pricing, image, stock, category, and tags.

### Category

Stores category name, description, and slug.

### Cart

Stores user-specific cart line items and quantities.

### Address

Stores customer delivery addresses.

### Order

Stores:

- ordered items
- product snapshot data
- delivery address snapshot
- payment method
- payment status
- order status
- order number
- Stripe session metadata

## 9. UI and UX Decisions

Quick Market was intentionally styled to feel closer to a modern grocery storefront than a basic CRUD app.

Key design choices:

- responsive layout with mobile-specific optimizations
- fixed/stable top navigation
- mobile bottom navigation for easier browsing
- produce-focused imagery and fresher visual language
- dedicated admin workspace styling
- item-level order cards and delivery-status blocks

## 10. Security and Configuration

### Current Protections

- secrets loaded via environment variables
- JWT-based protected API routes
- role-based admin middleware
- `.gitignore` updated to exclude sensitive and local files
- hardcoded seed credentials removed from source control

### Sensitive Data That Must Stay Private

- database connection strings
- JWT secret
- Stripe secret key
- admin signup key
- local `.env` files
- runtime log files

### Seed Credentials

Seeded demo-account credentials are now supplied through environment variables instead of being hardcoded in the repository.

Required seed variables:

- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `SEED_CUSTOMER_EMAIL`
- `SEED_CUSTOMER_PASSWORD`

## 11. Environment Variables

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

Frontend environment configuration depends on deployment and API-access needs.

## 12. Setup and Local Development

### Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Configure Environment

Create local `.env` files from the example files:

- `backend/.env.example`
- `frontend/.env.example`

### Seed Data

```bash
cd backend
npm run seed
```

### Start the Backend

```bash
cd backend
npm run dev
```

### Start the Frontend

```bash
cd frontend
npm run dev
```

## 13. Major Enhancements Completed

The project includes a substantial set of enhancements completed during development:

- expanded seeded product catalog across all major categories
- redesigned storefront UI with a more modern grocery look
- mobile-only responsive improvements without disturbing desktop layout
- dedicated admin authentication pages
- customer address edit and remove support inside checkout
- customer order cancellation support
- Stripe checkout integration
- richer order cards with product images and clickable product links
- admin visibility into customer order details and delivery addresses
- delivery-status presentation for both customer and admin experiences
- dashboard-level visibility into recent orders

## 14. Known Limitations

This project is strong for portfolio and demo use, but a few areas should be upgraded before production deployment:

- Stripe fulfillment currently benefits from stronger webhook-based completion handling
- Stripe refund handling should be added for admin/customer cancellation of paid card orders
- broader automated test coverage can still be added
- deployment documentation can be expanded further for production environments

## 15. Recommended Next Steps

- add Stripe webhooks for production-safe payment fulfillment
- add refund support for paid Stripe order cancellations
- introduce automated integration and end-to-end tests
- add image upload/storage instead of external image URLs only
- add inventory analytics and reporting
- add coupon and promotion support
- add email or SMS notifications for status changes

## 16. Portfolio Value

Quick Market is a strong showcase project for:

- full-stack JavaScript development
- admin workflow design
- ecommerce domain modeling
- responsive frontend engineering
- authentication and authorization
- payment integration
- operational dashboard design

## 17. Ownership Notes

This documentation is intended to help:

- recruiters understand the scope quickly
- interviewers evaluate engineering depth
- collaborators onboard faster
- future maintainers understand the current system shape

If this project continues, this document should evolve alongside new features, deployment practices, and architecture changes.
