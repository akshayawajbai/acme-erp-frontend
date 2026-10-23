import { Breadcrumb } from './Breadcrumb';
export function PageHeader({ title, breadcrumbs, description, actions }) {
    return (<header className="page-header">
      <div>
        <Breadcrumb items={breadcrumbs}/>
        <h1>{title}</h1>
        {description ? <p className="page-description">{description}</p> : null}
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </header>);
}
