import { PrismaClient } from "@prisma/client";
import { env } from "./env";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL
})

export const prisma = new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
}

export const disconnectDB = async () => {
    try {
        await prisma.$disconnect();
        console.log("Disconnected from the database successfully.");
    }
    catch (error) {
        console.error("Error disconnecting from the database:", error);
    }
}