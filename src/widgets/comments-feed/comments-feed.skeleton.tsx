/* eslint-disable react/no-array-index-key */
import { getRandomNumber } from '~shared/lib/math'
import { Skeleton } from '~shared/ui/skeleton'
import { Stack } from '~shared/ui/stack'

export function CommentsListSkeleton() {
  return new Array(getRandomNumber({ min: 3, max: 5 }))
    .fill(0)
    .map((_, idx) => (
      <div
        key={idx}
        className="card"
      >
        <div className="card-block">
          <Skeleton
            variant="text"
            width={`${getRandomNumber({ min: 20, max: 95 })}%`}
          />
        </div>
        <div className="card-footer">
          <Stack
            alignItems="center"
            spacing={2}
          >
            <Skeleton
              variant="circular"
              width={20}
              height={20}
            />

            <Skeleton
              variant="text"
              height={12}
              width={getRandomNumber({ min: 80, max: 120 })}
            />

            <Skeleton
              variant="text"
              height={26}
              width={0}
            />

            <Skeleton
              variant="text"
              height={12}
            />
          </Stack>
        </div>
      </div>
    ))
}
