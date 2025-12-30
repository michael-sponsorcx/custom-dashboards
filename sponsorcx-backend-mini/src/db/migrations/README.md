# Database Migrations

This directory contains SQL migration files for the SponsorCX backend database.

## Migration Files

Migrations follow a naming convention:
- **Up migrations**: `XXX_description.sql` - Creates/modifies database objects
- **Down migrations**: `XXX_description.down.sql` - Reverts the changes

## Running Migrations

### Apply pending migrations
```bash
yarn migrate
```

### Rollback the last migration
```bash
yarn migrate:rollback
```

### Rollback multiple migrations
```bash
yarn migrate:rollback --count=3
```

### Rollback all migrations
```bash
yarn migrate:rollback:all
```

## Creating New Migrations

When creating a new migration, you must create **both** an up and down migration file:

1. **Up migration** (`002_my_changes.sql`):
   - Contains the SQL to apply the changes (CREATE TABLE, ALTER TABLE, etc.)

2. **Down migration** (`002_my_changes.down.sql`):
   - Contains the SQL to undo the changes (DROP TABLE, etc.)
   - Must reverse the up migration in the opposite order

### Example

**002_add_users_table.sql** (up):
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

**002_add_users_table.down.sql** (down):
```sql
DROP INDEX IF EXISTS idx_users_email;
DROP TABLE IF EXISTS users;
```

## Best Practices

1. **Always create both up and down migrations** - Every migration must be reversible
2. **Test rollbacks** - Verify that your down migration actually reverts the changes
3. **Use transactions** - The migration system wraps each migration in a transaction
4. **Order matters** - Drop dependent objects first (indexes, then tables)
5. **Be explicit** - Use `IF EXISTS` and `IF NOT EXISTS` for safety
6. **One logical change per migration** - Keep migrations focused and atomic

## Migration Tracking

The system uses a `migrations` table to track which migrations have been executed:
- When a migration runs, its filename is recorded in the `migrations` table
- When a rollback runs, the entry is removed from the `migrations` table
- Migrations are executed in alphabetical order by filename
