import { beforeEach, describe, expect, it } from 'vitest'
import {
  ArticleFilterStore,
  createArticleFilterStore,
} from './filter-article.model'

describe('ArticleFilterStore', () => {
  let store: ArticleFilterStore

  beforeEach(() => {
    store = createArticleFilterStore({
      initialState: {},
      devtoolsOptions: { name: 'TestArticleFilterStore' },
    })
  })

  it('should initialize with default state', () => {
    const state = store.getState()

    expect(state.limit).toBe(10)
    expect(state.offset).toBe(0)
    expect(state.author).toBeNull()
    expect(state.favorited).toBeNull()
    expect(state.tag).toBeNull()
  })

  it('should set tag correctly', () => {
    store.getState().setTag('react')

    const state = store.getState()
    expect(state.tag).toBe('react')
  })

  it('should set author correctly', () => {
    store.getState().setAuthor('john')

    const state = store.getState()
    expect(state.author).toBe('john')
  })

  it('should set favorited correctly', () => {
    store.getState().setFavorited('react-fan')

    const state = store.getState()
    expect(state.favorited).toBe('react-fan')
  })

  it('should reset to default state', () => {
    store.getState().setTag('react')
    store.getState().setAuthor('john')
    store.getState().setFavorited('react-fan')
    store.getState().reset()

    const state = store.getState()
    expect(state.limit).toBe(10)
    expect(state.offset).toBe(0)
    expect(state.author).toBeNull()
    expect(state.favorited).toBeNull()
    expect(state.tag).toBeNull()
  })
})
