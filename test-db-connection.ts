import { supabase } from './src/lib/supabaseClient';

async function testDatabaseConnection() {
    console.log('🔍 Testing Database Connection...\n');

    try {
        // Test 1: Check user_settings table
        console.log('1️⃣ Testing user_settings table...');
        const { data: settings, error: settingsError } = await supabase
            .from('user_settings')
            .select('*')
            .limit(1);

        if (settingsError) {
            console.log('   ❌ Error:', settingsError.message);
        } else {
            console.log('   ✅ user_settings table accessible');
            console.log('   📊 Sample data:', settings);
        }

        // Test 2: Check leaderboard_entries table
        console.log('\n2️⃣ Testing leaderboard_entries table...');
        const { data: leaderboard, error: leaderboardError } = await supabase
            .from('leaderboard_entries')
            .select('*')
            .limit(5);

        if (leaderboardError) {
            console.log('   ❌ Error:', leaderboardError.message);
        } else {
            console.log('   ✅ leaderboard_entries table accessible');
            console.log('   📊 Entries found:', leaderboard?.length || 0);
        }

        // Test 3: Check user_progress table
        console.log('\n3️⃣ Testing user_progress table...');
        const { data: progress, error: progressError } = await supabase
            .from('user_progress')
            .select('*')
            .limit(5);

        if (progressError) {
            console.log('   ❌ Error:', progressError.message);
        } else {
            console.log('   ✅ user_progress table accessible');
            console.log('   📊 Sessions found:', progress?.length || 0);
        }

        // Test 4: Check daily_challenges table
        console.log('\n4️⃣ Testing daily_challenges table...');
        const { data: challenges, error: challengesError } = await supabase
            .from('daily_challenges')
            .select('*')
            .eq('is_active', true)
            .limit(5);

        if (challengesError) {
            console.log('   ❌ Error:', challengesError.message);
        } else {
            console.log('   ✅ daily_challenges table accessible');
            console.log('   📊 Active challenges:', challenges?.length || 0);
        }

        // Test 5: Check current user
        console.log('\n5️⃣ Testing authentication...');
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
            console.log('   ⚠️  No user logged in (this is normal if testing without login)');
        } else if (user) {
            console.log('   ✅ User authenticated');
            console.log('   👤 User ID:', user.id);
            console.log('   📧 Email:', user.email);
        } else {
            console.log('   ℹ️  No active session');
        }

        console.log('\n' + '='.repeat(50));
        console.log('✅ Database connection test completed!');
        console.log('='.repeat(50));

    } catch (err) {
        console.error('\n💥 Unexpected error:', err);
    }
}

// Run the test
testDatabaseConnection();
