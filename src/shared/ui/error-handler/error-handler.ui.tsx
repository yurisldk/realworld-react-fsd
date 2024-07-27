import { Button } from '../button'

type ErrorHandlerProps = {
  error: Error
  resetErrorBoundary?: (...args: any[]) => void
}

const isDevelopment = import.meta.env.DEV

export function ErrorHandler(props: ErrorHandlerProps) {
  const { error, resetErrorBoundary } = props

  return (
    <div>
      <h3>Something went wrong.</h3>
      {isDevelopment && (
        <>
          <ul className="error-messages">
            <li key={error.message}>{error.message}</li>
          </ul>
          <pre>{error.stack}</pre>
        </>
      )}
      <Button
        type="button"
        onClick={resetErrorBoundary}
      >
        Try again
      </Button>
    </div>
  )
}
