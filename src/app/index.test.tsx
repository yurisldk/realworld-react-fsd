import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from './providers';

describe('something truthy and falsy', () => {
  it('true to be true', () => {
    expect(true).toBe(true);
  });

  it('false to be false', () => {
    expect(false).toBe(false);
  });
});

describe('App', () => {
  it('debug', () => {
    render(<Provider />);

    screen.debug();
  });
});
