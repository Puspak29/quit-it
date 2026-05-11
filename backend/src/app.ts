import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppError } from './utils/errors';
import { env } from './config/env';

// Routes (to be created in Step 4)
import userRoutes from './modules/user/user.routes';
import addictionRoutes from './modules/addiction/addiction.routes';
import relapseRoutes from './modules/relapse/relapse.routes';
import checkinRoutes from './modules/checkin/checkin.routes';
import aiRoutes from './modules/ai/ai.routes';

const app = express();

// Security & Parsing
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health check 
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/addictions', addictionRoutes);
app.use('/api/relapses', relapseRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/ai', aiRoutes);

// 404 Handler 
app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Global Error Handler 
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        });
    }

    console.error("[Unhandled Error]", err);
    res.status(500).json({ error: "Internal server error" });
});

export default app;