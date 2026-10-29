import { BarChart } from './BarChart';

export function StackedBarChart(props) {
    return <BarChart {...props} stacked ariaLabel={props.ariaLabel || 'Stacked bar chart'} />;
}
