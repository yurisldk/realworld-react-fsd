import { StateCreator, createStore, useStore } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { realworldApi } from '~shared/api/realworld';

type User = {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
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
    realworldApi.setSecurityData(user.token);
  },

  deleteUser: () => {
    set({ user: null }, false, 'session/deleteUser');
    realworldApi.setSecurityData(null);
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
        if (state?.user) {
          const { user } = state;
          if (user) realworldApi.setSecurityData(user.token);
          if (!user) realworldApi.setSecurityData(null);
        }
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
