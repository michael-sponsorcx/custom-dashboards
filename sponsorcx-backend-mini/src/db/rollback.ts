import 'dotenv/config';
import { rollbackLastMigration, rollbackMigrations } from './migrate';

// Parse command line arguments
const args = process.argv.slice(2);
const countArg = args.find(arg => arg.startsWith('--count='));
const count = countArg ? parseInt(countArg.split('=')[1], 10) : 1;

// Validate count
if (isNaN(count) || count < 1) {
    console.error('❌ Invalid count. Use --count=N where N is a positive integer.');
    process.exit(1);
}

// Run rollback
const runRollback = async () => {
    if (count === 1) {
        await rollbackLastMigration();
    } else {
        await rollbackMigrations(count);
    }
};

runRollback()
    .then(() => {
        console.log('✅ Rollback script completed');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Rollback script failed:', error);
        process.exit(1);
    });
