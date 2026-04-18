const rtf = new Intl.RelativeTimeFormat('en', {numeric: 'auto'});

export function getRelativeTime(timestamp: number): string {
    const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000);

    // Guard for future dates
    if (diffInSeconds < -1) {
        return "in the future";
    }

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
}