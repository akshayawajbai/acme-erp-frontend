import { useMemo } from 'react';
import { breadcrumbsFor, pageDescriptions } from '../../../../../constants/navigation';
import { appRoutes } from '../../../../../constants/routes';
import { fdInvestmentTypes, labelFor } from '../../shared/lookups';
import { MasterPageShell } from '../../shared/MasterPageShell';
import { RowActions } from '../../shared/RowActions';
import { useMasterCrud } from '../../shared/useMasterCrud';
import { LedgerMapFormModal } from '../components/LedgerMapFormModal';
import { emptyLedgerMapFlags, ledgerMapFlags, ledgerOptions } from '../mocks/ledgerMaps';
import { ledgerMapMockRepository } from '../services/ledgerMapMockRepository';

const emptyInput = {
    ledgerId: '',
    fdInvestmentType: 'none',
    ...emptyLedgerMapFlags,
};

function enabledFlags(row) {
    const labels = ledgerMapFlags.filter((flag) => row[flag.key]).map((flag) => flag.label);
    return labels.length > 0 ? labels.join(', ') : '—';
}

const searchFields = [
    (row) => labelFor(ledgerOptions, row.ledgerId),
    (row) => labelFor(fdInvestmentTypes, row.fdInvestmentType),
    enabledFlags,
];

export function LedgerMapPage() {
    const crud = useMasterCrud(ledgerMapMockRepository, {
        entityLabel: 'Ledger mapping',
        searchFields,
    });

    const availableLedgerOptions = useMemo(() => {
        const mappedIds = new Set(crud.rows.map((row) => row.ledgerId));
        if (crud.modal?.mode === 'edit' || crud.modal?.mode === 'view') {
            const currentId = crud.modal.record?.ledgerId;
            return ledgerOptions.filter((option) => option.value === currentId || !mappedIds.has(option.value));
        }
        return ledgerOptions.filter((option) => !mappedIds.has(option.value));
    }, [crud.rows, crud.modal]);

    const columns = [
        {
            key: 'ledger',
            header: 'Ledger',
            className: 'col-name',
            render: (row) => labelFor(ledgerOptions, row.ledgerId),
            sortValue: (row) => labelFor(ledgerOptions, row.ledgerId),
        },
        {
            key: 'fdInvestmentType',
            header: 'FD Investment Type',
            render: (row) => labelFor(fdInvestmentTypes, row.fdInvestmentType),
            sortValue: (row) => labelFor(fdInvestmentTypes, row.fdInvestmentType),
        },
        {
            key: 'flags',
            header: 'Enabled Options',
            render: enabledFlags,
            sortValue: enabledFlags,
        },
        {
            key: 'actions',
            header: 'Actions',
            className: 'col-actions',
            hideable: false,
            render: (row) => (
                <RowActions
                    label={labelFor(ledgerOptions, row.ledgerId)}
                    onView={() => crud.openModal({ mode: 'view', record: row })}
                    onEdit={() => crud.openModal({ mode: 'edit', record: row })}
                    onDelete={() => {
                        crud.setDeleteError('');
                        crud.setDeleteTarget(row);
                    }}
                />
            ),
        },
    ];

    const initial = crud.modal?.mode === 'create' || !crud.modal
        ? emptyInput
        : { ...crud.modal.record };

    return (
        <MasterPageShell
            title="Master Ledger Mapping"
            description={pageDescriptions[appRoutes.mastersLedgerMap]}
            breadcrumbs={breadcrumbsFor(appRoutes.mastersLedgerMap)}
            addLabel="Add New"
            searchId="ledger-map-search"
            searchLabel="Search ledger mappings"
            searchPlaceholder="Ledger, FD type, or option"
            search={crud.search}
            onSearchChange={crud.setSearch}
            loading={crud.loading}
            error={crud.error}
            refreshing={crud.refreshing}
            onRefresh={() => void crud.load('quiet')}
            onRetry={() => void crud.load('initial')}
            onAdd={() => crud.openModal({ mode: 'create' })}
            rows={crud.rows}
            filtered={crud.filtered}
            columns={columns}
            getRowKey={(row) => row.id}
            caption="Master ledger mappings"
            emptyTitle="No ledger mappings yet"
            emptyMessage="Add a ledger mapping to start the demonstration list."
            deleteOpen={Boolean(crud.deleteTarget)}
            deleteTitle="Delete ledger mapping?"
            deleteMessage={
                crud.deleteTarget
                    ? `Remove the mapping for “${labelFor(ledgerOptions, crud.deleteTarget.ledgerId)}” from the demonstration list? This cannot be undone.`
                    : ''
            }
            deleting={crud.deleting}
            deleteError={crud.deleteError}
            onDeleteCancel={() => crud.setDeleteTarget(null)}
            onDeleteConfirm={() => void crud.handleDelete()}
        >
            {crud.modal ? (
                <LedgerMapFormModal
                    key={crud.modal.mode === 'create' ? 'create' : `${crud.modal.record.id}-${crud.modal.mode}`}
                    mode={crud.modal.mode}
                    initial={initial}
                    ledgerOptions={availableLedgerOptions}
                    serverError={crud.formError}
                    saving={crud.saving}
                    onClose={() => {
                        if (!crud.saving) {
                            crud.setModal(null);
                        }
                    }}
                    onSubmit={(input) => void crud.handleSubmit(input)}
                />
            ) : null}
        </MasterPageShell>
    );
}
