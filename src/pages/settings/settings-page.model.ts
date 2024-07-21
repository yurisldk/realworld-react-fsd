import { LoaderFunctionArgs, redirect } from 'react-router-dom'
import { pathKeys } from '~shared/lib/react-router'
import { useSessionStore } from '~shared/session'

export class SettingsLoader {
  static async settingsPage(args: LoaderFunctionArgs) {
    if (useSessionStore.getState().session) {
      return args
    }
    return redirect(pathKeys.login())
  }
}
