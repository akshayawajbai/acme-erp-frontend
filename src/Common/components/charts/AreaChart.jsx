import { LineChart } from './LineChart';

export function AreaChart(props) {
    return <LineChart {...props} showArea ariaLabel={props.ariaLabel || 'Area chart'} />;
}
