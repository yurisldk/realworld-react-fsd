import { ErrorBoundary } from 'react-error-boundary';
import { FullPageError } from '~shared/ui/full-page-error';
import { QueryClientProvider } from './QueryClientProvider';
import '~shared/main.css';
import { BrowserRouter } from './RouterProvider';

export function Provider() {
  return (
    <ErrorBoundary FallbackComponent={FullPageError}>
      <QueryClientProvider>
        <BrowserRouter />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
