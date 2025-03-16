/* eslint-disable react/no-array-index-key */
import { Skeleton } from '~shared/ui/skeleton/skeleton.ui';
import { Stack } from '~shared/ui/stack/stack.ui';

export function CommentsListSkeleton() {
  return new Array(4).fill(0).map((_, idx) => (
    <div key={idx} className="card">
      <div className="card-block">
        <Skeleton variant="text" width="80%" />
      </div>
      <div className="card-footer">
        <Stack alignItems="center" spacing={2}>
          <Skeleton variant="circular" width={20} height={20} />

          <Skeleton variant="text" height={12} width={100} />

          <Skeleton variant="text" height={26} width={0} />

          <Skeleton variant="text" height={12} />
        </Stack>
      </div>
    </div>
  ));
}
