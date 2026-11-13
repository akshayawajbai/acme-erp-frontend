export const deploymentModels = [
    { value: 'Standalone', label: 'Standalone' },
    { value: 'Client-Server', label: 'Client-Server' },
];

export const countries = [
    { value: 'IN', label: 'India' },
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
];

export const statesByCountry = {
    IN: [
        { value: 'TN', label: 'Tamil Nadu' },
        { value: 'KA', label: 'Karnataka' },
        { value: 'MH', label: 'Maharashtra' },
        { value: 'DL', label: 'Delhi' },
        { value: 'KL', label: 'Kerala' },
        { value: 'AP', label: 'Andhra Pradesh' },
        { value: 'TG', label: 'Telangana' },
        { value: 'GJ', label: 'Gujarat' },
    ],
    US: [
        { value: 'CA', label: 'California' },
        { value: 'NY', label: 'New York' },
        { value: 'TX', label: 'Texas' },
    ],
    GB: [
        { value: 'ENG', label: 'England' },
        { value: 'SCT', label: 'Scotland' },
        { value: 'WLS', label: 'Wales' },
    ],
};

export const headOfficeOptions = [
    { value: 'ho-south', label: 'ACME South Head Office' },
    { value: 'ho-west', label: 'ACME West Head Office' },
    { value: 'ho-north', label: 'ACME North Head Office' },
];

export { branchOfficeOptions } from '../BranchOffice/mocks/branchOffices';
export { societyOptions } from '../Society/mocks/societies';
export { projectOptions } from '../Project/mocks/projects';
export { ledgerOptions } from '../Ledger/mocks/ledgers';

export const incomeTaxGroups = [
    { value: 'itg-edu', label: 'Education' },
    { value: 'itg-health', label: 'Health' },
    { value: 'itg-relief', label: 'Relief of Poor' },
    { value: 'itg-other', label: 'General Public Utility' },
];

export const generalateGroups = [
    { value: 'gg-province', label: 'Province' },
    { value: 'gg-region', label: 'Region' },
    { value: 'gg-mission', label: 'Mission' },
    { value: 'gg-other', label: 'Other' },
];

export const divisionOptions = [
    { value: 'div-north', label: 'North Division' },
    { value: 'div-south', label: 'South Division' },
    { value: 'div-central', label: 'Central Division' },
];

export const sectorOptions = [
    { value: 'sec-edu', label: 'Education' },
    { value: 'sec-health', label: 'Health' },
    { value: 'sec-social', label: 'Social' },
    { value: 'sec-admin', label: 'Administration' },
];

export const userOptions = [
    { value: 'usr-anita', label: 'Anita Rao' },
    { value: 'usr-vikram', label: 'Vikram Shah' },
    { value: 'usr-meera', label: 'Meera Iyer' },
    { value: 'usr-joseph', label: 'Joseph D’Souza' },
];

export const ledgerNatureOptions = [
    { value: 'Income', label: 'Income' },
    { value: 'Expenditure', label: 'Expenditure' },
    { value: 'Asset', label: 'Asset' },
    { value: 'Liability', label: 'Liability' },
];

export const accountTypeOptions = [
    { value: 'Savings', label: 'Savings' },
    { value: 'Current', label: 'Current' },
    { value: 'FD', label: 'Fixed Deposit' },
    { value: 'OD', label: 'Overdraft' },
];

export const operatedByOptions = [
    { value: 'Jointly', label: 'Jointly' },
    { value: 'Individual', label: 'Individual' },
];

export const fdInvestmentTypes = [
    { value: 'none', label: 'Not applicable' },
    { value: 'bank-fd', label: 'Bank FD' },
    { value: 'corp-fd', label: 'Corporate FD' },
    { value: 'govt-bond', label: 'Government Bond' },
];

export const designationOptions = [
    { value: 'President', label: 'President' },
    { value: 'Vice President', label: 'Vice President' },
    { value: 'Secretary', label: 'Secretary' },
    { value: 'Treasurer', label: 'Treasurer' },
    { value: 'Governing Body Member', label: 'Governing Body Member' },
    { value: 'Trustee', label: 'Trustee' },
    { value: 'Managing Trustee', label: 'Managing Trustee' },
    { value: 'VI', label: 'VI' },
];

export const fcraNatureOptions = [
    { value: 'Religious', label: 'Religious' },
    { value: 'Social', label: 'Social' },
    { value: 'Educational', label: 'Educational' },
    { value: 'Culture', label: 'Culture' },
    { value: 'Economy', label: 'Economy' },
];

export const societyObjectOptions = [
    { value: 'Religious', label: 'Religious' },
    { value: 'Relief of Poor', label: 'Relief of Poor' },
    { value: 'Education', label: 'Education' },
    { value: 'Medical Relief', label: 'Medical Relief' },
    { value: 'Yoga', label: 'Yoga' },
    {
        value: 'Preservation of Environment (including watersheds, forests and wildlife)',
        label: 'Preservation of Environment (including watersheds, forests and wildlife)',
    },
    {
        value: 'Preservation of monuments or places or objects of artistic or historic interest',
        label: 'Preservation of monuments or places or objects of artistic or historic interest',
    },
    {
        value: 'Advancement of any other objects of general public utility',
        label: 'Advancement of any other objects of general public utility',
    },
];

export const panStatusOptions = [
    { value: 'Available', label: 'Available' },
    { value: 'Applied', label: 'Applied' },
    { value: 'Not Available', label: 'Not Available' },
];

export const registrationStatusOptions = [
    { value: 'Registered', label: 'Registered' },
    { value: 'Applied', label: 'Applied' },
    { value: 'Not Registered', label: 'Not Registered' },
];

export const status12AOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Expired', label: 'Expired' },
    { value: 'Applied', label: 'Applied' },
    { value: 'Not Available', label: 'Not Available' },
];

export function labelFor(options, value) {
    const match = options.find((item) => item.value === value);
    return match ? match.label : value || '—';
}
