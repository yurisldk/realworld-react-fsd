import { afterEach, jest } from '@jest/globals';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';

jest.mock('../../api/api.instance', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      response: {
        use: jest.fn(),
      },
    },
  },
}));

type ReactRouterDom = typeof import('react-router-dom');
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual<ReactRouterDom>('react-router-dom');
  return {
    ...originalModule,
    useNavigate: jest.fn().mockImplementation(originalModule.useNavigate),
    useLocation: jest.fn().mockImplementation(originalModule.useLocation),
  };
});

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});
