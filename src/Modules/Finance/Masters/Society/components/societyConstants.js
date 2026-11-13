export const societyTrustTypeOptions = [
    { value: 'Society', label: 'Society' },
    { value: 'Trust', label: 'Trust' },
];

export const societyTabs = [
    {
        key: 'info',
        label: 'Society Information',
        fields: [
            'societyName',
            'societyTrustType',
            'societyRegistrationNumber',
            'trustDocumentNumber',
            'registrationDate',
            'branchUsersIncharge',
        ],
    },
    { key: 'pan', label: 'PAN', fields: ['panStatus', 'panNumber', 'panName', 'panRegistrationDate'] },
    {
        key: 'darpan',
        label: 'DARPAN',
        fields: ['darpanStatus', 'darpanId', 'darpanRegistrationDate', 'darpanName'],
    },
    { key: 'tan', label: 'TAN', fields: ['tanRegisterNumber', 'tanRegisterDate', 'tanName'] },
    { key: 'a12', label: '12A', fields: ['status12A', 'number12A', 'validity12A', 'name12A'] },
    {
        key: 'g80',
        label: '80G',
        fields: ['number80G', 'registrationDate80G', 'validity80G', 'name80G'],
    },
    {
        key: 'fcra',
        label: 'FCRA',
        fields: ['fcraStatus', 'fcraNumber', 'fcraRegistrationDate', 'fcraValidity', 'fcraNature'],
    },
    { key: 'tax', label: 'Income Tax', fields: ['incomeTaxNature', 'objectOfSociety'] },
    { key: 'validation', label: 'Registration Validation', fields: [] },
    {
        key: 'address',
        label: 'Address',
        fields: ['address', 'city', 'country', 'state', 'postalCode'],
    },
];

export function tabKeyForField(field) {
    const match = societyTabs.find((tab) => tab.fields.includes(field));
    return match ? match.key : '';
}
