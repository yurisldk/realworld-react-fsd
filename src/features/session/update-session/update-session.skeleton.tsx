import { Skeleton } from '~shared/ui/skeleton'
import { Stack } from '~shared/ui/stack'

export function UpdateSessionFormSkeleton() {
  return (
    <Stack
      direction="column"
      spacing={16}
    >
      <Skeleton
        width="100%"
        height={38}
      />

      <Skeleton
        width="100%"
        height={51}
      />

      <Skeleton
        width="100%"
        height={226}
      />

      <Skeleton
        width="100%"
        height={51}
      />

      <Skeleton
        width="100%"
        height={38}
      />

      <Skeleton
        style={{ alignSelf: 'flex-end' }}
        width={183}
        height={51}
      />
    </Stack>
  )
}
