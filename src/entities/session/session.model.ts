import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type SessionState = {
  token: string | null;
  updateToken: (token: string | null) => void;
};

const useSessionStore = create<SessionState>()(
  persist(
    devtools(
      (set) => ({
        token: null,
        updateToken: (token: string | null) => {
          set({ token: token || null }, false, 'session/updateToken');
        },
      }),
      { name: 'Session Store' },
    ),
    { name: 'session' },
  ),
);

export const authorizationHeader: { Authorization: string } = {
  Authorization: '',
};

useSessionStore.subscribe((state) => {
  const authorization = state.token ? `Bearer ${state.token}` : '';
  authorizationHeader.Authorization = authorization;
});

useSessionStore.persist.rehydrate();

export const useAuth = () => useSessionStore((state) => !!state.token);

export const useUpdateToken = () =>
  useSessionStore((state) => state.updateToken);
