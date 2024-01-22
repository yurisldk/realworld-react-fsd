import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FullPageError } from '~shared/ui/full-page-error';
import { FullPageWrapper } from '~shared/ui/full-page-wrapper';
import { Spinner } from '~shared/ui/spinner';
import { QueryClientProvider } from './QueryClientProvider';
import '~shared/main.css';
import { BrowserRouter } from './RouterProvider';

export function Provider() {
  return (
    <ErrorBoundary FallbackComponent={FullPageError}>
      <Suspense
        fallback={
          <FullPageWrapper>
            <Spinner />
          </FullPageWrapper>
        }
      >
        <QueryClientProvider>
          <BrowserRouter />
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  );
}
