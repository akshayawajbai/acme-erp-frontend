import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '../../../../Context/ToastContext';
import { errorMessage } from '../../../../utilities/errors';

export function useMasterCrud(service, options = {}) {
    const {
        entityLabel = 'Record',
        searchFields = [],
        getDeleteLabel,
        createSuccess = `${entityLabel} added.`,
        updateSuccess = `${entityLabel} updated.`,
        deleteSuccessPrefix = entityLabel,
    } = options;

    const searchFieldsRef = useRef(searchFields);
    searchFieldsRef.current = searchFields;
    const getDeleteLabelRef = useRef(getDeleteLabel);
    getDeleteLabelRef.current = getDeleteLabel;

    const [rows, setRows] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [modal, setModal] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formError, setFormError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const { pushToast } = useToast();

    const load = useCallback(async (mode = 'initial') => {
        if (mode === 'initial') {
            setLoading(true);
        } else {
            setRefreshing(true);
        }
        if (mode === 'initial') {
            setError('');
        }
        try {
            const list = await service.list();
            setRows(list);
            if (mode !== 'initial') {
                setError('');
            }
        } catch (loadError) {
            const message = errorMessage(loadError);
            if (mode === 'initial') {
                setError(message);
            } else {
                pushToast({ message, tone: 'error' });
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [pushToast, service]);

    useEffect(() => {
        void load('initial');
    }, [load]);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return rows;
        }
        const fields = searchFieldsRef.current;
        return rows.filter((row) => fields.some((field) => {
            const value = typeof field === 'function' ? field(row) : row[field];
            return String(value ?? '').toLowerCase().includes(query);
        }));
    }, [rows, search]);

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
                await service.update(modal.record.id, input);
                pushToast({ message: updateSuccess, tone: 'success' });
            } else {
                await service.create(input);
                pushToast({ message: createSuccess, tone: 'success' });
            }
            setModal(null);
            await load('quiet');
        } catch (saveError) {
            const message = errorMessage(saveError);
            setFormError(message);
            pushToast({ message, tone: 'error' });
        } finally {
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
            await service.remove(deleteTarget.id);
            const customLabel = getDeleteLabelRef.current?.(deleteTarget);
            const label = (typeof customLabel === 'string' && customLabel.trim())
                || deleteTarget.name
                || deleteTarget.ledgerGroupName
                || deleteTarget.ledgerName
                || deleteTarget.locationName
                || deleteTarget.categoryName
                || deleteTarget.projectName
                || deleteTarget.memberName
                || deleteTarget.customerName
                || deleteTarget.code
                || deleteTarget.accountNumber
                || 'record';
            pushToast({
                message: `${deleteSuccessPrefix} “${label}” deleted.`,
                tone: 'success',
            });
            setDeleteTarget(null);
            await load('quiet');
        } catch (removeError) {
            const message = errorMessage(removeError);
            setDeleteError(message);
            pushToast({ message, tone: 'error' });
        } finally {
            setDeleting(false);
        }
    }

    return {
        rows,
        filtered,
        search,
        setSearch,
        loading,
        refreshing,
        error,
        modal,
        deleteTarget,
        saving,
        deleting,
        formError,
        deleteError,
        load,
        openModal,
        setDeleteTarget,
        setDeleteError,
        handleSubmit,
        handleDelete,
        setModal,
    };
}
