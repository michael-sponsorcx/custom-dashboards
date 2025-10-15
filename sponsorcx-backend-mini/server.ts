import 'dotenv/config';
import express, { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import bodyParser from 'body-parser';
import { graphqlSchema } from './src/graphqlSchema';

const app = express();
const PORT = process.env.PORT || 8080;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    
    if (process.env.NODE_ENV === 'development') {
        console.log(`🎮 GraphiQL playground: http://localhost:${PORT}/graphql`);
    }
});
