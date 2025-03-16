import type { PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { rootReducer } from '~shared/store';
import { User } from './session.types';

type State = User | null;

const sessionSlice = createSlice({
  name: 'session',
  initialState: null as State,
  reducers: {
    setSession: (_state, action: PayloadAction<State>) => action.payload,
    resetSession: () => null,
  },
  selectors: {
    selectSession: (state) => state,
  },
});

export const { setSession, resetSession } = sessionSlice.actions;

declare module '~shared/store' {
  export interface LazyLoadedSlices extends WithSlice<typeof sessionSlice> {}
}

const injectedSessionSlice = sessionSlice.injectInto(rootReducer);

export const { selectSession } = injectedSessionSlice.selectors;
