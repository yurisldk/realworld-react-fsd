import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { authorizationHeader, useAuth, useUpdateToken } from '../session.model';

const token = 'jwt.token';
const emptyHeader = { Authorization: '' };
const filledHeader = { Authorization: `Bearer ${token}` };

const spySetItem = vi.spyOn(Storage.prototype, 'setItem');

afterEach(() => {
  localStorage.removeItem('session');
});

describe('sessionModel', () => {
  it('should execute the default script', () => {
    const { result: updateToken } = renderHook(() => useUpdateToken());
    const { result: isAuth } = renderHook(() => useAuth());

    expect(spySetItem).not.toBeCalled();
    expect(isAuth.current).toBeFalsy();
    expect(authorizationHeader).toEqual(emptyHeader);

    act(() => updateToken.current(token));
    expect(spySetItem).toBeCalledTimes(1);
    expect(isAuth.current).toBeTruthy();
    expect(authorizationHeader).toEqual(filledHeader);

    act(() => updateToken.current(null));
    expect(spySetItem).toBeCalledTimes(2);
    expect(isAuth.current).toBeFalsy();
    expect(authorizationHeader).toEqual(emptyHeader);
  });
});
