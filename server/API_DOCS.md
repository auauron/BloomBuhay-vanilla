# BloomBuhay API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. After login/signup, include the token in subsequent requests:

```
Authorization: Bearer <your_jwt_token>
```

**Token Types:**
- **Access Token**: Short-lived token (default: 1h) for API requests
- **Refresh Token**: Long-lived token (default: 7 days) for obtaining new access tokens

---

## Endpoints

## Authentication Endpoints

### 1. User Signup

**POST** `/api/auth/signup`

Register a new user account and receive both access and refresh tokens.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**Validation Rules:**
- `fullName`: Required, minimum 2 characters
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters, must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- `confirmPassword`: Must match password

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a1b2c3d4e5f6...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "profilePic": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400 - Validation Error):**
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

**Error Response (409 - User Exists):**
```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

---

### 2. User Login

**POST** `/api/auth/login`

Authenticate a user and receive both access and refresh tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a1b2c3d4e5f6...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "profilePic": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400 - Validation Error):**
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Error Response (401 - Invalid Credentials):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### 3. Refresh Access Token

**POST** `/api/auth/refresh`

Obtain a new access token using a valid refresh token. The old refresh token is revoked and a new one is issued (token rotation).

**Request Body:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "x9y8z7w6v5u4..."
}
```

**Error Response (400 - Missing Token):**
```json
{
  "success": false,
  "error": "refreshToken is required"
}
```

**Error Response (401 - Invalid/Revoked Token):**
```json
{
  "success": false,
  "error": "Invalid refresh token"
}
```

**Error Response (401 - Expired Token):**
```json
{
  "success": false,
  "error": "Refresh token expired"
}
```

---

### 4. Logout

**POST** `/api/auth/logout`

Revoke a refresh token to log out the user.

**Request Body:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "refreshToken is required"
}
```

---

## User Profile Endpoints

### 5. Get Current User Profile

**GET** `/api/users/me`

Get the authenticated user's profile. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "profilePic": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404 - User Not Found):**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

### 6. Update Current User Profile

**PUT** `/api/users/me`

Update the authenticated user's profile. **Requires authentication.** Any field is optional; only provided fields are updated. Password update requires `confirmPassword` and follows the same strength rules.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body (any subset):**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "profilePic": "https://example.com/avatar.jpg",
  "password": "NewSecurePass123",
  "confirmPassword": "NewSecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "profilePic": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Validation Errors (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

**Error Response (404 - User Not Found):**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

## Mother Profile Endpoints

### 7. Create Mother Profile

**POST** `/api/mother-profiles`

Create a new mother profile for the authenticated user. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "stage": "Pregnant",
  "babyName": "Baby Doe",
  "lmpDate": "2024-01-01",
  "babyGender": "female",
  "weeksPregnant": 12
}
```

**Field Descriptions:**
- `stage`: **Required**. One of: `"Pregnant"`, `"Postpartum"`, `"Early Childcare"`
- `babyName`: Optional. Baby's name
- `lmpDate`: Optional. Last Menstrual Period date (ISO format). Used to auto-calculate weeks pregnant if `weeksPregnant` is not provided
- `babyGender`: Optional. One of: `"male"`, `"female"`, `"unknown"`
- `weeksPregnant`: Optional. Number of weeks pregnant (takes precedence over LMP calculation)

