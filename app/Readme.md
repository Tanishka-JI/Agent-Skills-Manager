# Agent Skills Manager

A full-stack web application to create, manage, discover, and share AI agent skills.

## Features

- User authentication
- Create and manage skills
- Explore public skills
- Like and unlike skills
- View and sort liked skills

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS, DaisyUI
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Tanishka-JI/Agent-Skills-Manager.git
cd Agent-Skills-Manager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your_postgresql_connection_url"
```

### 4. Set up the database

Ensure PostgreSQL is running, then apply the existing migrations:

```bash
npx prisma migrate dev
```

### 5. Run the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Author

**Tanishka Varshney** · [GitHub](https://github.com/Tanishka-JI)
