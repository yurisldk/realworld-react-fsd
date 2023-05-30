import { StateCreator, createStore, useStore } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { conduitApi } from '~shared/api';

type Token = string;

type SessionState = {
  token: Token | null;
  addToken: (token: Token) => void;
  deleteToken: () => void;
};

const createSessionSlice: StateCreator<
  SessionState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  SessionState
> = (set) => ({
  token: null,

  addToken: (token: Token) => {
    set({ token }, false, 'session/addToken');
    conduitApi.setToken(token);
  },

  deleteToken: () => {
    set({ token: null }, false, 'session/deleteToken');
    conduitApi.deleteToken();
  },
});

const sessionStore = createStore<SessionState>()(
  persist(
    devtools(
      (...a) => ({
        ...createSessionSlice(...a),
      }),
      { name: 'Session Store' },
    ),
    {
      name: 'session',
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const { token } = state;
        if (token) conduitApi.setToken(token);
        if (!token) conduitApi.deleteToken();
      },
    },
  ),
);

export const useAuth = () => useStore(sessionStore, (state) => !!state.token);

export const addToken = (token: string) =>
  sessionStore.getState().addToken(token);

export const deleteToken = () => sessionStore.getState().deleteToken();
