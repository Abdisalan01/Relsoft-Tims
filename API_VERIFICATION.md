# API Endpoint Verification

This document confirms that all API endpoints match the Swagger UI specification.

## ✅ Customers Endpoints

| Method | Endpoint | Function | Status |
|--------|----------|----------|--------|
| GET | `/api/customers` | `getCustomers()` | ✅ Matches |
| POST | `/api/customers` | `createCustomer(data)` | ✅ Matches |
| GET | `/api/customers/{id}` | `getCustomerById(id)` | ✅ Matches |
| PUT | `/api/customers/{id}` | `updateCustomer(id, data)` | ✅ Matches |
| DELETE | `/api/customers/{id}` | `deleteCustomer(id)` | ✅ Matches |
| GET | `/api/customers/paged` | `getCustomersPaged(pageNumber, pageSize)` | ✅ Matches |

### Customer Request Body Schema
- **CustomerCreateRequest** & **CustomerUpdateRequest**:
  - `name` (string, nullable) ✅
  - `email` (string, nullable) ✅
  - `phone` (string, nullable) ✅

## ✅ Orders Endpoints

| Method | Endpoint | Function | Status |
|--------|----------|----------|--------|
| GET | `/api/orders` | `getOrders()` | ✅ Matches |
| POST | `/api/orders` | `createOrder(data)` | ✅ Matches |
| GET | `/api/orders/{id}` | `getOrderById(id)` | ✅ Matches |
| PUT | `/api/orders/{id}` | `updateOrder(id, data)` | ✅ Matches |
| DELETE | `/api/orders/{id}` | `deleteOrder(id)` | ✅ Matches |
| GET | `/api/orders/paged` | `getOrdersPaged(pageNumber, pageSize)` | ✅ Matches |
| GET | `/api/customers/{customerId}/orders/paged` | `getCustomerOrdersPaged(customerId, pageNumber, pageSize)` | ✅ Matches |

### Order Request Body Schema
- **OrderCreateRequest** & **OrderUpdateRequest**:
  - `customerId` (integer, required) ✅
  - `orderNumber` (string, nullable) ✅
  - `orderDate` (string, date-time format, required) ✅
  - `status` (string, nullable) ✅
  - `totalAmount` (number/double, required) ✅
  - `notes` (string, nullable) ✅

## Implementation Details

### Base URL
- Configured in `src/api/axios.js`
- Default: `http://relsofttims-001-site1.gtempurl.com`
- Can be overridden with `.env` file: `VITE_API_BASE_URL`

### Request Format
- All requests use `application/json` content type ✅
- Date fields are converted to ISO 8601 format (date-time) ✅
- Query parameters for pagination: `pageNumber` and `pageSize` ✅

### Response Handling
- Handles multiple response formats:
  - Direct arrays: `T[]`
  - Paged format: `{ items: T[], totalCount: number, ... }`
  - Alternative format: `{ data: T[], total: number }`

## ✅ All Endpoints Verified

All API endpoints in the codebase match the Swagger UI specification exactly.

