
export function getRelativeTime(timestamp: number): string {
    const rtf = new Intl.RelativeTimeFormat('en', {numeric: 'auto'});
    const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
}