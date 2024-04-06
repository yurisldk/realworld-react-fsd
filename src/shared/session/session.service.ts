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
  updateToken: (token: Token | null) => void;
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
  updateToken: (token: Token | null) =>
    set({ token: token || null }, false, 'updateToken'),
});

const persistOptions: PersistOptions<SessionState> = { name: 'session' };
const devtoolsOptions: DevtoolsOptions = { name: 'SessionStore' };

const sessionStore = createStore<SessionState>()(
  devtools(
    persist(subscribeWithSelector(createSessionSlice), persistOptions),
    devtoolsOptions,
  ),
);

export const hasToken = () => Boolean(sessionStore.getState().token);

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
