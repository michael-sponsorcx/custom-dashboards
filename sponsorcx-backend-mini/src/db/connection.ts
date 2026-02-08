import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'sponsorcx',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    min: parseInt(process.env.DB_POOL_MIN || '2'),
    max: parseInt(process.env.DB_POOL_MAX || '10'),
};

export const pool = new Pool(poolConfig);

// Test connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected PostgreSQL error:', err);
    process.exit(-1);
});

// Helper function to execute queries
export const query = async (text: string, params?: unknown[]) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    if (process.env.SHOW_POSTGRES_LOGS === 'true') {
        console.log('📊 Query executed:', { text, duration, rows: res.rowCount });
    }

    return res;
};
