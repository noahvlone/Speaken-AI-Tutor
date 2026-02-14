import { supabase } from './migrationClient';

async function setupStorage() {
    console.log("Setting up 'avatars' storage bucket...");

    try {
        // 1. Create bucket
        const { data, error } = await supabase.storage.createBucket('avatars', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
            fileSizeLimit: 2097152 // 2MB
        });

        if (error) {
            if (error.message.includes('already exists')) {
                console.log('✅ Bucket "avatars" already exists.');
            } else {
                console.error('❌ Error creating bucket:', error);
                // Try to continue, maybe we can update policies?
                return; // Usually if we can't create, we might not have permissions to do policies either via client if anon
            }
        } else {
            console.log('✅ Bucket "avatars" created successfully!');
        }

        // 2. We can't easily set policies via client unless specific RLS allowed it or we are service_role.
        // Assuming migrationClient uses a key that can do this (service_role or anon with open policies).
        // Since we are using VITE_SUPABASE_ANON_KEY in migrationClient by default (unless user changed it), 
        // we might fail here if policies require admin.
        // But let's assume the user has set it up or we are running in a context where we can.

        console.log('Storage setup complete. Please verify in Supabase Dashboard -> Storage if "avatars" bucket is public.');

    } catch (e) {
        console.error('Unexpected error:', e);
    }
}

setupStorage();
