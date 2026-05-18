# Ecommerce-Backend-Englishyaari

A secure, RESTful backend API built for user authentication, product management, order processing, and analytics. Authentication is handled via **JWT Bearer tokens** and endpoints are protected by role-based access control.

**Base URL (Development):** `http://localhost:5000/api`

---

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Products](#products)
- [Orders](#orders)
- [Analytics](#analytics)
- [Data Models](#data-models)
- [Error Handling](#error-handling)

---

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

### Endpoints

#### `POST /auth/register`

Register a new user account.

**Request Body:**

```json
{
  "name": "Aman",
  "email": "aman@test.com",
  "password": "password123",
  "role": "user"
}
```

| Field      | Type   | Required | Description                     |
|------------|--------|----------|---------------------------------|
| `name`     | string | ✅        | Full name of the user           |
| `email`    | string | ✅        | Valid email address             |
| `password` | string | ✅        | Account password                |
| `role`     | string | ✅        | `"admin"` or `"user"`           |

**Responses:**

| Status | Description                              |
|--------|------------------------------------------|
| `201`  | User registered successfully             |
| `400`  | Validation error or user already exists  |

---

#### `POST /auth/login`

Authenticate an existing user and receive a JWT token.

**Request Body:**

```json
{
  "email": "aman@test.com",
  "password": "password123"
}
```

**Responses:**

| Status | Description                           |
|--------|---------------------------------------|
| `200`  | Login successful, returns token       |
| `400`  | Invalid credentials or validation error |

**Success Response Example:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1c3dfb5c4c9b1f8a3e123",
    "name": "Aman",
    "email": "aman@test.com",
    "role": "user"
  }
}
```

---

#### `GET /auth/me` 🔒

Get the currently authenticated user's profile.

**Responses:**

| Status | Description               |
|--------|---------------------------|
| `200`  | Returns current user info |
| `401`  | Unauthorized              |

---

## Users

> Most user management endpoints are **admin-only**.

#### `GET /users` 🔒 *(Admin only)*

Retrieve a list of all registered users.

**Responses:**

| Status | Description        |
|--------|--------------------|
| `200`  | List of all users  |
| `403`  | Forbidden          |

---

#### `GET /users/{id}` 🔒

Retrieve a single user by their ID.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | ✅        | User ID     |

**Responses:**

| Status | Description    |
|--------|----------------|
| `200`  | User object    |
| `404`  | User not found |

---

#### `PUT /users/{id}` 🔒

Update an existing user's details.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | ✅        | User ID     |

**Request Body:** Same fields as [registration](#post-authregister).

**Responses:**

| Status | Description    |
|--------|----------------|
| `200`  | User updated   |
| `404`  | User not found |

---

#### `DELETE /users/{id}` 🔒 *(Admin only)*

Delete a user by their ID.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | ✅        | User ID     |

**Responses:**

| Status | Description    |
|--------|----------------|
| `200`  | User deleted   |
| `404`  | User not found |

---

#### `GET /users/role/{role}` 🔒 *(Admin only)*

Retrieve all users with a specific role.

**Path Parameters:**

| Parameter | Type   | Required | Values            |
|-----------|--------|----------|-------------------|
| `role`    | string | ✅        | `admin` or `user` |

**Responses:**

| Status | Description                           |
|--------|---------------------------------------|
| `200`  | List of users matching specified role |

---

## Products

> Product creation, updates, and deletion are **admin-only**. Reading products is public.

#### `GET /products`

Retrieve all available products. No authentication required.

**Responses:**

| Status | Description       |
|--------|-------------------|
| `200`  | List of products  |

---

#### `POST /products` 🔒 *(Admin only)*

Create a new product.

**Request Body:**

```json
{
  "name": "iPhone 15",
  "category": "Mobile",
  "price": 80000
}
```

| Field      | Type   | Required | Description           |
|------------|--------|----------|-----------------------|
| `name`     | string | ✅        | Product name          |
| `category` | string | ✅        | Product category      |
| `price`    | number | ✅        | Price (in INR or base currency) |

**Responses:**

| Status | Description      |
|--------|------------------|
| `201`  | Product created  |
| `400`  | Validation error |

---

#### `GET /products/{id}`

Retrieve a single product by ID. No authentication required.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | ✅        | Product ID  |

**Responses:**

| Status | Description       |
|--------|-------------------|
| `200`  | Product object    |
| `404`  | Product not found |

---

#### `PUT /products/{id}` 🔒 *(Admin only)*

Update an existing product.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | ✅        | Product ID  |

**Request Body:** Same fields as [product creation](#post-products).

**Responses:**

| Status | Description       |
|--------|-------------------|
| `200`  | Product updated   |
| `404`  | Product not found |

---

#### `DELETE /products/{id}` 🔒 *(Admin only)*

Delete a product by ID.

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | ✅        | Product ID  |

**Responses:**

| Status | Description       |
|--------|-------------------|
| `200`  | Product deleted   |
| `404`  | Product not found |

---

## Orders

> All order endpoints require authentication. Admin-only routes are noted.

#### `GET /orders` 🔒 *(Admin only)*

Retrieve all orders in the system.

**Responses:**

| Status | Description       |
|--------|-------------------|
| `200`  | List of all orders |

---

#### `POST /orders` 🔒

Place a new order for the authenticated user.

**Request Body:**

```json
{
  "products": [
    {
      "productId": "64f1c3dfb5c4c9b1f8a3e456",
      "quantity": 2
    }
  ],
  "status": "pending"
}
```

| Field      | Type   | Required | Description                                      |
|------------|--------|----------|--------------------------------------------------|
| `products` | array  | ✅        | Array of `{ productId, quantity }` objects       |
| `status`   | string | ❌        | `"pending"`, `"completed"`, or `"cancelled"`     |

**Responses:**

| Status | Description                         |
|--------|-------------------------------------|
| `201`  | Order created successfully          |
| `400`  | Validation error or invalid product IDs |
| `401`  | Unauthorized                        |

---

#### `GET /orders/me` 🔒

Retrieve orders belonging to the currently authenticated user.

**Responses:**

| Status | Description                    |
|--------|--------------------------------|
| `200`  | List of current user's orders  |
| `401`  | Unauthorized                   |

---

## Analytics

> All analytics endpoints are **admin-only**.

#### `GET /orders/analytics/monthly-revenue` 🔒 *(Admin only)*

Get aggregated revenue grouped by month.

**Responses:**

| Status | Description          |
|--------|----------------------|
| `200`  | Monthly revenue list |
| `401`  | Unauthorized         |

**Success Response Example:**

```json
{
  "success": true,
  "data": [
    { "month": "2026-05", "revenue": 500000 }
  ]
}
```

---

#### `GET /orders/analytics/user-stats` 🔒 *(Admin only)*

Get per-user order statistics including total orders placed and total amount spent.

**Responses:**

| Status | Description               |
|--------|---------------------------|
| `200`  | Per-user statistics array |
| `401`  | Unauthorized              |

**Success Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "userId": "64f1c3dfb5c4c9b1f8a3e123",
      "userName": "Aman",
      "totalOrders": 5,
      "totalSpent": 250000
    }
  ]
}
```

---

## Data Models

### User

| Field      | Type   | Required | Values            |
|------------|--------|----------|-------------------|
| `name`     | string | ✅        | —                 |
| `email`    | string | ✅        | —                 |
| `password` | string | ✅        | —                 |
| `role`     | string | ✅        | `admin` or `user` |

### Product

| Field       | Type     | Required | Description       |
|-------------|----------|----------|-------------------|
| `_id`       | string   | —        | Auto-generated ID |
| `name`      | string   | ✅        | Product name      |
| `category`  | string   | ✅        | Product category  |
| `price`     | number   | ✅        | Product price     |
| `createdAt` | datetime | —        | Auto-set          |
| `updatedAt` | datetime | —        | Auto-set          |

### Order

| Field         | Type     | Required | Description                                   |
|---------------|----------|----------|-----------------------------------------------|
| `_id`         | string   | —        | Auto-generated ID                             |
| `userId`      | string   | ✅        | References user who placed the order          |
| `products`    | array    | ✅        | Array of `{ productId, quantity }`            |
| `totalAmount` | number   | ✅        | Calculated total for the order                |
| `status`      | string   | —        | `pending`, `completed`, or `cancelled`        |
| `createdAt`   | datetime | —        | Auto-set                                      |
| `updatedAt`   | datetime | —        | Auto-set                                      |

### MonthlyRevenue

| Field     | Type   | Example     |
|-----------|--------|-------------|
| `month`   | string | `"2026-05"` |
| `revenue` | number | `500000`    |

### UserStats

| Field         | Type    | Description                   |
|---------------|---------|-------------------------------|
| `userId`      | string  | User's unique ID              |
| `userName`    | string  | User's display name           |
| `totalOrders` | integer | Total number of orders placed |
| `totalSpent`  | number  | Total amount spent            |

---

## Error Handling

All errors return a consistent JSON structure:

```json
{
  "success": false,
  "message": "Validation error"
}
```

### Common HTTP Status Codes

| Code  | Meaning                                    |
|-------|--------------------------------------------|
| `200` | OK — Request succeeded                     |
| `201` | Created — Resource created successfully    |
| `400` | Bad Request — Validation error or conflict |
| `401` | Unauthorized — Missing or invalid token    |
| `403` | Forbidden — Insufficient permissions       |
| `404` | Not Found — Resource does not exist        |

---

## Security

- All sensitive routes are protected with **JWT Bearer authentication**
- Role-based access: `admin` users have broader permissions than `user` role
- Tokens are passed via the `Authorization: Bearer <token>` header

---

> 🔒 = Requires JWT authentication &nbsp;&nbsp;|&nbsp;&nbsp; *Admin only* = Requires `role: "admin"`
