import { StateCreator, createStore, useStore } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { conduitApi } from '~shared/api';

type User = {
  email: string;
  token: string;
  username: string;
  bio?: string | null;
  image?: string | null;
};

type SessionState = {
  user: User | null;
  addUser: (user: User) => void;
  deleteUser: () => void;
};

const createSessionSlice: StateCreator<
  SessionState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  SessionState
> = (set) => ({
  user: null,

  addUser: (user: User) => {
    set({ user }, false, 'session/addUser');
    conduitApi.setToken(user.token);
  },

  deleteUser: () => {
    set({ user: null }, false, 'session/deleteUser');
    conduitApi.deleteToken();
  },
});

export const sessionStore = createStore<SessionState>()(
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

        const { user } = state;
        if (user) conduitApi.setToken(user.token);
        if (!user) conduitApi.deleteToken();
      },
    },
  ),
);

export const useAuth = () =>
  useStore(sessionStore, (state) => !!state.user?.token);

export const useCurrentUser = () =>
  useStore(sessionStore, (state) => state.user);

export const addUser = (user: User) => sessionStore.getState().addUser(user);

export const deleteToken = () => sessionStore.getState().deleteUser();
