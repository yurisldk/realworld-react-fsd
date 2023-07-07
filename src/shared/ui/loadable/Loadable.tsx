import { ElementType, Suspense } from 'react';
import { FullPageWrapper } from '../full-page-wrapper';
import { Spinner } from '../spinner';

export function Loadable(Component: ElementType) {
  return function fn(props: any) {
    return (
      <Suspense
        fallback={
          <FullPageWrapper>
            <Spinner />
          </FullPageWrapper>
        }
      >
        <Component {...props} />
      </Suspense>
    );
  };
}
