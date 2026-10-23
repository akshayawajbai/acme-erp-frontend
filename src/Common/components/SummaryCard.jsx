export function SummaryCard({ label, value, note }) {
    return (<article className="summary-card">
      <h3>{label}</h3>
      <p>{value}</p>
      {note ? <span>{note}</span> : null}
    </article>);
}
