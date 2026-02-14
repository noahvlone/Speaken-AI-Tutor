# Timezone Configuration - WIB (UTC+7)

## Overview
Sistem SpeakenAI menggunakan **WIB (Waktu Indonesia Barat / UTC+7)** untuk semua operasi timestamp dan daily reset.

## Perubahan dari Sebelumnya
- **Sebelum**: Menggunakan UTC timezone → Reset jam 07:00 WIB
- **Setelah**: Menggunakan WIB timezone → Reset jam 00:00 WIB ✅

## Utility Functions
File: `src/utils/dateUtils.ts`

### `getTodayWIB()`
Mendapatkan tanggal hari ini dalam format `YYYY-MM-DD` (WIB timezone)
```typescript
const today = getTodayWIB(); // "2026-02-04"
```

### `getNowWIB()`
Mendapatkan timestamp lengkap dalam format ISO (WIB timezone)
```typescript
const now = getNowWIB(); // "2026-02-04T17:38:40.000+07:00"
```

### `getDateWIB(date: Date)`
Konversi Date object ke format `YYYY-MM-DD` (WIB timezone)
```typescript
const date = getDateWIB(new Date()); // "2026-02-04"
```

## File yang Diupdate
1. ✅ `src/hooks/useDailyChallenges.ts` - Daily challenge reset logic
2. ✅ `src/hooks/useLeaderboard.ts` - Streak calculation & leaderboard updates
3. ✅ `src/utils/dateUtils.ts` - WIB timezone utilities (NEW)

## Testing
Untuk test apakah reset bekerja dengan benar:
1. Cek daily challenge sebelum jam 00:00 WIB
2. Tunggu sampai lewat jam 00:00 WIB
3. Refresh halaman → Challenge seharusnya berubah (seed berbeda)

## Notes
- Semua data di database tetap disimpan dalam format `YYYY-MM-DD`
- Konversi timezone hanya dilakukan di client-side (frontend)
- Server Supabase tetap menggunakan UTC, tapi kita konversi di aplikasi
