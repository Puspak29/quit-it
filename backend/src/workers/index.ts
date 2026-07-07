import { moderationWorker } from './moderation.workers';
import { milestoneWorker } from './milestone.workers';

const workers = [moderationWorker, milestoneWorker];

export const workersIndex = {
    async shutdown(signal: string){
        console.log(`[Workers] ${signal} — draining in-flight jobs...`);
        await Promise.all(workers.map((w) => w.close()));
        console.log('[Workers] All workers closed cleanly.');
    },
    async startWorkers () {
        console.log(`[Workers] starting ${workers.length} workers...`);
        workers.forEach((w) => console.log(` ✓ ${w.name}`));

        process.on('uncaughtException', (err) => console.error('[Workers] Uncaught:', err));
        process.on('unhandledRejection', (reason) => console.error('[Workers] Unhandled rejection:', reason));
    }
}