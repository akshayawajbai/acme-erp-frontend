import { EditIcon, TrashIcon, ViewIcon } from '../../../../Common/components/Icons';

export function RowActions({ label, onView, onEdit, onDelete }) {
    return (
        <div className="row-actions">
            <button type="button" className="icon-action" aria-label={`View ${label}`} title="View" onClick={onView}>
                <ViewIcon />
            </button>
            <button type="button" className="icon-action" aria-label={`Edit ${label}`} title="Edit" onClick={onEdit}>
                <EditIcon />
            </button>
            <button
                type="button"
                className="icon-action icon-action--danger"
                aria-label={`Delete ${label}`}
                title="Delete"
                onClick={onDelete}
            >
                <TrashIcon />
            </button>
        </div>
    );
}
