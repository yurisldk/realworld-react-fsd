import { StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createSelectors } from '~shared/lib/zustand'
import { Session } from './session.types'

type State = {
  session: Session | null
}

type Actions = {
  setSession: (session: Session) => void
  resetSession: () => void
}

function createSessionSlice() {
  const sessionSlice: StateCreator<
    State & Actions,
    [['zustand/devtools', never]],
    [],
    State & Actions
  > = (set) => ({
    session: null,
    setSession: (session: Session) => set({ session }, false, 'setSession'),
    resetSession: () => set({ session: null }, false, 'resetSession'),
  })
  return sessionSlice
}

const slice = createSessionSlice()
const withDevtools = devtools(slice, { name: 'Session Service' })
const store = create(withDevtools)
export const useSessionStore = createSelectors(store)
