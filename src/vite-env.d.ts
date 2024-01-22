/// <reference types="vite/client" />

import '@tanstack/react-query';
import { GenericError } from '~shared/lib/fetch';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: GenericError<any>;
  }
}
