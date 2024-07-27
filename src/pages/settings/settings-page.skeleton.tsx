import { Skeleton } from '~shared/ui/skeleton'
import { Stack } from '~shared/ui/stack'
import { UpdateSessionFormSkeleton } from '~features/session'

export function SettingsPageSkeleton() {
  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <Stack
              justifyContent="center"
              style={{ marginBottom: '16px' }}
            >
              <Skeleton
                height={44}
                width={200}
              />
            </Stack>

            <UpdateSessionFormSkeleton />

            <hr />

            <Skeleton
              width={184}
              height={38}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
