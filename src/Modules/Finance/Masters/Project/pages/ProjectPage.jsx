import { StatusBadge } from '../../../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../../../constants/navigation';
import { appRoutes } from '../../../../../constants/routes';
import { labelFor, divisionOptions, societyOptions } from '../../shared/lookups';
import { MasterPageShell } from '../../shared/MasterPageShell';
import { RowActions } from '../../shared/RowActions';
import { useMasterCrud } from '../../shared/useMasterCrud';
import { projectCategoryOptions } from '../../ProjectCategory/mocks/projectCategories';
import { ProjectFormModal } from '../components/ProjectFormModal';
import { projectMockRepository } from '../services/projectMockRepository';

const emptyInput = {
    code: '',
    societyId: '',
    projectCategoryId: '',
    projectName: '',
    description: '',
    divisionId: '',
};

export function ProjectPage() {
    const crud = useMasterCrud(projectMockRepository, {
        entityLabel: 'Project',
        searchFields: [
            'code',
            'projectName',
            (row) => labelFor(societyOptions, row.societyId),
            (row) => labelFor(projectCategoryOptions, row.projectCategoryId),
            (row) => labelFor(divisionOptions, row.divisionId),
        ],
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
            key: 'projectName',
            header: 'Project',
            className: 'col-name',
            render: (row) => row.projectName,
            sortValue: (row) => row.projectName,
        },
        {
            key: 'society',
            header: 'Society',
            render: (row) => labelFor(societyOptions, row.societyId),
            sortValue: (row) => labelFor(societyOptions, row.societyId),
        },
        {
            key: 'category',
            header: 'Project Category',
            render: (row) => labelFor(projectCategoryOptions, row.projectCategoryId),
            sortValue: (row) => labelFor(projectCategoryOptions, row.projectCategoryId),
        },
        {
            key: 'division',
            header: 'Division',
            render: (row) => labelFor(divisionOptions, row.divisionId),
            sortValue: (row) => labelFor(divisionOptions, row.divisionId),
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
                    label={row.projectName}
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
            title="Project Master"
            description={pageDescriptions[appRoutes.mastersProject]}
            breadcrumbs={breadcrumbsFor(appRoutes.mastersProject)}
            addLabel="Add New"
            searchId="project-search"
            searchLabel="Search projects"
            searchPlaceholder="Code, project, society, or category"
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
            caption="Projects"
            emptyTitle="No projects yet"
            emptyMessage="Add a project to start the demonstration list."
            deleteOpen={Boolean(crud.deleteTarget)}
            deleteTitle="Delete project?"
            deleteMessage={
                crud.deleteTarget
                    ? `Remove “${crud.deleteTarget.projectName}” from the demonstration list? This cannot be undone.`
                    : ''
            }
            deleting={crud.deleting}
            deleteError={crud.deleteError}
            onDeleteCancel={() => crud.setDeleteTarget(null)}
            onDeleteConfirm={() => void crud.handleDelete()}
        >
            {crud.modal ? (
                <ProjectFormModal
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
