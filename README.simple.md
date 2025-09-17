# Multi-Tenant NestJS App

This project is a simple multi-tenant authentication API built with NestJS and TypeORM.

## Features
- Register and login for public (admin) and tenant users
- JWT authentication
- Role-based access (admin, user, manager)
- Dynamic tenant schema support

## Getting Started
1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your database and JWT settings
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the app:
   ```bash
   npm run start:dev
   ```

## API Endpoints
### Register Admin (Public)
`POST /auth/register`
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "adminpass"
}
```

### Register Tenant User
`POST /auth/register` with header `tenant: <tenant_schema>`
```json
{
  "name": "Tenant User",
  "email": "user@tenant.com",
  "password": "userpass",
  "role": "user"
}
```

### Login
`POST /auth/login` (add `tenant` header for tenant user)
```json
{
  "email": "admin@example.com",
  "password": "adminpass"
}
```

## Environment Variables
See `.env.example` for required settings.

## License
MIT
