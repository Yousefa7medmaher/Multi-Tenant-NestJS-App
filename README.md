## Clean Architecture

This project follows a clean architecture:

- **Controller**: Handles HTTP requests and responses, delegates business logic to services.
- **Service**: Contains business logic, interacts with repositories only.
- **Repository**: Handles direct database operations.

---

## Auth API Endpoints

### Register (Admin/Public)

**POST** `/auth/register`

Request (no tenant header):
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "adminpass"
}
```
Response:
```json
{
  "message": "Admin user registered successfully"
}
```

### Register (Tenant User)

**POST** `/auth/register` with header `tenant: <tenant_schema>`

Request:
```json
{
  "name": "Tenant User",
  "email": "user@tenant.com",
  "password": "userpass",
  "role": "user"
}
```
Response:
```json
{
  "message": "Tenant user registered successfully"
}
```

### Login (Admin/Public)

**POST** `/auth/login`

Request (no tenant header):
```json
{
  "email": "admin@example.com",
  "password": "adminpass"
}
```
Response:
```json
{
  "message": "Login successful (admin)",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Login (Tenant User)

**POST** `/auth/login` with header `tenant: <tenant_schema>`

Request:
```json
{
  "email": "user@tenant.com",
  "password": "userpass"
}
```
Response:
```json
{
  "message": "Login successful (tenant)",
  "user": {
    "id": 1,
    "name": "Tenant User",
    "email": "user@tenant.com",
    "role": "user"
  }
}
```

---

**Note:**
- If a tenant header is provided, registration and login are performed in the tenant schema.
- If no tenant header, registration and login are performed in the public schema as an admin.
