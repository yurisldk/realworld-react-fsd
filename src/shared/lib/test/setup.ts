/* eslint-disable import/no-extraneous-dependencies */
import matchers from '@testing-library/jest-dom/matchers';
import { act, cleanup } from '@testing-library/react';
import { expect, afterEach, vi } from 'vitest';
import { StateCreator } from 'zustand';
import { realworldApi } from '~shared/api/realworld';
import { server } from '../msw';

type ZustandModel = typeof import('zustand');

const storeResetFns = vi.hoisted(() => new Set<() => void>());

vi.mock('zustand', async (zustandOriginal: () => Promise<ZustandModel>) => {
  const zustand = await zustandOriginal();

  const createStore =
    () =>
    <S>(createState: StateCreator<S>) => {
      const store = zustand.createStore(createState);
      const initialState = store.getState();
      storeResetFns.add(() => store.setState(initialState, true));
      return store;
    };

  return { ...zustand, createStore };
});

expect.extend(matchers);

beforeAll(() => server.listen());

beforeEach(() => {
  act(() => storeResetFns.forEach((resetFn) => resetFn()));
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  realworldApi.setSecurityData(null);
  vi.clearAllMocks();
});

afterAll(() => server.close());
