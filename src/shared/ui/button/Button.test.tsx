import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from './Button';

describe('<Button />', () => {
  it('renders the button with default props', () => {
    render(<Button>Hello</Button>);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('Hello');
    expect(buttonElement).toHaveClass('btn');
    expect(buttonElement).toHaveClass('btn-primary');
    expect(buttonElement).not.toHaveClass('btn-outline');
    expect(buttonElement).not.toHaveClass('btn-md');
  });

  it('renders the button with specified color', () => {
    render(<Button color="secondary">Click me</Button>);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('btn-secondary');
    expect(buttonElement).not.toHaveClass('btn-primary');
  });

  it('renders the button with outline variant', () => {
    render(<Button variant="outline">Submit</Button>);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('btn-outline-primary');
    expect(buttonElement).not.toHaveClass('btn-primary');
  });

  it('renders the button with specified size', () => {
    render(<Button size="lg">Load More</Button>);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('btn-lg');
    expect(buttonElement).not.toHaveClass('btn-md');
  });

  it('calls the onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
