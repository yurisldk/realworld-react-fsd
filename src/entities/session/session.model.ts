import { StateCreator, createStore } from 'zustand';
import {
  DevtoolsOptions,
  PersistOptions,
  devtools,
  persist,
} from 'zustand/middleware';

type Token = string;

type State = {
  token: Token | null;
};

type Actions = {
  updateToken: (token: Token | null) => void;
};

type SessionState = State & Actions;

const createSessionSlice: StateCreator<
  SessionState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  SessionState
> = (set) => ({
  token: null,
  updateToken: (token: Token | null) =>
    set({ token: token || null }, false, 'updateToken'),
});

const persistOptions: PersistOptions<SessionState> = { name: 'session' };
const devtoolsOptions: DevtoolsOptions = { name: 'SessionStore' };

export const sessionStore = createStore<SessionState>()(
  devtools(persist(createSessionSlice, persistOptions), devtoolsOptions),
);

export const hasToken = () => Boolean(sessionStore.getState().token);

export function authorizationHeader() {
  if (hasToken()) {
    return { Authorization: `Bearer ${sessionStore.getState().token}` };
  }
}
