import { Skeleton } from '~shared/ui/skeleton'
import { Stack } from '~shared/ui/stack'

export function UpdateArticleSkeleton() {
  return (
    <Stack
      direction="column"
      spacing={16}
    >
      <Skeleton
        height={51}
        width="100%"
      />

      <Skeleton
        height={38}
        width="100%"
      />

      <Skeleton
        height={178}
        width="100%"
      />

      <Skeleton
        height={38}
        width="100%"
      />

      <Stack>
        <Skeleton
          width={168}
          height={51}
          style={{ marginLeft: 'auto' }}
        />
      </Stack>
    </Stack>
  )
}
