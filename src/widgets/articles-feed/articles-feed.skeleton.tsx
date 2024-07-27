/* eslint-disable react/no-array-index-key */
import { getRandomNumber } from '~shared/lib/math'
import { Skeleton } from '~shared/ui/skeleton'
import { Stack } from '~shared/ui/stack'

export function ArticlesFeedSkeleton() {
  return new Array(10).fill(0).map((_, idx) => (
    <div
      key={idx}
      className="article-preview"
    >
      <Stack
        direction="column"
        spacing={16}
      >
        <Stack
          spacing={2}
          alignItems="center"
        >
          <Skeleton
            variant="circular"
            width={32}
            height={32}
          />

          <Stack
            direction="column"
            spacing={2}
          >
            <Skeleton
              variant="text"
              width={getRandomNumber({ min: 80, max: 120 })}
            />

            <Skeleton
              variant="text"
              width={getRandomNumber({ min: 50, max: 70 })}
            />
          </Stack>

          <Skeleton
            width={55}
            height={27}
            style={{ marginLeft: 'auto' }}
          />
        </Stack>

        <Stack
          direction="column"
          spacing={4}
        >
          <TitleSkeleton />
          <DescriptionSkeleton />
        </Stack>

        <Stack justifyContent="space-between">
          <Skeleton width={64} />

          <TagsSkeleton />
        </Stack>
      </Stack>
    </div>
  ))
}

function TitleSkeleton() {
  return (
    <Stack
      direction="column"
      spacing={2}
    >
      {new Array(getRandomNumber({ min: 1, max: 2 }))
        .fill(0)
        .map((_, idx, array) => (
          <Skeleton
            key={idx}
            variant="text"
            height="24px"
            width={
              array.length - 1 === idx
                ? `${getRandomNumber({ min: 20, max: 80 })}%`
                : '100%'
            }
          />
        ))}
    </Stack>
  )
}

function DescriptionSkeleton() {
  return (
    <Stack
      direction="column"
      spacing={2}
    >
      {new Array(getRandomNumber({ min: 3, max: 5 }))
        .fill(0)
        .map((_, idx, array) => (
          <Skeleton
            key={idx}
            variant="text"
            width={
              array.length - 1 === idx
                ? `${getRandomNumber({ min: 20, max: 80 })}%`
                : '100%'
            }
          />
        ))}
    </Stack>
  )
}

function TagsSkeleton() {
  return (
    <Stack spacing={4}>
      {new Array(getRandomNumber({ min: 3, max: 5 })).fill(0).map((_, idx) => (
        <Skeleton
          key={idx}
          variant="rounded"
          width={getRandomNumber({ min: 30, max: 90 })}
        />
      ))}
    </Stack>
  )
}
