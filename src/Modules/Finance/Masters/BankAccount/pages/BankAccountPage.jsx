import { StatusBadge } from '../../../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../../../constants/navigation';
import { appRoutes } from '../../../../../constants/routes';
import { formatShortDate, parseLocalIsoDate } from '../../../../../utilities/dates';
import { accountTypeOptions, labelFor, operatedByOptions } from '../../shared/lookups';
import { MasterPageShell } from '../../shared/MasterPageShell';
import { RowActions } from '../../shared/RowActions';
import { statusFromCloseDate } from '../../shared/status';
import { useMasterCrud } from '../../shared/useMasterCrud';
import { BankAccountFormModal } from '../components/BankAccountFormModal';
import { bankAccountMockRepository } from '../services/bankAccountMockRepository';

const emptyInput = {
    accountNumber: '',
    customerName: '',
    bankName: '',
    branch: '',
    ifsc: '',
    accountType: '',
    openDate: '',
    closedDate: '',
    operatedBy: '',
    branchAddress: '',
    email: '',
    phone: '',
};

const searchFields = [
    'accountNumber',
    'customerName',
    'bankName',
    'branch',
    'ifsc',
    'email',
];

function displayDate(value) {
    const date = parseLocalIsoDate(value);
    return date ? formatShortDate(date) : '—';
}

function statusOf(row) {
    return statusFromCloseDate(row.closedDate);
}

export function BankAccountPage() {
    const crud = useMasterCrud(bankAccountMockRepository, {
        entityLabel: 'Bank account',
        searchFields,
        getDeleteLabel: (row) => row.customerName || row.accountNumber,
    });

    const columns = [
        {
            key: 'accountNumber',
            header: 'Account Number',
            className: 'col-code',
            render: (row) => row.accountNumber,
            sortValue: (row) => row.accountNumber,
        },
        {
            key: 'customerName',
            header: 'Customer Name',
            className: 'col-name',
            render: (row) => row.customerName,
            sortValue: (row) => row.customerName,
        },
        { key: 'bankName', header: 'Bank', render: (row) => row.bankName, sortValue: (row) => row.bankName },
        { key: 'branch', header: 'Branch', render: (row) => row.branch, sortValue: (row) => row.branch },
        { key: 'ifsc', header: 'IFSC', render: (row) => row.ifsc, sortValue: (row) => row.ifsc },
        {
            key: 'accountType',
            header: 'Type',
            render: (row) => labelFor(accountTypeOptions, row.accountType),
            sortValue: (row) => labelFor(accountTypeOptions, row.accountType),
        },
        {
            key: 'operatedBy',
            header: 'Operated By',
            render: (row) => labelFor(operatedByOptions, row.operatedBy),
            sortValue: (row) => labelFor(operatedByOptions, row.operatedBy),
        },
        {
            key: 'openDate',
            header: 'Open Date',
            render: (row) => displayDate(row.openDate),
            sortValue: (row) => row.openDate,
        },
        {
            key: 'closedDate',
            header: 'Closed Date',
            render: (row) => displayDate(row.closedDate),
            sortValue: (row) => row.closedDate || '9999-12-31',
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
                    label={row.accountNumber}
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
            title="Bank Account Master"
            description={pageDescriptions[appRoutes.mastersBankAccount]}
            breadcrumbs={breadcrumbsFor(appRoutes.mastersBankAccount)}
            addLabel="Add New"
            searchId="bank-account-search"
            searchLabel="Search bank accounts"
            searchPlaceholder="Account number, customer, bank, or IFSC"
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
            caption="Bank accounts"
            emptyTitle="No bank accounts yet"
            emptyMessage="Add a bank account to start the demonstration list."
            deleteOpen={Boolean(crud.deleteTarget)}
            deleteTitle="Delete bank account?"
            deleteMessage={
                crud.deleteTarget
                    ? `Remove account “${crud.deleteTarget.accountNumber} — ${crud.deleteTarget.customerName}” from the demonstration list? This cannot be undone.`
                    : ''
            }
            deleting={crud.deleting}
            deleteError={crud.deleteError}
            onDeleteCancel={() => crud.setDeleteTarget(null)}
            onDeleteConfirm={() => void crud.handleDelete()}
        >
            {crud.modal ? (
                <BankAccountFormModal
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
