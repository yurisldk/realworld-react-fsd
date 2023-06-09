/* eslint-disable @typescript-eslint/dot-notation */
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { realworldApi } from '~shared/api/realworld';
import {
  addUser,
  deleteToken,
  sessionStore,
  useAuth,
  useCurrentUser,
} from './sessionModel';

const initialUser = {
  email: 'example@example.com',
  token: 'abc123',
  username: 'exampleUser',
  bio: 'Example bio',
  image: 'example.jpg',
};

const emptySession = JSON.stringify({ state: { user: null }, version: 0 });
const initSession = JSON.stringify({
  state: { user: initialUser },
  version: 0,
});

const spySetItem = vi.spyOn(Storage.prototype, 'setItem');
const spySetSecurityData = vi.spyOn(realworldApi, 'setSecurityData');
const spySetState = vi.spyOn(sessionStore, 'setState');
const spyAddUser = vi.spyOn(sessionStore.getState(), 'addUser');
const deleteUser = vi.spyOn(sessionStore.getState(), 'deleteUser');

afterEach(() => {
  vi.clearAllMocks();
  localStorage.removeItem('session');
});

describe('sessionModel', () => {
  it('should not update the security data if localStorage`s `session` key doesn`t exists', () => {
    const stateUser = sessionStore.getState().user;

    expect(spySetItem).toBeCalledTimes(1);
    expect(spySetSecurityData).not.toBeCalled();

    expect(stateUser).toBeNull();
    expect(realworldApi['securityData']).toBeNull();
    expect(localStorage.getItem('session')).toStrictEqual(emptySession);
  });

  it('should update the security data if user exists in localStorage`s `session` key', async () => {
    expect(spySetItem).toBeCalledTimes(1);

    localStorage.setItem('session', initSession);
    expect(spySetItem).toBeCalledTimes(2);

    await sessionStore.persist.rehydrate();
    expect(spySetState).toBeCalledTimes(1);
    expect(spySetItem).toBeCalledTimes(3);
    expect(spySetSecurityData).toBeCalledTimes(1);

    const stateUser = sessionStore.getState().user;

    expect(stateUser).toStrictEqual(initialUser);
    expect(realworldApi['securityData']).toEqual(stateUser?.token);
    expect(localStorage.getItem('session')).toStrictEqual(initSession);
  });

  it('addUser should set the user and update the security data', () => {
    sessionStore.getState().addUser(initialUser);

    expect(spySetSecurityData).toBeCalledTimes(1);
    expect(spySetItem).toBeCalledTimes(2);

    const stateUser = sessionStore.getState().user;

    expect(stateUser).toEqual(initialUser);
    expect(realworldApi['securityData']).toEqual(stateUser?.token);
    expect(localStorage.getItem('session')).toStrictEqual(
      JSON.stringify({
        state: { user: stateUser },
        version: 0,
      }),
    );
  });

  it('deleteUser should set the user to null and update the security data', () => {
    expect(spySetItem).toBeCalledTimes(1);

    sessionStore.getState().addUser(initialUser);
    expect(spySetSecurityData).toBeCalledTimes(1);
    expect(spySetItem).toBeCalledTimes(2);

    sessionStore.getState().deleteUser();
    expect(spySetSecurityData).toBeCalledTimes(2);
    expect(spySetItem).toBeCalledTimes(3);

    const stateUser = sessionStore.getState();

    expect(stateUser.user).toBeNull();
    expect(realworldApi['securityData']).toBeNull();
    expect(localStorage.getItem('session')).toStrictEqual(emptySession);
  });
});

describe('sessionModel hooks', () => {
  it('useAuth', async () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current).toBeFalsy();
    act(() => sessionStore.getState().addUser(initialUser));
    expect(result.current).toBeTruthy();
  });

  it('useCurrentUser', async () => {
    const { result } = renderHook(() => useCurrentUser());

    expect(result.current).toBeNull();
    act(() => sessionStore.getState().addUser(initialUser));
    expect(result.current).toBeDefined();
  });

  it('addUser', async () => {
    renderHook(() => addUser(initialUser));
    expect(spyAddUser).toBeCalledTimes(1);
  });

  it('deleteToken', async () => {
    renderHook(() => deleteToken());
    expect(deleteUser).toBeCalledTimes(1);
  });
});
