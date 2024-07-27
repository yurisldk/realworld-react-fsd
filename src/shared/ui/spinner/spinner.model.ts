import { StateCreator, create } from 'zustand'
import { DevtoolsOptions, devtools } from 'zustand/middleware'
import { createSelectors } from '~shared/lib/zustand'

export type SpinnerModel = ReturnType<typeof createSpinnerModel>
export function createSpinnerModel(config: {
  initialState?: State
  devtoolsOptions: DevtoolsOptions
}) {
  const { initialState = { display: false }, devtoolsOptions } = config

  const slice = createSpinnerSlice(initialState)
  const withDevtools = devtools(slice, devtoolsOptions)
  const store = create(withDevtools)
  const useTabsStore = createSelectors(store)

  return useTabsStore
}

export const globalSpinner = createSpinnerModel({
  devtoolsOptions: { name: 'Global Spinner' },
})

function createSpinnerSlice(initialState: State) {
  const spinnerSlice: StateCreator<
    State & Actions,
    [['zustand/devtools', never], ['zustand/subscribeWithSelector', never]],
    [],
    State & Actions
  > = (set) => ({
    ...initialState,

    show() {
      set({ display: true }, false, 'show')
    },

    hide() {
      set({ display: false }, false, 'hide')
    },
  })

  return spinnerSlice
}

type State = {
  display: boolean
}

type Actions = {
  show(): void
  hide(): void
}
