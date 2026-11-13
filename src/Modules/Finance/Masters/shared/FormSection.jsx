export function FormSection({ title, description, children }) {
    return (
        <section className="master-form-section">
            <header className="master-form-section__header">
                <h3>{title}</h3>
                {description ? <p>{description}</p> : null}
            </header>
            <div className="master-form-grid">{children}</div>
        </section>
    );
}
