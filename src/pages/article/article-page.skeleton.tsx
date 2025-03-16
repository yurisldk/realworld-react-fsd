/* eslint-disable react/no-array-index-key */
import { Skeleton } from '~shared/ui/skeleton/skeleton.ui';
import { Stack } from '~shared/ui/stack/stack.ui';

export function ArticlePageSkeleton() {
  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <Skeleton variant="text" height="40px" width="100%" />

          <Stack style={{ marginTop: '32px' }} spacing={2} alignItems="center">
            <Skeleton variant="circular" width={32} height={32} />

            <Stack direction="column" spacing={2}>
              <Skeleton variant="text" height={12} width={100} />

              <Skeleton variant="text" height={12} width={60} />
            </Stack>

            <Skeleton style={{ marginLeft: '24px' }} width={180} height={27} />
            <Skeleton width={180} height={27} />
          </Stack>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div>
              {new Array(25).fill(0).map((_, idx, array) => (
                <Skeleton key={idx} variant="text" height="24px" width={array.length - 1 === idx ? '60%' : '100%'} />
              ))}
            </div>
            <Stack spacing={4} style={{ margin: '32px 0 16px' }}>
              {new Array(4).fill(0).map((_, idx) => (
                <Skeleton key={idx} variant="rounded" width={70} />
              ))}
            </Stack>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <Stack justifyContent="center" alignItems="center" spacing={2}>
            <Skeleton variant="circular" width={32} height={32} />

            <Stack direction="column" spacing={2}>
              <Skeleton variant="text" height={12} width={100} />

              <Skeleton variant="text" height={12} width={60} />
            </Stack>

            <Skeleton style={{ marginLeft: '24px' }} width={180} height={27} />
            <Skeleton width={180} height={27} />
          </Stack>
        </div>
      </div>
    </div>
  );
}
