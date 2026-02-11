import { Pool, PoolConfig, QueryResultRow } from 'pg';
import type { PoolClient, QueryResult } from 'pg';

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

// Generic query helper — eliminates `as RowType` assertions at call sites
export const typedQuery = async <T extends QueryResultRow>(
    text: string,
    params?: unknown[]
): Promise<QueryResult<T>> => {
    const start = Date.now();
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;

    if (process.env.SHOW_POSTGRES_LOGS === 'true') {
        console.log('📊 Query executed:', { text, duration, rows: res.rowCount });
    }

    return res;
};

// Transaction helper — wraps BEGIN/COMMIT/ROLLBACK + client.release()
export const withTransaction = async <T>(
    fn: (client: PoolClient) => Promise<T>
): Promise<T> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await fn(client);
        await client.query('COMMIT');
        return result;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};
