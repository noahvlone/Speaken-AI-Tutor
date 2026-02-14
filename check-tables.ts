import { supabase } from './migrationClient';

async function check() {
    console.log("Checking for public_profiles table...");
    const { data, error } = await supabase.from('public_profiles').select('count').limit(1);

    if (error) {
        console.log('❌ Table does not exist or not accessible:', error.message);
    } else {
        console.log('✅ Table exists!');
    }
}

check();
