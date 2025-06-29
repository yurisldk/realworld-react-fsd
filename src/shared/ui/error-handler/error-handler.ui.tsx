import { Button } from '../button/button.ui';

type ErrorHandlerProps = {
  error: Error;
  resetErrorBoundary?: (...args: any[]) => void;
};

export function ErrorHandler(props: ErrorHandlerProps) {
  const { error, resetErrorBoundary } = props;

  return (
    <div>
      <h3>Something went wrong.</h3>
      {__NODE_ENV__ === 'development' && (
        <>
          <ul className="error-messages">
            <li key={error.message}>{error.message}</li>
          </ul>
          <pre>{error.stack}</pre>
        </>
      )}
      <Button type="button" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </div>
  );
}
