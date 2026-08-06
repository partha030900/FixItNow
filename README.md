# FixItNow Backend

FixItNow is a home service booking platform where customers can book technicians for various services such as electrical work, plumbing, cleaning, and more. The system supports authentication, bookings, payments, reviews, and an admin panel.

## Live API

Vercel Deployment:
https://fixitnow-mauve.vercel.app/

## GitHub Repository

https://github.com/partha030900/FixItNow.git

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Stripe Payment
- Vercel

## Features

### Authentication
- Register
- Login
- JWT Authentication
- Role-based authorization

### Customer
- Browse services
- Book technicians
- Make payments
- Leave reviews
- View booking history

### Technician
- Update profile
- Manage availability
- Create services
- Accept/Decline bookings
- Update booking status

### Admin
- Manage users
- Manage categories
- View all bookings

## API Base URL

```
https://fixitnow-mauve.vercel.app/
```

## Installation


Create a `.env` file and add:

```env
DATABASE_URL=postgres://2918a4bd1ca79fce9b431dc4b72066d9fc1b5911011f97f5dadfe9bd97bb6e04:sk_ic95ztuJo4v4XDg-axTzg@pooled.db.prisma.io:5432/postgres?sslmode=require

PORT=3000

APP_URL=https://fixitnow-mauve.vercel.app/

JWT_ACCESS_SECRET= my_access_secret

JWT_REFRESH_SECRET= my_refresh_secret

JWT_ACCESS_EXPIRES_IN=1d

JWT_REFRESH_EXPIRES_IN=15d

BCRYPT_SALT_ROUNDS=10

STRIPE_SECRET_KEY= *******

STRIPE_WEBHOOK_SECRET= ********

ADMIN_EMAIL=

ADMIN_PASSWORD=
```

Run the project

```bash
npm run dev
```

Build

```bash
npm run build
```

Production

```bash
npm start
```

## API Endpoints

### Authentication

- POST /api/auth/register
- POST /api/auth/login

### Categories

- GET /api/categories
- POST /api/categories

### Technicians

- GET /api/technicians
- PATCH /api/technicians/profile

### Services

- POST /api/services
- GET /api/services

### Bookings

- POST /api/bookings
- GET /api/bookings
- PATCH /api/bookings/:id/status

### Payments

- POST /api/payments/create
- GET /api/payments

### Reviews

- POST /api/reviews

### Admin

- GET /api/admin/users
- PATCH /api/admin/users/:id
- GET /api/admin/bookings

## Author

Partha Chowdhury
