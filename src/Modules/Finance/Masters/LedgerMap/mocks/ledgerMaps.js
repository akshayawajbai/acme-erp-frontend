import { ledgerOptions, ledgerMasterSeed } from '../../Ledger/mocks/ledgers';

export { ledgerOptions };

function ledgerNameFor(id) {
    return ledgerMasterSeed.find((item) => item.id === id)?.ledgerName || id;
}

export const ledgerMapFlags = [
    { key: 'isPenaltyLedger', label: 'Is Penalty Ledger' },
    { key: 'isDepreciation', label: 'Is Depreciation' },
    { key: 'isAssetLossLedger', label: 'Is Asset Loss Ledger' },
    { key: 'isDisposal', label: 'Is Disposal' },
    { key: 'isTdsApplicable', label: 'Is TDS Applicable' },
    { key: 'includeCostCentre', label: 'Include Cost Centre For This Ledger' },
    { key: 'isFdInterestLedger', label: 'Set as FD Interest Ledger' },
    { key: 'isSbInterestLedger', label: 'Set as SB Interest Ledger' },
    { key: 'isInKindLedger', label: 'Set as In-Kind Ledger' },
    { key: 'isAssetGainLedger', label: 'Set as Asset Gain Ledger' },
];

const noFlags = {
    isPenaltyLedger: false,
    isDepreciation: false,
    isAssetLossLedger: false,
    isDisposal: false,
    isTdsApplicable: false,
    includeCostCentre: false,
    isFdInterestLedger: false,
    isSbInterestLedger: false,
    isInKindLedger: false,
    isAssetGainLedger: false,
};

export const emptyLedgerMapFlags = noFlags;

export const ledgerMapSeed = [
    {
        id: 'lm-1',
        ledgerId: 'led-1',
        ledgerName: ledgerNameFor('led-1'),
        fdInvestmentType: 'none',
        ...noFlags,
        includeCostCentre: true,
    },
    {
        id: 'lm-2',
        ledgerId: 'led-2',
        ledgerName: ledgerNameFor('led-2'),
        fdInvestmentType: 'bank-fd',
        ...noFlags,
        isTdsApplicable: true,
        isFdInterestLedger: true,
    },
    {
        id: 'lm-3',
        ledgerId: 'led-3',
        ledgerName: ledgerNameFor('led-3'),
        fdInvestmentType: 'none',
        ...noFlags,
        isAssetGainLedger: true,
        isAssetLossLedger: true,
        isDisposal: true,
    },
    // led-4 intentionally left unmapped so Add New has an available ledger option.
];
