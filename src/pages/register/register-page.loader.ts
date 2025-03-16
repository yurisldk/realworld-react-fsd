import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { store } from '~shared/store';

export default async function registerPageLoader(args: LoaderFunctionArgs) {
  if (store.getState()?.session?.token) {
    return redirect(pathKeys.home);
  }
  return args;
}
