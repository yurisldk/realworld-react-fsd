import { StateCreator, createStore } from 'zustand';
import {
  DevtoolsOptions,
  PersistOptions,
  devtools,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';

type UnsubscribeFunction = () => void;

type Token = string;

type State = {
  token: Token | null;
};

type Actions = {
  setToken: (token: Token) => void;
  resetToken: () => void;
};

type SessionState = State & Actions;

const createSessionSlice: StateCreator<
  SessionState,
  [
    ['zustand/devtools', never],
    ['zustand/persist', unknown],
    ['zustand/subscribeWithSelector', never],
  ],
  [],
  SessionState
> = (set) => ({
  token: null,
  setToken: (token: Token) => set({ token }, false, 'setToken'),
  resetToken: () => set({ token: null }, false, 'resetToken'),
});

const persistOptions: PersistOptions<SessionState> = {
  name: 'session',
  skipHydration: true,
};
const devtoolsOptions: DevtoolsOptions = { name: 'Session Service' };

const sessionStore = createStore<SessionState>()(
  devtools(
    persist(subscribeWithSelector(createSessionSlice), persistOptions),
    devtoolsOptions,
  ),
);

export function hasToken() {
  return Boolean(sessionStore.getState().token);
}

export function setToken(token: Token) {
  sessionStore.getState().setToken(token);
}

export function resetToken() {
  sessionStore.getState().resetToken();
}

export async function init() {
  return sessionStore.persist.rehydrate();
}

export function onTokenSet(
  tokenSetEventHandler: (token: Token) => void,
): UnsubscribeFunction {
  const unsubscribe = sessionStore.subscribe(
    (state) => state.token,
    (token) => {
      if (token) {
        tokenSetEventHandler(token);
      }
    },
  );
  return unsubscribe;
}

export function onTokenReset(
  tokenResetEventHandler: VoidFunction,
): UnsubscribeFunction {
  const unsubscribe = sessionStore.subscribe(
    (state) => state.token,
    (token) => {
      if (!token) {
        tokenResetEventHandler();
      }
    },
  );
  return unsubscribe;
}
