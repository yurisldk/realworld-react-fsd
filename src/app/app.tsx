import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { attachAuthInterceptor } from '~shared/api/api.instance';
import { queryClient } from '~shared/queryClient';
import { persistor, store } from '~shared/store';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { Spinner } from '~shared/ui/spinner/spinner.ui';
import { browserRouter } from './browser-router';

attachAuthInterceptor(() => store.getState().session?.token);

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <ReduxProvider store={store}>
        <PersistGate loading={<Spinner />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={browserRouter} fallbackElement={<Spinner />} />
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
          </QueryClientProvider>
        </PersistGate>
      </ReduxProvider>
    </ErrorBoundary>
  );
}
