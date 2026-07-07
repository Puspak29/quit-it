import app from './app';
import { env } from './config/env';
import { prisma } from './config/db';
import { connectRedis } from './config/redis';
import { workersIndex } from './workers/index';

const startServer = async (): Promise<void> => {
    try {
        await connectRedis();
    } catch (err) {
        console.error('[Redis] Connection failed:', err);
    }
    await prisma.$connect();
    console.log('[DB] Prisma connected');

    await workersIndex.startWorkers();

    const server = app.listen(env.PORT, () => {
        console.log(`[Server] Running on port ${env.PORT} (${env.NODE_ENV})`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
        console.log(`[Server] ${signal} received — shutting down`);
        server.close(async () => {
            await prisma.$disconnect();
            console.log('[DB] Prisma disconnected');
            await workersIndex.shutdown(signal);
            console.log('[Server] Closed cleanly');
            process.exit(0);
        });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((err) => {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
});
