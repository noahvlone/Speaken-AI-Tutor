import { createClient, getCurrentUser, checkConnection } from './src/utils/supabase';

async function testRefactoredClient() {
    console.log('🔍 Testing Refactored Supabase Client...\n');

    try {
        // 1. Inisialisasi Client
        console.log('1️⃣ Initializing client...');
        const supabase = createClient();
        console.log('   ✅ Client initialized successfully\n');

        // 2. Cek Koneksi (Menggunakan helper di profile.ts yang di-export lewat index.ts)
        console.log('2️⃣ Checking database connection...');
        const isConnected = await checkConnection();

        if (isConnected) {
            console.log('   ✅ Database connection successful\n');
        } else {
            console.log('   ❌ Database connection failed\n');
        }

        // 3. Cek User (Menggunakan helper di auth.ts yang di-export lewat index.ts)
        console.log('3️⃣ Checking current user...');
        const user = await getCurrentUser();

        if (user) {
            console.log('   ✅ User found:', user.email);
        } else {
            console.log('   ℹ️ No user session (Normal for tests)\n');
        }

        // 4. Test Table Access
        console.log('4️⃣ Testing user_settings table access...');
        const { data, error } = await supabase.from('user_settings').select('count').limit(1);

        if (error) {
            console.log('   ❌ Table access error:', error.message);
        } else {
            console.log('   ✅ Table user_settings is accessible\n');
        }

        console.log('='.repeat(50));
        console.log('🎉 Refactored client verification completed!');
        console.log('='.repeat(50));

    } catch (err) {
        console.error('\n💥 Unexpected error during verification:', err);
    }
}

testRefactoredClient();
