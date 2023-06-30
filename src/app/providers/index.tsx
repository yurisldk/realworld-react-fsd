import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router-dom';
import { FullPageError } from '~shared/ui/full-page-error';
import { QueryClientProvider } from './QueryClientProvider';
import { Router } from './RouterProvider';
import '~shared/main.css';

export function Provider() {
  return (
    <ErrorBoundary FallbackComponent={FullPageError}>
      <QueryClientProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
