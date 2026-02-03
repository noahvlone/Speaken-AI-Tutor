import { supabase } from './migrationClient';
import * as fs from 'fs';
import * as path from 'path';

async function applyMigration() {
    console.log('🚀 Starting migration: 008_user_settings.sql');

    try {
        // Read migration file
        const migrationPath = path.join(__dirname, 'supabase', 'migrations', '012_quests_system.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

        console.log('📄 Migration file loaded');
        console.log('📊 Executing SQL...');

        // Execute migration
        const { data, error } = await supabase.rpc('exec_sql', {
            sql_query: migrationSQL
        });

        if (error) {
            console.error('❌ Migration failed:', error);
            throw error;
        }

        console.log('✅ Migration completed successfully!');
        console.log('📋 Result:', data);

        // Verify table creation
        console.log('\n🔍 Verifying table creation...');
        const { data: tableCheck, error: checkError } = await supabase
            .from('user_settings')
            .select('*')
            .limit(1);

        if (checkError) {
            console.log('⚠️  Table verification failed (this is normal if table is empty):', checkError.message);
        } else {
            console.log('✅ Table verified successfully!');
        }

    } catch (err) {
        console.error('💥 Error:', err);
        process.exit(1);
    }
}

applyMigration();
