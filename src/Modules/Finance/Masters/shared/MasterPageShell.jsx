import { Button, EmptyState, ErrorState, Input, PageHeader, TableSkeleton } from '../../../../Common/components';
import { PlusIcon } from '../../../../Common/components/Icons';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { MasterDataTable } from './MasterDataTable';

export function MasterPageShell({
    title,
    description,
    breadcrumbs,
    addLabel,
    searchId,
    searchLabel,
    searchPlaceholder,
    search,
    onSearchChange,
    loading,
    error,
    refreshing,
    onRefresh,
    onRetry,
    onAdd,
    rows,
    filtered,
    columns,
    getRowKey,
    caption,
    emptyTitle,
    emptyMessage,
    deleteOpen,
    deleteTitle,
    deleteMessage,
    deleting,
    deleteError,
    onDeleteCancel,
    onDeleteConfirm,
    children,
}) {
    return (
        <section className="master-page">
            <PageHeader
                title={title}
                description={description}
                breadcrumbs={breadcrumbs}
                actions={(
                    <Button variant="primary" icon={<PlusIcon />} onClick={onAdd} disabled={loading || Boolean(error)}>
                        {addLabel}
                    </Button>
                )}
            />
            <div className="toolbar master-toolbar">
                <Input
                    id={searchId}
                    label={searchLabel}
                    type="search"
                    clearable
                    value={search}
                    placeholder={searchPlaceholder}
                    onChange={onSearchChange}
                />
            </div>
            {loading ? (
                <>
                    <p className="sr-only">Loading {title}</p>
                    <TableSkeleton columns={Math.min(columns.length, 6)} rows={6} />
                </>
            ) : null}
            {error ? <ErrorState message={error} onRetry={onRetry} /> : null}
            {!loading && !error && rows.length === 0 ? (
                <EmptyState title={emptyTitle} message={emptyMessage} />
            ) : null}
            {!loading && !error && rows.length > 0 ? (
                <MasterDataTable
                    columns={columns}
                    rows={filtered}
                    getRowKey={getRowKey}
                    caption={caption}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                />
            ) : null}
            {children}
            <ConfirmDeleteModal
                open={deleteOpen}
                title={deleteTitle}
                message={deleteMessage}
                busy={deleting}
                error={deleteError}
                onCancel={onDeleteCancel}
                onConfirm={onDeleteConfirm}
            />
        </section>
    );
}
