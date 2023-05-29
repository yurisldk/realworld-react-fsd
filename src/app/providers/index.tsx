import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from './QueryClientProvider';
import { Router } from './RouterProvider';

export function Provider() {
  return (
    <QueryClientProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
