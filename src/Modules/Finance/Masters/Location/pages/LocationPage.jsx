import { StatusBadge } from '../../../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../../../constants/navigation';
import { appRoutes } from '../../../../../constants/routes';
import { labelFor, branchOfficeOptions } from '../../shared/lookups';
import { MasterPageShell } from '../../shared/MasterPageShell';
import { RowActions } from '../../shared/RowActions';
import { useMasterCrud } from '../../shared/useMasterCrud';
import { LocationFormModal } from '../components/LocationFormModal';
import { locationMockRepository } from '../services/locationMockRepository';

const emptyInput = {
    branchOfficeId: '',
    locationName: '',
};

export function LocationPage() {
    const crud = useMasterCrud(locationMockRepository, {
        entityLabel: 'Location',
        searchFields: [
            'locationName',
            (row) => labelFor(branchOfficeOptions, row.branchOfficeId),
        ],
    });

    const columns = [
        {
            key: 'branchOffice',
            header: 'Branch Office',
            className: 'col-name',
            render: (row) => labelFor(branchOfficeOptions, row.branchOfficeId),
            sortValue: (row) => labelFor(branchOfficeOptions, row.branchOfficeId),
        },
        {
            key: 'locationName',
            header: 'Location',
            className: 'col-name',
            render: (row) => row.locationName,
            sortValue: (row) => row.locationName,
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
                    label={row.locationName}
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
            title="Location Master"
            description={pageDescriptions[appRoutes.mastersLocation]}
            breadcrumbs={breadcrumbsFor(appRoutes.mastersLocation)}
            addLabel="Add New"
            searchId="location-search"
            searchLabel="Search locations"
            searchPlaceholder="Location or branch office"
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
            caption="Locations"
            emptyTitle="No locations yet"
            emptyMessage="Add a location to start the demonstration list."
            deleteOpen={Boolean(crud.deleteTarget)}
            deleteTitle="Delete location?"
            deleteMessage={
                crud.deleteTarget
                    ? `Remove “${crud.deleteTarget.locationName}” from the demonstration list? This cannot be undone.`
                    : ''
            }
            deleting={crud.deleting}
            deleteError={crud.deleteError}
            onDeleteCancel={() => crud.setDeleteTarget(null)}
            onDeleteConfirm={() => void crud.handleDelete()}
        >
            {crud.modal ? (
                <LocationFormModal
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
