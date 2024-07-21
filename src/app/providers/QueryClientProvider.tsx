import { ReactNode } from 'react'
import {
  Query,
  QueryClientProvider as TanStackQueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  ValidationError,
  PreparationError,
  HttpError,
  NetworkError,
  UnexpectedError,
} from '~shared/lib/error'
import { queryClient } from '~shared/lib/react-query'

type QueryClientProviderProps = {
  children: ReactNode
}

export function QueryClientProvider(props: QueryClientProviderProps) {
  const { children } = props

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition="bottom-left"
        errorTypes={[
          {
            name: 'Validation Error',
            initializer: errorInitializer(new ValidationError()),
          },
          {
            name: 'Preparation Error',
            initializer: errorInitializer(new PreparationError()),
          },
          {
            name: 'Http Error',
            initializer: errorInitializer(new HttpError()),
          },
          {
            name: 'Network Error',
            initializer: errorInitializer(new NetworkError()),
          },
          {
            name: 'Unexpected Error',
            initializer: errorInitializer(new UnexpectedError()),
          },
          {
            name: 'Error',
            initializer: errorInitializer(new Error('error')),
          },
        ]}
      />
    </TanStackQueryClientProvider>
  )
}

function errorInitializer(error: Error) {
  return (query: Query) => {
    query.reset()
    return error
  }
}
