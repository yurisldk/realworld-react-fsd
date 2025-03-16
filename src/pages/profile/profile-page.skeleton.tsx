import { Skeleton } from '~shared/ui/skeleton/skeleton.ui';
import { Stack } from '~shared/ui/stack/stack.ui';

export function ProfileInfoSkeleton() {
  return (
    <Stack direction="column" alignItems="center" spacing={16}>
      <Skeleton variant="circular" width={100} height={100} />
      <Stack direction="column" alignItems="center" spacing={8} style={{ width: '100%' }}>
        <Skeleton width={200} height={26} />
        <Skeleton width={320} height={24} />
        <Skeleton variant="text" width={150} height={28} style={{ alignSelf: 'flex-end' }} />
      </Stack>
    </Stack>
  );
}
