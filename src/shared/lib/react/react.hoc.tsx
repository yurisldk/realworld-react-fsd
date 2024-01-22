import { FC, SuspenseProps, Suspense } from 'react';

export function withSuspense<WrappedProps extends Object>(
  WrappedComponent: FC<WrappedProps>,
  suspenseProps: SuspenseProps,
): FC<WrappedProps> {
  const WrapperComponent = (props: WrappedProps) => {
    return (
      <Suspense {...suspenseProps}>
        <WrappedComponent {...props} />
      </Suspense>
    );
  };
  return WrapperComponent;
}
