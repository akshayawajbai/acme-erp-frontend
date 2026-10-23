const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
});
export function formatInr(amount) {
    return inrFormatter.format(amount);
}
export function formatDate(isoDate) {
    const [year, month, day] = isoDate.split('-');
    if (!year || !month || !day) {
        return isoDate;
    }
    return `${day}/${month}/${year}`;
}
