/// <reference types="vite/client" />
/// <reference types="vitest" />
/// <reference types="@testing-library/react" />

import '@tanstack/react-query'
import { AxiosError } from 'axios'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError
  }
}
