import { StateCreator, StoreApi, createStore, useStore } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Token = string;

type State = {
  token: Token | null;
};

type Actions = {
  updateToken: (token: Token | null) => void;
};

type SessionState = State & Actions;

const initialState: State = { token: null };

const createSessionSlice: StateCreator<
  SessionState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  SessionState
> = (set) => ({
  ...initialState,
  updateToken: (token: Token | null) =>
    set({ token: token || null }, false, 'session/updateToken'),
});

export type SessionStore = StoreApi<SessionState>;
export const sessionStore = createStore<SessionState>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...createSessionSlice(set, get, api),
      }),
      {
        name: 'session',
        skipHydration: true,
      },
    ),
    { name: 'Session Store' },
  ),
);

export const hasToken = () => Boolean(sessionStore.getState().token);

export function authorizationHeader() {
  if (hasToken()) {
    return { Authorization: `Bearer ${sessionStore.getState().token}` };
  }
  return;
}

sessionStore.persist.rehydrate();

function useSessionStore(): SessionState;
function useSessionStore<T>(selector: (state: SessionState) => T): T;
function useSessionStore<T>(selector?: (state: SessionState) => T) {
  return useStore(sessionStore, selector!);
}

export const useUpdateToken = () =>
  useSessionStore((state) => state.updateToken);
