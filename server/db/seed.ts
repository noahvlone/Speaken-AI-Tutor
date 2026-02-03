import { db } from './sqlite.js';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';

export async function seedDemoData() {
    console.log('🌱 Seeding demo data...');

    // Demo user
    const demoUserId = uuid();
    const passwordHash = await bcrypt.hash('demo123', 10);

    try {
        // Insert demo user
        db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, full_name, level)
      VALUES (?, ?, ?, ?, ?)
    `).run(demoUserId, 'demo@speaken.ai', passwordHash, 'Demo User', 'beginner');

        // Initial progress
        db.prepare(`
      INSERT OR IGNORE INTO user_progress (id, user_id, total_xp, current_level, current_streak, daily_goal)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(uuid(), demoUserId, 150, 2, 3, 50);

        // User settings
        db.prepare(`
      INSERT OR IGNORE INTO user_settings (user_id, current_level, daily_xp_goal)
      VALUES (?, ?, ?)
    `).run(demoUserId, 'beginner', 50);

        // Sample sessions
        const sessionTypes = ['chat', 'roleplay', 'challenge'];
        for (let i = 0; i < 5; i++) {
            db.prepare(`
        INSERT INTO user_sessions (id, user_id, session_type, xp_earned, duration_seconds)
        VALUES (?, ?, ?, ?, ?)
      `).run(
                uuid(),
                demoUserId,
                sessionTypes[i % sessionTypes.length],
                Math.floor(Math.random() * 30) + 10,
                Math.floor(Math.random() * 600) + 300
            );
        }

        // Sample achievements
        const achievements = ['first_chat', 'first_roleplay', 'streak_3'];
        achievements.forEach(key => {
            db.prepare(`
        INSERT OR IGNORE INTO achievements (id, user_id, achievement_key)
        VALUES (?, ?, ?)
      `).run(uuid(), demoUserId, key);
        });

        console.log('✅ Demo data seeded successfully!');
        console.log('📧 Demo Login: demo@speaken.ai');
        console.log('🔑 Password: demo123');
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedDemoData();
}
