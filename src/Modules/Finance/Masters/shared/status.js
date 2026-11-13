import { parseLocalIsoDate, startOfLocalDay } from '../../../../utilities/dates';

/** Active unless a closed/resignation date is set and is on or before today. */
export function statusFromCloseDate(closeDate, activeLabel = 'Active', closedLabel = 'Closed') {
    if (!closeDate) {
        return activeLabel;
    }
    const date = parseLocalIsoDate(closeDate);
    if (!date) {
        return closedLabel;
    }
    return date <= startOfLocalDay(new Date()) ? closedLabel : activeLabel;
}
