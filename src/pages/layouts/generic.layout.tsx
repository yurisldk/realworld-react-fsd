import { useSessionStore } from '~shared/session'
import { GuestLayout } from './guest.layout'
import { UserLayout } from './user.layout'

export function GenericLayout() {
  return useSessionStore.use.session() ? <UserLayout /> : <GuestLayout />
}
