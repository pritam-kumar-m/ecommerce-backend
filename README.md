# ecommerce-backend

A robust e-commerce backend application built with Node.js, Express, TypeScript, and Prisma ORM. This project follows clean architecture principles and provides a secure, scalable API for e-commerce operations.

## 🚀 Features

- RESTful API endpoints
- TypeScript for type safety
- Authentication and Authorization using JWT
- Email notifications using Nodemailer
- Database operations with Prisma ORM
- Input validation using Zod
- CORS enabled
- Cookie parsing
- Clean Architecture implementation

## 🛠️ Tech Stack

- Node.js (>=22.11.0)
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL (via Prisma)
- JSON Web Tokens (JWT)
- Bcrypt for password hashing
- Nodemailer for email services
- Zod for validation

## 📁 Project Structure

```
ecommerce-backend/
├── src/
│   ├── api/           # API routes and controllers
│   ├── core/          # Core business logic
│   ├── domain/        # Domain models and interfaces
│   ├── infrastructure/# Database and external services
│   ├── middleware/    # Express middleware
│   ├── modules/       # Feature modules
│   ├── presentation/  # Request/Response handlers
│   └── index.ts       # Application entry point
├── prisma/            # Prisma schema and migrations
├── static/           # Static files
├── tsType/           # TypeScript type definitions
├── lib/              # Utility functions
└── database/         # Database related files
```

## 🚦 Getting Started

### Prerequisites

- Node.js (>=22.11.0)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd ecommerce-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration.

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

### Development

Run the development server:
```bash
npm run dev
```

### Production Build

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run ts.check` - Check TypeScript compilation
- `npm run compile` - Compile TypeScript
- `npm run copy-files` - Copy environment files to dist

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="your-database-url"
JWT_SECRET="your-jwt-secret"
SMTP_HOST="your-smtp-host"
SMTP_PORT="your-smtp-port"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
```

## 📝 API Documentation

[Add API documentation or link to external documentation]

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

[Add author information]

## 🚀 Deployment to fly.io

### Prerequisites

1. Install the Fly CLI:
```bash
# For Windows (using PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# For macOS
brew install flyctl

# For Linux
curl -L https://fly.io/install.sh | sh
```

2. Sign up and log in to fly.io:
```bash
fly auth signup
# Or if you already have an account
fly auth login
```

### Deployment Steps

1. Initialize your fly.io application:
```bash
fly launch
```
This will create a `fly.toml` configuration file.

2. Configure your application:
Create a new file named `Dockerfile` in your project root:

```dockerfile
# Use Node.js v22 as base
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 8080

# Start the application
CMD [ "npm", "start" ]
```

3. Update your `fly.toml` file:
```toml
app = "ecommerce-backend"
primary_region = "sin"  # Singapore region, you can change this to your preferred region

[env]
  PORT = "8080"
  NODE_ENV = "production"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 1024
```

url :https://ecommerce-backend-production-f533.up.railway.app/