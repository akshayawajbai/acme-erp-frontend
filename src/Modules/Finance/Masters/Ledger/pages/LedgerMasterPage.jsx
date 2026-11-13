import { StatusBadge } from '../../../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../../../constants/navigation';
import { appRoutes } from '../../../../../constants/routes';
import { formatShortDate, parseLocalIsoDate } from '../../../../../utilities/dates';
import { labelFor } from '../../shared/lookups';
import { MasterPageShell } from '../../shared/MasterPageShell';
import { RowActions } from '../../shared/RowActions';
import { statusFromCloseDate } from '../../shared/status';
import { useMasterCrud } from '../../shared/useMasterCrud';
import { LedgerMasterFormModal } from '../components/LedgerMasterFormModal';
import { ledgerGroupOptions, projectCategoryOptions } from '../mocks/ledgers';
import { ledgerMasterMockRepository } from '../services/ledgerMasterMockRepository';

const emptyInput = {
    code: '',
    ledgerName: '',
    ledgerGroupId: '',
    startedOn: '',
    closedOn: '',
    projectCategoryId: '',
};

function displayDate(value) {
    const date = parseLocalIsoDate(value);
    return date ? formatShortDate(date) : '—';
}

function statusOf(row) {
    return statusFromCloseDate(row.closedOn);
}

const searchFields = [
    'code',
    'ledgerName',
    (row) => labelFor(ledgerGroupOptions, row.ledgerGroupId),
    (row) => labelFor(projectCategoryOptions, row.projectCategoryId),
    statusOf,
];

export function LedgerMasterPage() {
    const crud = useMasterCrud(ledgerMasterMockRepository, {
        entityLabel: 'Ledger',
        searchFields,
        getDeleteLabel: (row) => row.ledgerName || row.code,
    });

    const columns = [
        {
            key: 'code',
            header: 'Code',
            className: 'col-code',
            render: (row) => row.code || '—',
            sortValue: (row) => row.code,
        },
        {
            key: 'ledgerName',
            header: 'Ledger Name',
            className: 'col-name',
            render: (row) => row.ledgerName,
            sortValue: (row) => row.ledgerName,
        },
        {
            key: 'ledgerGroup',
            header: 'Ledger Group',
            render: (row) => labelFor(ledgerGroupOptions, row.ledgerGroupId),
            sortValue: (row) => labelFor(ledgerGroupOptions, row.ledgerGroupId),
        },
        {
            key: 'category',
            header: 'Project Category',
            render: (row) => labelFor(projectCategoryOptions, row.projectCategoryId),
            sortValue: (row) => labelFor(projectCategoryOptions, row.projectCategoryId),
        },
        {
            key: 'startedOn',
            header: 'Started On',
            render: (row) => displayDate(row.startedOn),
            sortValue: (row) => row.startedOn,
        },
        {
            key: 'closedOn',
            header: 'Closed On',
            render: (row) => displayDate(row.closedOn),
            sortValue: (row) => row.closedOn || '9999-12-31',
        },
        {
            key: 'status',
            header: 'Status',
            className: 'col-status',
            render: (row) => <StatusBadge status={statusOf(row)} />,
            sortValue: (row) => statusOf(row),
        },
        {
            key: 'actions',
            header: 'Actions',
            className: 'col-actions',
            hideable: false,
            render: (row) => (
                <RowActions
                    label={row.ledgerName}
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
            title="Ledger Master"
            description={pageDescriptions[appRoutes.mastersLedger]}
            breadcrumbs={breadcrumbsFor(appRoutes.mastersLedger)}
            addLabel="Add New"
            searchId="ledger-master-search"
            searchLabel="Search ledgers"
            searchPlaceholder="Code, ledger, group, or category"
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
            caption="Ledgers"
            emptyTitle="No ledgers yet"
            emptyMessage="Add a ledger to start the demonstration list."
            deleteOpen={Boolean(crud.deleteTarget)}
            deleteTitle="Delete ledger?"
            deleteMessage={
                crud.deleteTarget
                    ? `Remove “${crud.deleteTarget.ledgerName}” from the demonstration list? This cannot be undone.`
                    : ''
            }
            deleting={crud.deleting}
            deleteError={crud.deleteError}
            onDeleteCancel={() => crud.setDeleteTarget(null)}
            onDeleteConfirm={() => void crud.handleDelete()}
        >
            {crud.modal ? (
                <LedgerMasterFormModal
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
