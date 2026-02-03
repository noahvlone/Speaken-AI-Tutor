import { createClient } from './instance';

// ============ AVATAR STORAGE FUNCTIONS ============

// Upload avatar ke Local Backend (sebagai alternatif Supabase Storage yang bermasalah)
export async function uploadAvatar(file: File, userId: string): Promise<string> {
    console.log('🔼 Uploading avatar LOCAL for user:', userId);

    try {
        // 1. Validasi file
        if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image (JPG, PNG, GIF)');
        }

        // 2. Kompres image sebelum upload (opsional tapi bagus buat hemat bandwidth)
        const compressedFile = await compressImageFile(file);

        // 3. Convert ke base64 untuk dikirim lewat JSON
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
        reader.readAsDataURL(compressedFile);
        const base64Data = await base64Promise;

        // 4. Upload ke endpoint local kita
        const response = await fetch("/api/upload-avatar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, imageData: base64Data }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to upload to local storage: ${errorText}`);
        }

        const { publicUrl } = await response.json();
        console.log('✅ Avatar uploaded to local storage:', publicUrl);

        return publicUrl;

    } catch (error) {
        console.error('❌ uploadAvatar local error:', error);
        throw error;
    }
}

// Helper untuk kompres image
async function compressImageFile(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                // Max dimensions untuk avatar
                const MAX_WIDTH = 200;
                const MAX_HEIGHT = 200;

                let width = img.width;
                let height = img.height;

                // Calculate new dimensions maintaining aspect ratio
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = Math.round((width * MAX_HEIGHT) / height);
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw compressed image
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to JPEG dengan kualitas 80% (lebih kecil dari PNG)
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], `avatar_${Date.now()}.jpg`, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            console.log('📉 Image compressed:', {
                                original: file.size,
                                compressed: blob.size,
                                reduction: `${Math.round((1 - blob.size / file.size) * 100)}%`
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Failed to compress image'));
                        }
                    },
                    'image/jpeg',
                    0.8 // 80% quality
                );
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = event.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

// Delete avatar dari storage
export async function deleteAvatar(userId: string): Promise<void> {
    const supabase = createClient();

    try {
        // Cari semua file avatar user
        const { data: files, error } = await supabase.storage
            .from('avatars')
            .list(`${userId}/`);

        if (error) {
            console.error('❌ Error listing avatar files:', error);
            return;
        }

        if (files && files.length > 0) {
            // Delete semua file avatar user
            const filePaths = files.map(file => `avatars/${userId}/${file.name}`);

            const { error: deleteError } = await supabase.storage
                .from('avatars')
                .remove(filePaths);

            if (deleteError) {
                console.error('❌ Error deleting avatar files:', deleteError);
            } else {
                console.log('🗑️ Avatar files deleted for user:', userId);
            }
        }
    } catch (error) {
        console.error('❌ deleteAvatar error:', error);
    }
}

// Get avatar URL (bisa dari local storage atau fallback)
export function getAvatarUrl(userId: string): string {
    // Default ke Dicebear jika belum ada
    const defaultUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

    // NOTE: Sebenarnya profil URL akan tersimpan di auth metadata avatar_url
    // Fungsi ini lebih sebagai manual generator jika metadata hilang
    return defaultUrl;
}

// ============ STORAGE SETUP FUNCTIONS ============

// Function untuk cek apakah storage bucket sudah setup
export async function checkStorageBucket(): Promise<boolean> {
    const supabase = createClient();

    try {
        const { data, error } = await supabase.storage.getBucket('avatars');

        if (error) {
            console.error('❌ Storage bucket check error:', error);
            return false;
        }

        console.log('✅ Storage bucket exists:', data);
        return true;
    } catch (error) {
        console.error('❌ Storage bucket check catch error:', error);
        return false;
    }
}

// Setup storage bucket (untuk development)
export async function setupStorageBucket(): Promise<boolean> {
    const supabase = createClient();

    try {
        // Coba create bucket
        const { data, error } = await supabase.storage.createBucket('avatars', {
            public: true,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            fileSizeLimit: 2097152, // 2MB
        });

        if (error) {
            console.error('❌ Create bucket error:', error);

            // Jika bucket sudah ada, itu ok
            if (error.message.includes('already exists')) {
                console.log('ℹ️ Bucket already exists');
                return true;
            }

            return false;
        }

        console.log('✅ Storage bucket created:', data);

        // Set public policies
        const { error: policyError } = await supabase.storage
            .from('avatars')
            .createSignedUrls(['*'], 60); // Test access

        if (policyError) {
            console.warn('⚠️ Policy setup may need manual configuration');
        }

        return true;
    } catch (error) {
        console.error('❌ Setup storage bucket error:', error);
        return false;
    }
}

// Helper untuk create signed URL untuk private avatars (jika perlu)
export async function getSignedAvatarUrl(userId: string): Promise<string | null> {
    const supabase = createClient();

    try {
        const { data, error } = await supabase.storage
            .from('avatars')
            .createSignedUrl(`avatars/${userId}/avatar.jpg`, 3600); // 1 hour expiry

        if (error) {
            console.error('❌ Error creating signed URL:', error);
            return null;
        }

        return data.signedUrl;
    } catch (error) {
        console.error('❌ getSignedAvatarUrl error:', error);
        return null;
    }
}
