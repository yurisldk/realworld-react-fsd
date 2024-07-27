import { Skeleton } from '~shared/ui/skeleton'
import { Stack } from '~shared/ui/stack'

export function RegisterPageSkeleton() {
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <Stack
              direction="column"
              spacing={32}
            >
              <Stack
                direction="column"
                alignItems="center"
              >
                <Skeleton
                  variant="text"
                  width={100}
                  height={40}
                />

                <Skeleton
                  variant="text"
                  width={100}
                  height={20}
                />
              </Stack>

              <Stack
                direction="column"
                spacing={16}
              >
                <Skeleton
                  width="100%"
                  height={51}
                />

                <Skeleton
                  width="100%"
                  height={51}
                />

                <Skeleton
                  width="100%"
                  height={51}
                />

                <Skeleton
                  width={106}
                  height={51}
                  style={{ alignSelf: 'flex-end' }}
                />
              </Stack>
            </Stack>
          </div>
        </div>
      </div>
    </div>
  )
}
