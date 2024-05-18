export function getTimeOfDay(): string | boolean {
    const now = new Date();
    const hour = now.getHours();

    const morning = hour >= 4 && hour <= 11;
    const afternoon = hour >= 12 && hour <= 16;
    const evening = hour >= 17 && hour <= 20;
    const night = hour >= 21 || hour <= 3;

    if (morning) {
        return 'morning';
    } else if (afternoon) {
        return 'afternoon';
    } else if (evening) {
        return 'evening';
    } else if (night) {
        return 'night';
    }

    return false;
}
