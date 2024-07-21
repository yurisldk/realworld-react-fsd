/* eslint-disable react/no-array-index-key */
import { getRandomNumber } from '~shared/lib/math'
import { Skeleton } from '~shared/ui/skeleton'
import { Stack } from '~shared/ui/stack'

export function ArticlePageSkeleton() {
  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <Skeleton
            variant="text"
            height="40px"
            width="100%"
          />

          <Stack
            style={{ marginTop: '32px' }}
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
                height={12}
                width={getRandomNumber({ min: 80, max: 120 })}
              />

              <Skeleton
                variant="text"
                height={12}
                width={getRandomNumber({ min: 50, max: 70 })}
              />
            </Stack>

            <Skeleton
              style={{ marginLeft: '24px' }}
              width={180}
              height={27}
            />
            <Skeleton
              width={180}
              height={27}
            />
          </Stack>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div>
              {new Array(getRandomNumber({ min: 15, max: 30 }))
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
            </div>
            <Stack
              spacing={4}
              style={{ margin: '32px 0 16px' }}
            >
              {new Array(getRandomNumber({ min: 3, max: 5 }))
                .fill(0)
                .map((_, idx) => (
                  <Skeleton
                    key={idx}
                    variant="rounded"
                    width={getRandomNumber({ min: 30, max: 90 })}
                  />
                ))}
            </Stack>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <Stack
            justifyContent="center"
            alignItems="center"
            spacing={2}
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
                height={12}
                width={getRandomNumber({ min: 80, max: 120 })}
              />

              <Skeleton
                variant="text"
                height={12}
                width={getRandomNumber({ min: 50, max: 70 })}
              />
            </Stack>

            <Skeleton
              style={{ marginLeft: '24px' }}
              width={180}
              height={27}
            />
            <Skeleton
              width={180}
              height={27}
            />
          </Stack>
        </div>
      </div>
    </div>
  )
}
