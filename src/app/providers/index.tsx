import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from './QueryClientProvider';
import { Router } from './RouterProvider';

export function Provider() {
  return (
    <BrowserRouter>
      <QueryClientProvider>
        <Router />
      </QueryClientProvider>
    </BrowserRouter>
  );
}
