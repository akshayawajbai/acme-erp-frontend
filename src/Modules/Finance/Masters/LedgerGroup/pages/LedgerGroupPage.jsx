import { StatusBadge } from '../../../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../../../constants/navigation';
import { appRoutes } from '../../../../../constants/routes';
import { labelFor, ledgerNatureOptions } from '../../shared/lookups';
import { MasterPageShell } from '../../shared/MasterPageShell';
import { RowActions } from '../../shared/RowActions';
import { useMasterCrud } from '../../shared/useMasterCrud';
import { LedgerGroupFormModal } from '../components/LedgerGroupFormModal';
import { ledgerGroupMockRepository } from '../services/ledgerGroupMockRepository';

const emptyInput = {
    ledgerNature: '',
    ledgerGroupName: '',
};

export function LedgerGroupPage() {
    const crud = useMasterCrud(ledgerGroupMockRepository, {
        entityLabel: 'Ledger group',
        searchFields: [
            'ledgerGroupName',
            (row) => labelFor(ledgerNatureOptions, row.ledgerNature),
        ],
        getDeleteLabel: (row) => row.ledgerGroupName,
    });

    const columns = [
        {
            key: 'ledgerNature',
            header: 'Ledger Nature',
            render: (row) => labelFor(ledgerNatureOptions, row.ledgerNature),
            sortValue: (row) => labelFor(ledgerNatureOptions, row.ledgerNature),
        },
        {
            key: 'ledgerGroupName',
            header: 'Ledger Group Name',
            className: 'col-name',
            render: (row) => row.ledgerGroupName,
            sortValue: (row) => row.ledgerGroupName,
        },
        {
            key: 'status',
            header: 'Status',
            className: 'col-status',
            render: () => <StatusBadge status="Active" />,
            sortValue: () => 'Active',
        },
        {
            key: 'actions',
            header: 'Actions',
            className: 'col-actions',
            hideable: false,
            render: (row) => (
                <RowActions
                    label={row.ledgerGroupName}
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
            title="Ledger Group Master"
            description={pageDescriptions[appRoutes.mastersLedgerGroup]}
            breadcrumbs={breadcrumbsFor(appRoutes.mastersLedgerGroup)}
            addLabel="Add New"
            searchId="ledger-group-search"
            searchLabel="Search ledger groups"
            searchPlaceholder="Ledger group or nature"
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
            caption="Ledger groups"
            emptyTitle="No ledger groups yet"
            emptyMessage="Add a ledger group to start the demonstration list."
            deleteOpen={Boolean(crud.deleteTarget)}
            deleteTitle="Delete ledger group?"
            deleteMessage={
                crud.deleteTarget
                    ? `Remove “${crud.deleteTarget.ledgerGroupName}” from the demonstration list? This cannot be undone.`
                    : ''
            }
            deleting={crud.deleting}
            deleteError={crud.deleteError}
            onDeleteCancel={() => crud.setDeleteTarget(null)}
            onDeleteConfirm={() => void crud.handleDelete()}
        >
            {crud.modal ? (
                <LedgerGroupFormModal
                    key={crud.modal.mode === 'create' ? 'create' : `${crud.modal.record.id}-${crud.modal.mode}`}
                    mode={crud.modal.mode}
                    initial={initial}
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
