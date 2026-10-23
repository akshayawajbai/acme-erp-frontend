import { Button } from './Button';
export function ErrorState({ title = 'Unable to load this page', message, onRetry }) {
    return (<div className="state-panel" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry ? (<Button variant="primary" onClick={onRetry}>
          Try again
        </Button>) : null}
    </div>);
}
