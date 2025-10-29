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

---

## Endpoints

### 1. User Signup

**POST** `/api/auth/signup`

Register a new user account.

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
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
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

Authenticate a user and receive a JWT token.

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
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
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

### 3. Get Current User Profile

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
### 4. Update Current User Profile

**PUT** `/api/users/me`

Update the authenticated user's profile. Any field is optional; only provided fields are updated. Password update requires `confirmPassword` and follows the same strength rules.

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
```

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

## Security Features Implemented

✅ **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds  
✅ **JWT Authentication**: Secure token-based authentication with 24-hour expiry  
✅ **Input Validation**: Comprehensive validation for all user inputs  
✅ **Email Uniqueness**: Prevents duplicate user accounts  
✅ **Password Strength**: Enforces strong password requirements  
✅ **No Password Leaks**: Passwords are never returned in API responses  
✅ **Proper HTTP Status Codes**: RESTful status codes for all responses  
✅ **Error Handling**: Graceful error handling with descriptive messages  

---

## Environment Variables

Make sure to set up your `.env` file with the following variables:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/bloombuhay
JWT_SECRET=your_very_secure_random_secret_key
PORT=3000
NODE_ENV=development
```

**Security Note**: Generate a strong JWT_SECRET using:
```bash
openssl rand -base64 32
```

---

## Testing with insomia/postman/thunderclient

make sure to npm run dev first to run the server
first, copy the local host with port

### Signup
```
go to insomia or any other api tester and create new http request,
have it in POST and paste the localhost with port,
click body and have it in json and input this

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}

run it and will show success true if you havent already signup and success false if you already did
```

### Login
```
make a new http request, in POST, paste the localhost with prt
click the body request and input this 
'{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

run the it and it will show success
```

### Get Profile (Replace TOKEN with actual JWT)
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer TOKEN"
```
