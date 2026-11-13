import { StatusBadge } from '../../../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../../../constants/navigation';
import { appRoutes } from '../../../../../constants/routes';
import { labelFor, generalateGroups, incomeTaxGroups } from '../../shared/lookups';
import { MasterPageShell } from '../../shared/MasterPageShell';
import { RowActions } from '../../shared/RowActions';
import { useMasterCrud } from '../../shared/useMasterCrud';
import { ProjectCategoryFormModal } from '../components/ProjectCategoryFormModal';
import { projectCategoryMockRepository } from '../services/projectCategoryMockRepository';

const emptyInput = {
    categoryName: '',
    incomeTaxGroup: '',
    generalateGroup: '',
};

export function ProjectCategoryPage() {
    const crud = useMasterCrud(projectCategoryMockRepository, {
        entityLabel: 'Project category',
        searchFields: [
            'categoryName',
            (row) => labelFor(incomeTaxGroups, row.incomeTaxGroup),
            (row) => labelFor(generalateGroups, row.generalateGroup),
        ],
    });

    const columns = [
        {
            key: 'categoryName',
            header: 'Category Name',
            className: 'col-name',
            render: (row) => row.categoryName,
            sortValue: (row) => row.categoryName,
        },
        {
            key: 'incomeTaxGroup',
            header: 'Income Tax Group',
            render: (row) => labelFor(incomeTaxGroups, row.incomeTaxGroup),
            sortValue: (row) => labelFor(incomeTaxGroups, row.incomeTaxGroup),
        },
        {
            key: 'generalateGroup',
            header: 'Generalate Group',
            render: (row) => labelFor(generalateGroups, row.generalateGroup),
            sortValue: (row) => labelFor(generalateGroups, row.generalateGroup),
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
                    label={row.categoryName}
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
            title="Project Category Master"
            description={pageDescriptions[appRoutes.mastersProjectCategory]}
            breadcrumbs={breadcrumbsFor(appRoutes.mastersProjectCategory)}
            addLabel="Add New"
            searchId="project-category-search"
            searchLabel="Search project categories"
            searchPlaceholder="Category or group"
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
            caption="Project categories"
            emptyTitle="No project categories yet"
            emptyMessage="Add a project category to start the demonstration list."
            deleteOpen={Boolean(crud.deleteTarget)}
            deleteTitle="Delete project category?"
            deleteMessage={
                crud.deleteTarget
                    ? `Remove “${crud.deleteTarget.categoryName}” from the demonstration list? This cannot be undone.`
                    : ''
            }
            deleting={crud.deleting}
            deleteError={crud.deleteError}
            onDeleteCancel={() => crud.setDeleteTarget(null)}
            onDeleteConfirm={() => void crud.handleDelete()}
        >
            {crud.modal ? (
                <ProjectCategoryFormModal
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
