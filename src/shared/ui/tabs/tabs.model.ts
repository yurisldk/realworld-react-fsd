import { StateCreator, create } from 'zustand'
import { DevtoolsOptions, devtools } from 'zustand/middleware'
import { createSelectors } from '~shared/lib/zustand'

export type TabsStore = ReturnType<typeof createTabsStore>
export function createTabsStore(config: {
  initialState: TabsState
  devtoolsOptions: DevtoolsOptions
}) {
  const { initialState, devtoolsOptions } = config

  const slice = createTabsSlice(initialState)
  const withDevtools = devtools(slice, devtoolsOptions)
  const store = create(withDevtools)
  const useTabsStore = createSelectors(store)

  return useTabsStore
}

function createTabsSlice(initialState: TabsState) {
  const tabsSlice: StateCreator<
    TabsState & Actions,
    [['zustand/devtools', never]],
    [],
    TabsState & Actions
  > = (set) => ({
    ...initialState,

    setTab(tab: string) {
      set({ tab }, false, `setTab ${tab}`)
    },

    reset() {
      set({ ...initialState }, false, 'reset')
    },
  })

  return tabsSlice
}

export type TabsState = {
  tab: string
}

type Actions = {
  setTab(tab: string): void
  reset(): void
}
