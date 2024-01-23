import '~shared/main.css';
import { withErrorBoundary } from 'react-error-boundary';
import { withSuspense } from '~shared/lib/react';
import { FullPageError } from '~shared/ui/full-page-error';
import { Loader } from '~shared/ui/loader';
import { QueryClientProvider } from './QueryClientProvider';
import { BrowserRouter } from './RouterProvider';

function Providers() {
  return (
    <QueryClientProvider>
      <BrowserRouter />
    </QueryClientProvider>
  );
}

const SuspensedProvider = withSuspense(Providers, {
  fallback: <Loader size="full" />,
});
export const Provider = withErrorBoundary(SuspensedProvider, {
  fallbackRender: ({ error }) => <FullPageError error={error} />,
});
