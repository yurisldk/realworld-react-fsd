import { StateCreator, create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createSelectors } from '../lib/zustand'
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
    [['zustand/devtools', never], ['zustand/persist', unknown]],
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
const withPersist = persist(slice, { name: 'session' })
const withDevtools = devtools(withPersist, { name: 'Session Service' })
const store = create(withDevtools)
export const useSessionStore = createSelectors(store)
