import { useFetcher, useLoaderData } from 'react-router';
import { ErrorMessages } from '~shared/ui/error-messages/error-messages.ui';
import type { UserUpdateActionData } from './actions/user-update.action';
import type { SettingsPageLoaderData } from './settings.loader';
import { settingsPaths } from './settings.paths';

export function SettingsPage() {
  const { userData } = useLoaderData<SettingsPageLoaderData>();
  const { image, username, bio, email } = userData.user;

  const updateFetcher = useFetcher<UserUpdateActionData>();
  const logoutFetcher = useFetcher();

  const isUpdating = updateFetcher.state !== 'idle';
  const isLoggingOut = logoutFetcher.state !== 'idle';

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            {updateFetcher.data && !updateFetcher.data.ok && <ErrorMessages errors={updateFetcher.data.errors} />}

            <updateFetcher.Form method="post" action={settingsPaths.updatePath}>
              <fieldset disabled={isUpdating || isLoggingOut}>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="url"
                    name="image"
                    placeholder="URL of profile picture"
                    autoComplete="photo"
                    defaultValue={image}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="username"
                    placeholder="Username"
                    autoComplete="username"
                    defaultValue={username}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows={8}
                    name="bio"
                    placeholder="Short bio about you"
                    defaultValue={bio ?? ''}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    name="email"
                    placeholder="Email"
                    autoComplete="email"
                    defaultValue={email}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    name="password"
                    placeholder="New Password"
                    autoComplete="new-password"
                  />
                </fieldset>
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={isUpdating || isLoggingOut}
                >
                  {isUpdating ? 'Updating...' : 'Update Settings'}
                </button>
              </fieldset>
            </updateFetcher.Form>
            <hr />
            <logoutFetcher.Form method="post" action={settingsPaths.logoutPath}>
              <button className="btn btn-outline-danger" type="submit" disabled={isUpdating || isLoggingOut}>
                {isLoggingOut ? 'Logging out...' : 'Or click here to logout.'}
              </button>
            </logoutFetcher.Form>
          </div>
        </div>
      </div>
    </div>
  );
}
