import { PieChart } from './PieChart';

export function DonutChart(props) {
    return <PieChart {...props} donut ariaLabel={props.ariaLabel || 'Donut chart'} />;
}
