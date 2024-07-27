import { LoaderFunctionArgs, redirect } from 'react-router-dom'
import { pathKeys } from '~shared/lib/react-router'
import { useSessionStore } from '~shared/session'

export class RegisterLoader {
  static async registerPage(args: LoaderFunctionArgs) {
    if (useSessionStore.getState().session) {
      return redirect(pathKeys.home())
    }
    return args
  }
}
