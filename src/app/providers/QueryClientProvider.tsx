import { ReactNode } from 'react';
import { QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '~shared/lib/react-query';

type QueryClientProviderProps = {
  children: ReactNode;
};

export function QueryClientProvider(props: QueryClientProviderProps) {
  const { children } = props;
  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools
        initialIsOpen={false}
        errorTypes={[
          {
            name: '422',
            initializer: () => ({
              status: 422,
              error: {
                errors: {
                  field1: ['error message 1', 'error message 2'],
                  field2: ['error message 3'],
                },
              },
            }),
          },
          {
            name: '500',
            initializer: () => ({
              status: 500,
              error: {
                message: 'Internal server error',
              },
            }),
          },
        ]}
      />
    </TanStackQueryClientProvider>
  );
}
