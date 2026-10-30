/**
 * Local-calendar date helpers. Prefer YYYY-MM-DD strings without UTC shifting.
 */

export function toLocalIsoDate(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function parseLocalIsoDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }
    const [yearText, monthText, dayText] = value.split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    const date = new Date(year, month - 1, day);
    if (
        date.getFullYear() !== year
        || date.getMonth() !== month - 1
        || date.getDate() !== day
    ) {
        return null;
    }
    return date;
}

export function startOfLocalDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function startOfNextMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

export function addLocalDays(date, days) {
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    next.setDate(next.getDate() + days);
    return next;
}

export function formatShortDate(date) {
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export const activityPeriodOptions = [
    { value: 'all', label: 'All available dates' },
    { value: 'this_month', label: 'This month' },
    { value: 'last_month', label: 'Last month' },
    { value: 'last_30_days', label: 'Last 30 days' },
    { value: 'custom', label: 'Custom range' },
];

/**
 * Returns inclusive start / exclusive end for a named period, or null for "all".
 */
export function getPeriodBounds(period, today = new Date(), custom = {}) {
    const now = startOfLocalDay(today);

    if (period === 'all') {
        return null;
    }

    if (period === 'this_month') {
        return {
            start: startOfMonth(now),
            end: startOfNextMonth(now),
            label: `This month (${formatShortDate(startOfMonth(now))} – ${formatShortDate(addLocalDays(startOfNextMonth(now), -1))})`,
        };
    }

    if (period === 'last_month') {
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = startOfMonth(now);
        return {
            start,
            end,
            label: `Last month (${formatShortDate(start)} – ${formatShortDate(addLocalDays(end, -1))})`,
        };
    }

    if (period === 'last_30_days') {
        const start = addLocalDays(now, -29);
        const end = addLocalDays(now, 1);
        return {
            start,
            end,
            label: `Last 30 days (${formatShortDate(start)} – ${formatShortDate(now)})`,
        };
    }

    if (period === 'custom') {
        const start = parseLocalIsoDate(custom.from);
        const endInclusive = parseLocalIsoDate(custom.to);
        if (!start || !endInclusive) {
            return {
                start: null,
                end: null,
                label: 'Custom range (select start and end dates)',
                invalid: true,
            };
        }
        const end = addLocalDays(endInclusive, 1);
        if (start > endInclusive) {
            return {
                start: null,
                end: null,
                label: 'Custom range (start must be on or before end)',
                invalid: true,
            };
        }
        return {
            start,
            end,
            label: `Custom range (${formatShortDate(start)} – ${formatShortDate(endInclusive)})`,
        };
    }

    return null;
}

export function filterRowsByPeriod(rows, period, custom = {}) {
    const list = Array.isArray(rows) ? rows : [];
    const bounds = getPeriodBounds(period, new Date(), custom);

    if (!bounds) {
        return list;
    }

    if (bounds.invalid || !bounds.start || !bounds.end) {
        return [];
    }

    return list.filter((row) => {
        const date = parseLocalIsoDate(row?.date);
        if (!date) {
            return false;
        }
        return date >= bounds.start && date < bounds.end;
    });
}
