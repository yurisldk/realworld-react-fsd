import { useRouteError, LoaderFunctionArgs, redirect } from 'react-router-dom';
import { sessionModel } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';

// https://github.com/remix-run/react-router/discussions/10166
export function BubbleError() {
  const error = useRouteError();
  if (error) throw error;
  return null;
}

export function guestLoader(args: LoaderFunctionArgs) {
  if (sessionModel.hasToken()) return redirect(pathKeys.home());
  return args;
}

export function unknownLoader() {
  return redirect(pathKeys.page404());
}
