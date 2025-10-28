# BloomBuhay Server Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and update the following variables:

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/bloombuhay

# JWT Secret - Generate a secure random key
JWT_SECRET=<generate_using_command_below>

# Optional
PORT=3000
NODE_ENV=development
```

**Generate a secure JWT_SECRET:**
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 3. Database Setup

Run Prisma migrations:
```bash
npx prisma migrate dev
```

Generate Prisma Client:
```bash
npx prisma generate
```

### 4. Start the Server

Development mode:
```bash
npm run dev
```

The server will start at `http://localhost:3000`

## Project Structure

```
server/
├── src/
│   ├── controllers/       # Request handlers
│   │   └── authController.ts
│   ├── middleware/        # Express middleware
│   │   └── auth.ts        # JWT authentication
│   ├── routes/           # API routes
│   │   ├── authRoutes.ts  # /api/auth/*
│   │   └── userRoutes.ts  # /api/users/*
│   ├── types/            # TypeScript types
│   │   └── User.ts
│   ├── utils/            # Utility functions
│   │   └── validation.ts  # Input validation
│   └── index.ts          # App entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── .env                  # Environment variables (gitignored)
├── .env.example          # Environment template
└── API_DOCS.md          # API documentation
```

## API Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/users/me` - Get current user (protected)

See [API_DOCS.md](./API_DOCS.md) for detailed documentation.

## Security Features

✅ Bcrypt password hashing (10 salt rounds)  
✅ JWT token authentication (24h expiry)  
✅ Comprehensive input validation  
✅ Email-based login (not username)  
✅ Unique email constraint  
✅ Strong password requirements  
✅ No password leaks in responses  
✅ Proper HTTP status codes  
✅ Protected route middleware  

## Common Issues

### "JWT_SECRET is not defined"
Make sure you have `JWT_SECRET` set in your `.env` file.

### Database connection error
Verify your `DATABASE_URL` in `.env` is correct and PostgreSQL is running.

### "User with this email already exists"
This email is already registered. Use a different email or login instead.

## Next Steps

1. **Add more protected routes** - Use `authenticateToken` middleware
2. **Implement password reset** - Add forgot password functionality
3. **Add email verification** - Verify user emails on signup
4. **Rate limiting** - Prevent brute force attacks
5. **Refresh tokens** - Implement token refresh mechanism
6. **Logging** - Add request/error logging (e.g., Winston, Morgan)

## Testing

Test your authentication endpoints using:
- **Postman** or **Insomnia** (API clients)
- **cURL** (see API_DOCS.md for examples)
- **Thunder Client** (VS Code extension)

## Development Tips

- Check Prisma Studio to view database: `npx prisma studio`
- View TypeScript errors: `npx tsc --noEmit`
- Format code: Install Prettier extension
- Lint code: Set up ESLint for best practices
