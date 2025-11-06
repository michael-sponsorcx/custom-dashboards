import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pool, query } from './connection';

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

// Create migrations tracking table
// const createMigrationsTable = async () => {
//     await query(`
//         CREATE TABLE IF NOT EXISTS migrations (
//             id SERIAL PRIMARY KEY,
//             name VARCHAR(255) UNIQUE NOT NULL,
//             executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//         )
//     `);
// };

// Get list of executed migrations
const getExecutedMigrations = async (): Promise<string[]> => {
    const result = await query('SELECT name FROM migrations ORDER BY id');
    return result.rows.map(row => row.name);
};

// Execute a migration file
const executeMigration = async (filename: string) => {
    const filepath = path.join(MIGRATIONS_DIR, filename);
    const sql = fs.readFileSync(filepath, 'utf8');

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [filename]);
        await client.query('COMMIT');
        console.log(`✅ Migration executed: ${filename}`);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ Migration failed: ${filename}`, error);
        throw error;
    } finally {
        client.release();
    }
};

// Run all pending migrations
export const runMigrations = async () => {
    try {
        console.log('🔄 Running database migrations...');

        // await createMigrationsTable();

        const executedMigrations = await getExecutedMigrations();
        const migrationFiles = fs
            .readdirSync(MIGRATIONS_DIR)
            .filter(file => file.endsWith('.sql'))
            .sort();

        const pendingMigrations = migrationFiles.filter(
            file => !executedMigrations.includes(file)
        );

        if (pendingMigrations.length === 0) {
            console.log('✅ No pending migrations');
            return;
        }

        console.log(`📝 Found ${pendingMigrations.length} pending migration(s)`);

        for (const migration of pendingMigrations) {
            await executeMigration(migration);
        }

        console.log('✅ All migrations completed successfully');
    } catch (error) {
        console.error('❌ Migration error:', error);
        throw error;
    }
};

// Rollback last migration (for development only)
export const rollbackLastMigration = async () => {
    console.warn('⚠️  Rollback functionality not implemented. Please handle rollbacks manually.');
    console.warn('⚠️  In production, consider using a migration tool like node-pg-migrate or Flyway.');
};

// Run migrations if this file is executed directly
if (require.main === module) {
    runMigrations()
        .then(() => {
            console.log('✅ Migration script completed');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Migration script failed:', error);
            process.exit(1);
        });
}
