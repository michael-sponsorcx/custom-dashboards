import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pool, query } from './connection';

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

// Create migrations tracking table
const createMigrationsTable = async () => {
    await query(`
        CREATE TABLE IF NOT EXISTS migrations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
    `);
};

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

        await createMigrationsTable();

        const executedMigrations = await getExecutedMigrations();
        const migrationFiles = fs
            .readdirSync(MIGRATIONS_DIR)
            .filter(file => file.endsWith('.sql') && !file.includes('.down.'))
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

// Execute a rollback migration file
const executeRollback = async (filename: string) => {
    const downFilename = filename.replace('.sql', '.down.sql');
    const filepath = path.join(MIGRATIONS_DIR, downFilename);

    if (!fs.existsSync(filepath)) {
        throw new Error(`Rollback file not found: ${downFilename}`);
    }

    const sql = fs.readFileSync(filepath, 'utf8');

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('DELETE FROM migrations WHERE name = $1', [filename]);
        await client.query('COMMIT');
        console.log(`✅ Rollback executed: ${filename} -> ${downFilename}`);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ Rollback failed: ${downFilename}`, error);
        throw error;
    } finally {
        client.release();
    }
};

// Rollback last migration
export const rollbackLastMigration = async () => {
    try {
        console.log('🔄 Rolling back last migration...');

        const executedMigrations = await getExecutedMigrations();

        if (executedMigrations.length === 0) {
            console.log('ℹ️  No migrations to rollback');
            return;
        }

        const lastMigration = executedMigrations[executedMigrations.length - 1];
        console.log(`📝 Rolling back: ${lastMigration}`);

        await executeRollback(lastMigration);

        console.log('✅ Rollback completed successfully');
    } catch (error) {
        console.error('❌ Rollback error:', error);
        throw error;
    }
};

// Rollback multiple migrations
export const rollbackMigrations = async (count: number = 1) => {
    try {
        console.log(`🔄 Rolling back ${count} migration(s)...`);

        const executedMigrations = await getExecutedMigrations();

        if (executedMigrations.length === 0) {
            console.log('ℹ️  No migrations to rollback');
            return;
        }

        const migrationsToRollback = executedMigrations.slice(-count).reverse();

        console.log(`📝 Found ${migrationsToRollback.length} migration(s) to rollback`);

        for (const migration of migrationsToRollback) {
            await executeRollback(migration);
        }

        console.log('✅ All rollbacks completed successfully');
    } catch (error) {
        console.error('❌ Rollback error:', error);
        throw error;
    }
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
