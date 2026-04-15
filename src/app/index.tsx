import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { queryClient } from '~shared/api/queryClient';
import { browserRouter } from './browser-router';
import './main.css';

async function startApp() {
  const router = browserRouter();
  let devtools = null;

  if (__NODE_ENV__ === 'development') {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const { ReactQueryDevtools } = await import('@tanstack/react-query-devtools');
    devtools = <ReactQueryDevtools initialIsOpen={false} />;
  }

  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Root element not found');
  }

  const root = createRoot(container);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {devtools}
    </QueryClientProvider>,
  );
}

async function bootstrap() {
  try {
    await startApp();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Bootstrap failed', error);

    const container = document.getElementById('root');
    if (container) {
      const root = createRoot(container);
      root.render(
        <div>
          <h1>Application unavailable</h1>
          <p>Failed to initialize application</p>
        </div>,
      );
    }
  }
}

bootstrap();
