import { BrowserRouter } from 'react-router-dom';
import { useStore } from 'zustand';
import { sessionModel } from '~entities/session';
import { setToken } from '~shared/api/conduitApi';
import { QueryClientProvider } from './QueryClientProvider';
import { Router } from './RouterProvider';

export function Provider() {
  const token = useStore(sessionModel.sessionStore, (state) => state.token);
  if (token) setToken(token);

  return (
    <QueryClientProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
