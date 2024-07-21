/// <reference types="vite/client" />
/// <reference types="vitest" />
/// <reference types="@testing-library/react" />

import '@tanstack/react-query'
import { GenericIssue } from '~shared/lib/error'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: GenericIssue<any>
  }
}