**Success Response (201):**
```json
{
  "id": 1,
  "motherId": 1,
  "stage": "pregnant",
  "babyName": "Baby Doe",
  "lmpDate": "2024-01-01T00:00:00.000Z",
  "weeksPregnant": 12,
  "weeksPostpartum": null,
  "babyAgeMonths": null,
  "babyGender": "female",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (400 - Invalid Stage):**
```json
{
  "error": "Invalid or missing stage"
}
```

**Error Response (400 - Invalid Gender):**
```json
{
  "error": "Invalid babyGender"
}
```

**Error Response (400 - Invalid Weeks):**
```json
{
  "error": "Invalid weeksPregnant value"
}
```

**Error Response (401 - Unauthorized):**
```json
{
  "error": "Unauthorized"
}
```

---

### 8. Get Current User's Mother Profile

**GET** `/api/mother-profiles/me`

Get the most recent mother profile for the authenticated user. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "id": 1,
  "motherId": 1,
  "stage": "pregnant",
  "babyName": "Baby Doe",
  "lmpDate": "2024-01-01T00:00:00.000Z",
  "weeksPregnant": 12,
  "weeksPostpartum": null,
  "babyAgeMonths": null,
  "babyGender": "female",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404 - No Profile Found):**
```json
{
  "message": "No profile found"
}
```

**Error Response (401 - Unauthorized):**
```json
{
  "error": "Unauthorized"
}
```

---

## Common Authentication Errors

**Error Response (401 - No Token):**
```json
{
  "success": false,
  "error": "Access token is required"
}
```

**Error Response (403 - Invalid Token):**
```json
{
  "success": false,
  "error": "Invalid token"
}
```

**Error Response (401 - Expired Token):**
```json
{
  "success": false,
  "error": "Token has expired"
}
```

---

## Database Schema

The API uses PostgreSQL with Prisma ORM. Key models include:

### User
- `id`: Auto-incrementing primary key
- `fullName`: User's full name
- `email`: Unique email address
- `password`: Bcrypt hashed password
- `profilePic`: Optional profile picture URL
- `createdAt`, `updatedAt`: Timestamps

### MotherProfiles
- `id`: Auto-incrementing primary key
- `motherId`: Foreign key to User
- `stage`: Enum (`pregnant`, `postpartum`, `childcare`)
- `babyName`: Optional baby name
- `lmpDate`: Last Menstrual Period date
- `weeksPregnant`: Calculated or manual weeks pregnant
- `weeksPostpartum`: Weeks after delivery
- `babyAgeMonths`: Baby age in months
- `babyGender`: Enum (`male`, `female`, `unknown`)
- `createdAt`: Timestamp

### RefreshToken
- `id`: Auto-incrementing primary key
- `token`: Unique refresh token string
- `userId`: Foreign key to User
- `expiresAt`: Token expiration date
- `revoked`: Boolean flag for token revocation
- `createdAt`: Timestamp

**Other Models**: `PlannerTask`, `HealthLog`, `ToolsLog`, `Article`, `JournalEntry`

---

## Security Features Implemented

✅ **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds  
✅ **JWT Authentication**: Secure token-based authentication with configurable expiry (default: 24h)  
✅ **Refresh Token Rotation**: Old refresh tokens are revoked when new ones are issued  
✅ **Token Revocation**: Logout functionality revokes refresh tokens  
✅ **Input Validation**: Comprehensive validation for all user inputs  
✅ **Email Uniqueness**: Prevents duplicate user accounts  
✅ **Password Strength**: Enforces strong password requirements (8+ chars, uppercase, lowercase, number)  
✅ **No Password Leaks**: Passwords are never returned in API responses  
✅ **Proper HTTP Status Codes**: RESTful status codes for all responses  
✅ **Error Handling**: Graceful error handling with descriptive messages  
✅ **CORS Configuration**: Configured for secure cross-origin requests  
✅ **Request Size Limits**: 10MB limit on request bodies  

---

## Environment Variables

Make sure to set up your `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/bloombuhay

# JWT Configuration
JWT_SECRET=your_very_secure_random_secret_key
JWT_EXPIRES=24h

# Refresh Token Configuration
REFRESH_TOKEN_EXPIRES_DAYS=30

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Security Note**: Generate a strong JWT_SECRET using:
```bash
openssl rand -base64 32
```

---

## API Testing Guide

### Prerequisites
1. Start the server: `npm run dev`
2. Server will run at `http://localhost:3000`
3. Use Insomnia, Postman, Thunder Client, or curl

### Example Workflow

#### 1. Signup
**Request:**
```http
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**Response:** Save the `token` and `refreshToken` from the response.

---

#### 2. Login
**Request:**
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "SecurePass123"
}
```

**Response:** Save the `token` and `refreshToken` from the response.

---

#### 3. Get User Profile
**Request:**
```http
GET http://localhost:3000/api/users/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

#### 4. Update User Profile
**Request:**
```http
PUT http://localhost:3000/api/users/me
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "profilePic": "https://example.com/avatar.jpg"
}
```

---

#### 5. Create Mother Profile
**Request:**
```http
POST http://localhost:3000/api/mother-profiles
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "stage": "Pregnant",
  "babyName": "Baby Smith",
  "lmpDate": "2024-01-15",
  "babyGender": "female"
}
```

---

#### 6. Get Mother Profile
**Request:**
```http
GET http://localhost:3000/api/mother-profiles/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

#### 7. Refresh Access Token
**Request:**
```http
POST http://localhost:3000/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

**Response:** Save the new `token` and `refreshToken`.

---

#### 8. Logout
**Request:**
```http
POST http://localhost:3000/api/auth/logout
Content-Type: application/json

{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

---

## API Endpoint Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/auth/refresh` | No | Refresh access token |
| POST | `/api/auth/logout` | No | Revoke refresh token |
| GET | `/api/users/me` | Yes | Get current user profile |
| PUT | `/api/users/me` | Yes | Update current user profile |
| POST | `/api/mother-profiles` | Yes | Create mother profile |
| GET | `/api/mother-profiles/me` | Yes | Get current user's mother profile |

---

## Development Notes

- **TypeScript**: The server is built with TypeScript for type safety
- **Prisma ORM**: Database operations use Prisma Client
- **Express**: RESTful API built with Express.js
- **Validation**: Custom validation utilities for request data
- **Middleware**: JWT authentication middleware protects routes
- **Database**: PostgreSQL with Prisma migrations
