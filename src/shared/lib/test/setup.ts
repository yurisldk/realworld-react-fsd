/* eslint-disable import/no-extraneous-dependencies */
import { act, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { StateCreator } from 'zustand';
import { realworldApi } from '~shared/api/realworld';

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

beforeEach(() => {
  realworldApi.setSecurityData('jwt.token');
});

afterEach(() => {
  cleanup();
  act(() => storeResetFns.forEach((resetFn) => resetFn()));
  realworldApi.setSecurityData(null);
  vi.clearAllMocks();
});
