## 🚀 Quick Start with Docker

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Node.js v16+ installed
- Git installed

### Setup (5 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/auauron/BloomBuhay.git
cd BloomBuhay

# 2. Start PostgreSQL database with Docker
docker-compose up -d

# 3. Setup server environment
cd server
cp .env.example .env

# 4. Generate JWT secret (Windows PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
# Copy the output and paste into server/.env as JWT_SECRET

# 5. Install dependencies and setup database
npm install
npx prisma migrate dev
npx prisma generate

# 6. Install all project dependencies
cd ..
npm install

# 7. Start the application
npm run dev
```

**Access the app:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs postgres

# Reset database (removes all data)
docker-compose down -v
```

### Database Connection

When Docker is running, PostgreSQL is available at:
```
Host: localhost
Port: 5432
Database: bloombuhay
Username: postgres
Password: password
```

### View Database

```bash
cd server
npx prisma studio
```
Opens at: http://localhost:5555

---

## 📚 Documentation

- [Server Setup Guide](./server/SETUP.md)
- [API Documentation](./server/API_DOCS.md)

## 🛠️ Tech Stack

**Frontend:**
- React 
- TypeScript
- TailwindCSS
- React Router
- Webpack

**Backend:**
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Bcrypt

**DevOps:**
- Docker & Docker Compose
- Render (Production)

## 🔒 Security Features

- Bcrypt password hashing
- JWT token authentication (24h expiry)
- Input validation
- CORS protection
- Environment variable management

## 📝 License

ISC
