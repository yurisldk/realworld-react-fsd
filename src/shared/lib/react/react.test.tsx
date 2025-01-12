import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  lazy,
} from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { withSuspense } from './react.hoc'

describe('withSuspense HOC', () => {
  it('renders the synchronous component correctly without fallback', async () => {
    render(<SyncComponentWithSuspense />)

    await waitFor(() =>
      expect(screen.getByTestId(MOCK_COMPONENT_TEST_ID)).toBeInTheDocument(),
    )
  })

  it('renders the fallback when the lazy component is suspended (JSX fallback)', async () => {
    render(<LazyComponentWithJSXFallback />)

    await waitFor(() =>
      expect(
        screen.getByTestId(FALLBACK_COMPONENT_TEST_ID),
      ).toBeInTheDocument(),
    )
  })

  it('renders the FallbackComponent when the lazy component is suspended (Component fallback)', async () => {
    render(<LazyComponentWithFallbackComponent />)

    await waitFor(() =>
      expect(
        screen.getByTestId(FALLBACK_COMPONENT_TEST_ID),
      ).toBeInTheDocument(),
    )
  })

  it('forwards the ref to the wrapped component', async () => {
    const ref = React.createRef<HTMLDivElement>()

    render(<SyncComponentWithSuspense ref={ref} />)

    await waitFor(() =>
      expect(screen.getByTestId(MOCK_COMPONENT_TEST_ID)).toBeInTheDocument(),
    )

    expect(ref.current).toBeInTheDocument()
  })
})

const MOCK_COMPONENT_TEST_ID = 'mock-component'
const FALLBACK_COMPONENT_TEST_ID = 'fallback-component'

const FallbackComponent = () => <div data-testid={FALLBACK_COMPONENT_TEST_ID} />

const MockComponent = forwardRef(
  (
    props: ComponentPropsWithoutRef<'div'>,
    ref?: ForwardedRef<HTMLDivElement>,
  ) => (
    <div
      ref={ref}
      {...props}
      data-testid={MOCK_COMPONENT_TEST_ID}
    />
  ),
)

const LazyMockComponent = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>((resolve) => {
      setTimeout(() => resolve({ default: MockComponent }), 500)
    }),
)

const SyncComponentWithSuspense = withSuspense(MockComponent, {
  FallbackComponent,
})
const LazyComponentWithFallbackComponent = withSuspense(LazyMockComponent, {
  FallbackComponent,
})
const LazyComponentWithJSXFallback = withSuspense(LazyMockComponent, {
  fallback: <FallbackComponent />,
})
