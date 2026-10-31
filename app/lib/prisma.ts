import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
      max: 1,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    keepAlive: true,
     keepAliveInitialDelayMillis: 10000,
    
    });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

//this file exists to prevent your app from opening dozens
//  of duplicate database connections during development, by 
// caching one single shared Prisma client on the global object.