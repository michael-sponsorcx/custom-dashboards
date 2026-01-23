import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import bodyParser from 'body-parser';
import { graphqlSchema } from './src/graphqlSchema';

const app = express();
const PORT = process.env.PORT || 8080;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Parse CORS origins (supports comma-separated list)
const allowedOrigins = CORS_ORIGIN.split(',').map(origin => origin.trim());

console.log('🔧 CORS Configuration: Maximally open for development');
console.log('📋 Configured origins:', allowedOrigins);

// Middleware - Maximally permissive CORS for development
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) {
            // console.log('✅ CORS: Allowing request with no origin (Postman/curl/server-to-server)');
            return callback(null, true);
        }

        // Allow everything for development - maximally open
        // console.log(`✅ CORS: Allowing request from origin: ${origin}`);
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    maxAge: 86400,  // 24 hour preflight cache
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging for debugging CORS flow
app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.get('Origin');
    if (origin && req.method === 'OPTIONS') {
        console.log(`🔍 CORS Preflight: ${origin} → ${req.method} ${req.path}`);
    }
    next();
});

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    graphiql: process.env.NODE_ENV === 'development',
    pretty: true,
}));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'SponsorCX Backend Mini API',
        graphql: '/graphql',
        health: '/health',
    });
});

// CORS error handler with helpful messages
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.message.includes('CORS') || err.message.includes('Not allowed')) {
        const origin = req.get('Origin') || 'unknown';
        const method = req.method;
        const path = req.path;

        console.error(`
❌ CORS ERROR DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: Frontend at "${origin}" blocked from accessing backend "${method} ${path}"

Root Cause: Backend CORS policy is too restrictive

How to Fix:
1. Check backend CORS_ORIGIN environment variable in Vercel
2. Ensure it includes: ${origin}
3. Or set origin: true in server.ts for fully open access

Current allowed origins: ${process.env.CORS_ORIGIN || 'Not set'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `);

        return res.status(403).json({
            error: 'CORS Policy Restriction',
            message: `Frontend at ${origin} is not allowed to access this backend.`,
            origin: origin,
            allowedOrigins: process.env.CORS_ORIGIN,
            fix: 'Add this origin to CORS_ORIGIN environment variable or set origin: true in server.ts',
            helpfulTips: [
                'This error means the backend is blocking the frontend',
                'Check Vercel environment variables for CORS_ORIGIN',
                `Add "${origin}" to the CORS_ORIGIN list`,
                'For development, you can allow all origins by setting origin: true'
            ]
        });
    }
    next(err);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    
    if (process.env.NODE_ENV === 'development') {
        console.log(`🎮 GraphiQL playground: http://localhost:${PORT}/graphql`);
    }
});
