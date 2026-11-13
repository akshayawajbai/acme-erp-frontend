// Demonstration data only. All identifiers below are fictitious.
export const societySeed = [
    {
        id: 'soc-hope',
        societyName: 'Hope Educational Society',
        societyTrustType: 'Society',
        societyRegistrationNumber: 'SOC/REG/0001/2005',
        trustDocumentNumber: '',
        registrationDate: '2005-06-15',
        branchUsersIncharge: 'usr-anita',

        panStatus: 'Available',
        panNumber: 'AAAAA0001A',
        panName: 'Hope Educational Society',
        panRegistrationDate: '2005-08-01',

        darpanStatus: 'Registered',
        darpanId: 'XX/2015/0000001',
        darpanRegistrationDate: '2015-02-10',
        darpanName: 'Hope Educational Society',

        tanRegisterNumber: 'AAAA00001A',
        tanRegisterDate: '2006-01-20',
        tanName: 'Hope Educational Society',

        status12A: 'Active',
        number12A: '12A/0000001/2021',
        validity12A: '2031-03-31',
        name12A: 'Hope Educational Society',

        number80G: '80G/0000001/2021',
        registrationDate80G: '2021-04-01',
        validity80G: '2024-03-31',
        name80G: 'Hope Educational Society',

        fcraStatus: 'Registered',
        fcraNumber: '000000001',
        fcraRegistrationDate: '2012-09-05',
        fcraValidity: '2027-09-04',
        fcraNature: 'Educational',

        incomeTaxNature: 'Charitable (Education)',
        objectOfSociety: ['Education', 'Relief of Poor'],

        address: '10 Sample Street',
        city: 'Chennai',
        country: 'IN',
        state: 'TN',
        postalCode: '600001',

        name: 'Hope Educational Society',
        registrationNumber: 'SOC/REG/0001/2005',
    },
    {
        id: 'soc-care',
        societyName: 'Care Medical Trust',
        societyTrustType: 'Trust',
        societyRegistrationNumber: '',
        trustDocumentNumber: 'TRUST/DOC/0002/2010',
        registrationDate: '2010-11-02',
        branchUsersIncharge: 'usr-meera',

        panStatus: 'Available',
        panNumber: 'BBBBB0002B',
        panName: 'Care Medical Trust',
        panRegistrationDate: '2011-01-12',

        darpanStatus: 'Applied',
        darpanId: '',
        darpanRegistrationDate: '',
        darpanName: '',

        tanRegisterNumber: 'BBBB00002B',
        tanRegisterDate: '2011-03-08',
        tanName: 'Care Medical Trust',

        status12A: 'Applied',
        number12A: '',
        validity12A: '',
        name12A: 'Care Medical Trust',

        number80G: '80G/0000002/2022',
        registrationDate80G: '2022-04-01',
        validity80G: '2027-03-31',
        name80G: 'Care Medical Trust',

        fcraStatus: 'Not Registered',
        fcraNumber: '',
        fcraRegistrationDate: '',
        fcraValidity: '',
        fcraNature: '',

        incomeTaxNature: 'Charitable (Medical Relief)',
        objectOfSociety: ['Medical Relief'],

        address: '22 Demo Road',
        city: 'Mumbai',
        country: 'IN',
        state: 'MH',
        postalCode: '400001',

        name: 'Care Medical Trust',
        registrationNumber: 'TRUST/DOC/0002/2010',
    },
    {
        id: 'soc-green',
        societyName: 'Green Earth Foundation',
        societyTrustType: 'Society',
        societyRegistrationNumber: 'SOC/REG/0003/2012',
        trustDocumentNumber: '',
        registrationDate: '2012-03-18',
        branchUsersIncharge: 'usr-vikram',

        panStatus: 'Available',
        panNumber: 'CCCCC0003C',
        panName: 'Green Earth Foundation',
        panRegistrationDate: '2012-05-01',

        darpanStatus: 'Registered',
        darpanId: 'XX/2016/0000003',
        darpanRegistrationDate: '2016-08-12',
        darpanName: 'Green Earth Foundation',

        tanRegisterNumber: 'CCCC00003C',
        tanRegisterDate: '2012-07-01',
        tanName: 'Green Earth Foundation',

        status12A: 'Active',
        number12A: '12A/0000003/2022',
        validity12A: '2032-03-31',
        name12A: 'Green Earth Foundation',

        number80G: '80G/0000003/2022',
        registrationDate80G: '2022-04-01',
        validity80G: '2027-03-31',
        name80G: 'Green Earth Foundation',

        fcraStatus: 'Applied',
        fcraNumber: '',
        fcraRegistrationDate: '',
        fcraValidity: '',
        fcraNature: '',

        incomeTaxNature: 'Charitable (Environment)',
        objectOfSociety: ['Preservation of Environment (including watersheds, forests and wildlife)'],

        address: '5 Lake View Road',
        city: 'Bengaluru',
        country: 'IN',
        state: 'KA',
        postalCode: '560001',

        name: 'Green Earth Foundation',
        registrationNumber: 'SOC/REG/0003/2012',
    },
];

export const societyOptions = societySeed.map((item) => ({
    value: item.id,
    label: item.societyName,
}));
