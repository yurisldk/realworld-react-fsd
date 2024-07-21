import { StateCreator, create } from 'zustand'
import { DevtoolsOptions, devtools } from 'zustand/middleware'
import { createSelectors } from '~shared/lib/zustand'
import { articleTypes } from '~entities/article'

export type ArticleFilterStore = ReturnType<typeof createArticleFilterStore>
export function createArticleFilterStore(config: {
  initialState?: Partial<State>
  devtoolsOptions: DevtoolsOptions
}) {
  const { initialState, devtoolsOptions } = config

  const slice = createArticleFilterSlice(initialState)
  const withDevtools = devtools(slice, devtoolsOptions)
  const store = create(withDevtools)
  const useArticleFilterStore = createSelectors(store)

  return useArticleFilterStore
}

function createArticleFilterSlice(initialState?: Partial<State>) {
  const articleFilterSlice: StateCreator<
    State & Actions,
    [['zustand/devtools', never]],
    [],
    State & Actions
  > = (set) => ({
    ...defaultState,
    ...initialState,

    setTag(tag: string | null) {
      set({ tag }, false, `setTag ${tag}`)
    },

    setAuthor(author: string | null) {
      set({ author }, false, `setAuthor ${author}`)
    },

    setFavorited(favorited: string | null) {
      set({ favorited }, false, `setFavorited ${favorited}`)
    },

    reset() {
      set({ ...defaultState, ...initialState }, false, 'reset')
    },
  })

  return articleFilterSlice
}

const defaultState: State = {
  limit: 10,
  offset: 0,
  author: null,
  favorited: null,
  tag: null,
}

type State = articleTypes.FilterQuery

type Actions = {
  setTag(tag: string | null): void
  setAuthor(author: string | null): void
  setFavorited(favorited: string | null): void
  reset(): void
}
