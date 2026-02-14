/**
 * Date utilities for handling WIB (UTC+7) timezone
 */

/**
 * Get current date in WIB timezone (YYYY-MM-DD format)
 */
export function getTodayWIB(): string {
    const now = new Date();
    // Convert to WIB (UTC+7)
    const wibOffset = 7 * 60; // 7 hours in minutes
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const wibTime = new Date(utcTime + (wibOffset * 60000));

    return wibTime.toISOString().split('T')[0];
}

/**
 * Get current timestamp in WIB timezone (ISO format)
 */
export function getNowWIB(): string {
    const now = new Date();
    // Convert to WIB (UTC+7)
    const wibOffset = 7 * 60; // 7 hours in minutes
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const wibTime = new Date(utcTime + (wibOffset * 60000));

    return wibTime.toISOString();
}

/**
 * Get date in WIB timezone from a Date object (YYYY-MM-DD format)
 */
export function getDateWIB(date: Date): string {
    const wibOffset = 7 * 60; // 7 hours in minutes
    const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
    const wibTime = new Date(utcTime + (wibOffset * 60000));

    return wibTime.toISOString().split('T')[0];
}

/**
 * Calculate difference in days between two dates in WIB timezone
 */
export function getDaysDifferenceWIB(date1: string, date2: string): number {
    const d1 = new Date(date1 + 'T00:00:00+07:00');
    const d2 = new Date(date2 + 'T00:00:00+07:00');
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
