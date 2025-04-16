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