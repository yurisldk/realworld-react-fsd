import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import * as mockedZustand from './__mocks__/zustand'
import '@testing-library/jest-dom/vitest'

type Zustand = typeof import('zustand')
vi.mock('zustand', async (importOriginal): Promise<Zustand> => {
  const zustand = await importOriginal<Zustand>()
  return {
    ...zustand,
    ...mockedZustand,
  }
})

type ReactRouterDom = typeof import('react-router-dom')
vi.mock('react-router-dom', async (importOriginal): Promise<ReactRouterDom> => {
  const reactRouterDom = await importOriginal<ReactRouterDom>()
  return {
    ...reactRouterDom,
    useNavigate: vi.fn().mockImplementation(reactRouterDom.useNavigate),
    useLocation: vi.fn().mockImplementation(reactRouterDom.useLocation),
  }
})

afterEach(() => {
  vi.clearAllMocks()
  cleanup()
})
