import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, DataTable, DropdownMenu, EmptyState, ErrorState, Input, PageHeader, StatusBadge, TableSkeleton, } from '../../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../../constants/navigation';
import { appRoutes } from '../../../../constants/routes';
import { useToast } from '../../../../Context/ToastContext';
import { ledgerService } from '../../../../services/dataProvider';
import { errorMessage } from '../../../../utilities/errors';
import { LedgerFormModal } from '../components/LedgerFormModal';
const emptyInput = {
    code: '',
    name: '',
    groupName: '',
    status: 'Active',
};
export function LedgerPage() {
    const [ledgers, setLedgers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modal, setModal] = useState(null);
    const { pushToast } = useToast();
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const load = useCallback(async (mode) => {
        if (mode === 'initial') {
            setLoading(true);
        }
        setError('');
        try {
            const [rows, groupNames] = await Promise.all([ledgerService.list(), ledgerService.getGroups()]);
            setLedgers(rows);
            setGroups(groupNames);
        }
        catch (loadError) {
            setError(errorMessage(loadError));
        }
        finally {
            if (mode === 'initial') {
                setLoading(false);
            }
        }
    }, []);
    useEffect(() => {
        void load('initial');
    }, [load]);
    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return ledgers;
        }
        return ledgers.filter((row) => [row.code, row.name, row.groupName, row.status].some((value) => value.toLowerCase().includes(query)));
    }, [ledgers, search]);
    const columns = [
        { key: 'code', header: 'Ledger Code', render: (row) => row.code, sortValue: (row) => row.code },
        { key: 'name', header: 'Ledger Name', render: (row) => row.name, sortValue: (row) => row.name },
        { key: 'group', header: 'Ledger Group', render: (row) => row.groupName, sortValue: (row) => row.groupName },
        { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status}/>, sortValue: (row) => row.status },
        {
            key: 'actions',
            header: 'Actions',
            render: (row) => (<DropdownMenu label="Actions" items={[
                    { label: 'View', onClick: () => openModal({ mode: 'view', ledger: row }) },
                    { label: 'Edit', onClick: () => openModal({ mode: 'edit', ledger: row }) },
                ]}/>),
        },
    ];
    function openModal(next) {
        setFormError('');
        setModal(next);
    }
    async function handleSubmit(input) {
        if (!modal || modal.mode === 'view') {
            return;
        }
        setSaving(true);
        setFormError('');
        try {
            if (modal.mode === 'edit') {
                await ledgerService.update(modal.ledger.id, input);
                pushToast({ message: 'Ledger updated.', tone: 'success' });
            }
            else {
                await ledgerService.create(input);
                pushToast({ message: 'Ledger added.', tone: 'success' });
            }
            setModal(null);
            await load('quiet');
        }
        catch (saveError) {
            const message = errorMessage(saveError);
            setFormError(message);
            pushToast({ message, tone: 'error' });
        }
        finally {
            setSaving(false);
        }
    }
    const modalInitial = modal?.mode === 'create' || !modal
        ? emptyInput
        : {
            code: modal.ledger.code,
            name: modal.ledger.name,
            groupName: modal.ledger.groupName,
            status: modal.ledger.status,
        };
    return (<section>
      <PageHeader title="Ledger" description={pageDescriptions[appRoutes.ledger]} breadcrumbs={breadcrumbsFor(appRoutes.ledger)} actions={<Button variant="primary" onClick={() => openModal({ mode: 'create' })} disabled={loading || Boolean(error)}>
            Add Ledger
          </Button>}/>
      <div className="toolbar">
        <Input id="ledger-search" label="Search" type="search" clearable value={search} placeholder="Search by code, name, or group" onChange={setSearch}/>
      </div>
      {loading ? (<>
          <p className="sr-only">Loading ledgers</p>
          <TableSkeleton columns={5} rows={6}/>
        </>) : null}
      {error ? <ErrorState message={error} onRetry={() => void load('initial')}/> : null}
      {!loading && !error && ledgers.length === 0 ? (<EmptyState title="No ledgers yet" message="Add a ledger to start the demonstration list."/>) : null}
      {!loading && !error && ledgers.length > 0 ? (<DataTable columns={columns} rows={filtered} getRowKey={(row) => row.id} caption="Ledgers" emptyMessage="No ledgers match your search."/>) : null}
      {modal ? (<LedgerFormModal key={modal.mode === 'create' ? 'create' : modal.ledger.id + modal.mode} mode={modal.mode} initial={modalInitial} groups={groups} existing={ledgers} currentId={modal.mode === 'create' ? undefined : modal.ledger.id} serverError={formError} saving={saving} onClose={() => {
                if (!saving) {
                    setModal(null);
                }
            }} onSubmit={(input) => void handleSubmit(input)}/>) : null}
    </section>);
}
