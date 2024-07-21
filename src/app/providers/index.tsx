import '~shared/main.css'
import { withErrorBoundary } from 'react-error-boundary'
import { GenericError, isGenericIssue } from '~shared/lib/error'
import { compose } from '~shared/lib/react'
import { ErrorHandler, logError } from '~shared/ui/error-handler'
import { Spinner, spinnerModel } from '~shared/ui/spinner'
import { QueryClientProvider } from './QueryClientProvider'
import { BrowserRouter } from './RouterProvider'

const enhance = compose((component) =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorHandler,
    onError: logError,
  }),
)

export const Provider = enhance(() => (
  <>
    <GlobalSpinner />
    <QueryClientProvider>
      <BrowserRouter />
    </QueryClientProvider>
  </>
))

function GlobalSpinner() {
  const display = spinnerModel.globalSpinner.use.display()

  return (
    <Spinner
      display={display}
      position="bottom-right"
    />
  )
}

window.addEventListener('error', (event) => {
  if (event.error instanceof GenericError) {
    event.preventDefault()
  }

  if (isGenericIssue(event.error)) {
    event.preventDefault()
  }
})
