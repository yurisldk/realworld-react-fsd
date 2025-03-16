/* eslint-disable react/no-array-index-key */
import { Skeleton } from '~shared/ui/skeleton/skeleton.ui';
import { Stack } from '~shared/ui/stack/stack.ui';

export function ArticlesFeedSkeleton() {
  return new Array(5).fill(0).map((_, idx) => (
    <div key={idx} className="article-preview">
      <Stack direction="column" spacing={16}>
        <Stack spacing={2} alignItems="center">
          <Skeleton variant="circular" width={32} height={32} />

          <Stack direction="column" spacing={2}>
            <Skeleton variant="text" width={100} />

            <Skeleton variant="text" width={60} />
          </Stack>

          <Skeleton width={55} height={27} style={{ marginLeft: 'auto' }} />
        </Stack>

        <Stack direction="column" spacing={4}>
          <TitleSkeleton />
          <DescriptionSkeleton />
        </Stack>

        <Stack justifyContent="space-between">
          <Skeleton width={64} />

          <TagsSkeleton />
        </Stack>
      </Stack>
    </div>
  ));
}

function TitleSkeleton() {
  return (
    <Stack direction="column" spacing={2}>
      <Skeleton variant="text" height="24px" width="100%" />
    </Stack>
  );
}

function DescriptionSkeleton() {
  return (
    <Stack direction="column" spacing={2}>
      {new Array(4).fill(0).map((_, idx, array) => (
        <Skeleton key={idx} variant="text" width={array.length - 1 === idx ? '60%' : '100%'} />
      ))}
    </Stack>
  );
}

function TagsSkeleton() {
  return (
    <Stack spacing={4}>
      {new Array(4).fill(0).map((_, idx) => (
        <Skeleton key={idx} variant="rounded" width={45} />
      ))}
    </Stack>
  );
}
