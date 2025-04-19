import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider as ReduxProvider } from 'react-redux';
import { attachAuthInterceptor } from '~shared/api/api.instance';
import { queryClient } from '~shared/queryClient';
import { store } from '~shared/store';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { BootstrappedRouter } from './browser-router';

attachAuthInterceptor(() => store.getState().session?.token);

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <BootstrappedRouter />
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </QueryClientProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
}
