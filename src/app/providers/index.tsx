import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from './QueryClientProvider';
import { Router } from './RouterProvider';
import '~shared/main.css';

export function Provider() {
  return (
    <QueryClientProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
