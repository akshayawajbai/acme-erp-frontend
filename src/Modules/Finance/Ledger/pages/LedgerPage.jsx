import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, DataTable, EmptyState, ErrorState, Input, Modal, PageHeader, StatusBadge, TableSkeleton, } from '../../../../Common/components';
import { EditIcon, PlusIcon, TrashIcon, ViewIcon } from '../../../../Common/components/Icons';
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
    const [deleteTarget, setDeleteTarget] = useState(null);
    const { pushToast } = useToast();
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formError, setFormError] = useState('');
    const [deleteError, setDeleteError] = useState('');

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

    const activeCount = useMemo(() => ledgers.filter((row) => row.status === 'Active').length, [ledgers]);
    const inactiveCount = useMemo(() => ledgers.length - activeCount, [ledgers, activeCount]);

    const columns = [
        { key: 'code', header: 'Ledger code', className: 'col-code', render: (row) => row.code, sortValue: (row) => row.code },
        { key: 'name', header: 'Ledger name', className: 'col-name', render: (row) => row.name, sortValue: (row) => row.name },
        { key: 'group', header: 'Ledger group', render: (row) => row.groupName, sortValue: (row) => row.groupName },
        { key: 'status', header: 'Status', className: 'col-status', render: (row) => <StatusBadge status={row.status}/>, sortValue: (row) => row.status },
        {
            key: 'actions',
            header: 'Actions',
            className: 'col-actions',
            render: (row) => (
                <div className="row-actions">
                    <button type="button" className="icon-action" aria-label={`View ${row.name}`} title="View" onClick={() => openModal({ mode: 'view', ledger: row })}>
                        <ViewIcon />
                    </button>
                    <button type="button" className="icon-action" aria-label={`Edit ${row.name}`} title="Edit" onClick={() => openModal({ mode: 'edit', ledger: row })}>
                        <EditIcon />
                    </button>
                    <button type="button" className="icon-action icon-action--danger" aria-label={`Delete ${row.name}`} title="Delete" onClick={() => { setDeleteError(''); setDeleteTarget(row); }}>
                        <TrashIcon />
                    </button>
                </div>
            ),
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

    async function handleDelete() {
        if (!deleteTarget) {
            return;
        }
        setDeleting(true);
        setDeleteError('');
        try {
            await ledgerService.remove(deleteTarget.id);
            pushToast({ message: `Ledger “${deleteTarget.name}” deleted.`, tone: 'success' });
            setDeleteTarget(null);
            await load('quiet');
        }
        catch (removeError) {
            const message = errorMessage(removeError);
            setDeleteError(message);
            pushToast({ message, tone: 'error' });
        }
        finally {
            setDeleting(false);
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
      <PageHeader title="Ledger" description={pageDescriptions[appRoutes.ledger]} breadcrumbs={breadcrumbsFor(appRoutes.ledger)} actions={<Button variant="primary" icon={<PlusIcon />} onClick={() => openModal({ mode: 'create' })} disabled={loading || Boolean(error)}>
            Add Ledger
          </Button>}/>
      {!loading && !error ? (
        <div className="ledger-counts" aria-label="Ledger counts">
          <p><span>Total ledgers</span><strong>{ledgers.length}</strong></p>
          <p><span>Active</span><strong>{activeCount}</strong></p>
          <p><span>Inactive</span><strong>{inactiveCount}</strong></p>
        </div>
      ) : null}
      <div className="toolbar ledger-toolbar">
        <Input id="ledger-search" label="Search ledgers" type="search" clearable value={search} placeholder="Code, name, or group" onChange={setSearch}/>
      </div>
      {loading ? (<>
          <p className="sr-only">Loading ledgers</p>
          <TableSkeleton columns={5} rows={6}/>
        </>) : null}
      {error ? <ErrorState message={error} onRetry={() => void load('initial')}/> : null}
      {!loading && !error && ledgers.length === 0 ? (<EmptyState title="No ledgers yet" message="Add a ledger to start the demonstration list."/>) : null}
      {!loading && !error && ledgers.length > 0 ? (<div className="ledger-register"><DataTable columns={columns} rows={filtered} getRowKey={(row) => row.id} caption="Ledgers" emptyMessage="No ledgers match your search."/></div>) : null}
      {modal ? (<LedgerFormModal key={modal.mode === 'create' ? 'create' : modal.ledger.id + modal.mode} mode={modal.mode} initial={modalInitial} groups={groups} existing={ledgers} currentId={modal.mode === 'create' ? undefined : modal.ledger.id} serverError={formError} saving={saving} onClose={() => {
                if (!saving) {
                    setModal(null);
                }
            }} onSubmit={(input) => void handleSubmit(input)}/>) : null}
      <Modal
        title="Delete ledger?"
        isOpen={Boolean(deleteTarget)}
        busy={deleting}
        onClose={() => {
            if (!deleting) {
                setDeleteTarget(null);
            }
        }}
        footer={(
            <>
              <Button type="button" variant="outline" disabled={deleting} onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button type="button" variant="danger" loading={deleting} onClick={() => void handleDelete()}>
                Delete
              </Button>
            </>
          )}
      >
        <p>
          {deleteTarget
              ? `Remove “${deleteTarget.code} — ${deleteTarget.name}” from the demonstration list? This cannot be undone.`
              : null}
        </p>
        {deleteError ? <p className="field-error">{deleteError}</p> : null}
      </Modal>
    </section>);
}
