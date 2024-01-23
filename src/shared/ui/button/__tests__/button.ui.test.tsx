import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from '../button.ui';

describe('<Button />', () => {
  it('renders the button with default props', () => {
    render(<Button>Hello</Button>);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDefined();
    expect(buttonElement.textContent).toContain('Hello');
    expect(buttonElement.classList).toContain('btn');
    expect(buttonElement.classList).toContain('btn-primary');
    expect(buttonElement.classList).not.toContain('btn-outline');
    expect(buttonElement.classList).not.toContain('btn-md');
  });

  it('renders the button with specified color', () => {
    render(<Button color="secondary">Click me</Button>);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement.classList).toContain('btn-secondary');
    expect(buttonElement.classList).not.toContain('btn-primary');
  });

  it('renders the button with outline variant', () => {
    render(<Button variant="outline">Submit</Button>);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement.classList).toContain('btn-outline-primary');
    expect(buttonElement.classList).not.toContain('btn-primary');
  });

  it('renders the button with specified size', () => {
    render(<Button size="lg">Load More</Button>);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement.classList).toContain('btn-lg');
    expect(buttonElement.classList).not.toContain('btn-md');
  });

  it('calls the onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
