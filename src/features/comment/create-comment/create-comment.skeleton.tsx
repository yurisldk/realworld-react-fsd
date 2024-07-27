import { Skeleton } from '~shared/ui/skeleton'
import { Stack } from '~shared/ui/stack'

export function CreateCommentFormSkeleton() {
  return (
    <Stack
      direction="column"
      spacing={0}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height={100}
      />
      <div className="card-footer">
        <Stack
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Skeleton
            variant="circular"
            width={30}
            height={30}
          />

          <Skeleton
            height={27}
            width={108}
          />
        </Stack>
      </div>
    </Stack>
  )
}
