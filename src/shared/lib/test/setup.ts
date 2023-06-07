/* eslint-disable import/no-extraneous-dependencies */
import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { expect, afterEach } from 'vitest';
import { realworldApi } from '~shared/api/realworld';
import { server } from '../msw';

expect.extend(matchers);

beforeAll(() => server.listen());

afterEach(() => {
  cleanup();
  server.resetHandlers();
  realworldApi.setSecurityData(null);
});

afterAll(() => server.close());
