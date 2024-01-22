import { StateCreator } from 'zustand';

export type State<Literals> = {
  tab: Literals;
};

export type Actions<Literals> = {
  changeTab: (tab: Literals) => void;
};

export type TabState<Literals> = State<Literals> & Actions<Literals>;
export const createTabSlice = <Literals>(
  initialState: State<Literals>,
): StateCreator<
  TabState<Literals>,
  [['zustand/devtools', never]],
  [],
  TabState<Literals>
> => {
  return (set) => ({
    ...initialState,
    changeTab: (tab: Literals) => set({ tab }, false, 'changeTab'),
  });
};
