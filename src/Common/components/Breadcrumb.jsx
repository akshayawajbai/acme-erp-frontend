import { Link } from 'react-router-dom';
export function Breadcrumb({ items }) {
    return (<nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (<li key={`${item.label}-${index}`}>
              {item.to && !isLast ? <Link to={item.to}>{item.label}</Link> : <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>}
            </li>);
        })}
      </ol>
    </nav>);
}
