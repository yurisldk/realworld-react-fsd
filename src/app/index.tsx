import ReactDOM from 'react-dom/client';
import { authHeaderService } from '~shared/api';
import { sessionService } from '~shared/session';
import { Provider } from './providers';

const tokenSetEventHandler =
  authHeaderService.tokenSetEventHandler.bind(authHeaderService);

const tokenResetEventHandler =
  authHeaderService.tokenResetEventHandler.bind(authHeaderService);

sessionService.onTokenSet(tokenSetEventHandler);
sessionService.onTokenReset(tokenResetEventHandler);

sessionService.init();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider />,
);
