import { createElement } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import { pathKeys } from '~shared/lib/react-router';
import { ProfilePage, ProfilePageParamsSchema } from './profile-page.ui';

export const profilePageRoute: RouteObject = {
  path: 'profile',
  children: [
    {
      index: true,
      loader: async () => {
        return redirect(pathKeys.page404());
      },
    },
    {
      path: ':username',
      element: createElement(ProfilePage),
      loader: async ({ params }) => {
        const parsed = ProfilePageParamsSchema.safeParse(params);

        if (!parsed.success) {
          throw new Error('Invalid params');
        }

        return null;
      },
    },
    {
      path: ':username/favorites',
      element: createElement(ProfilePage),
      loader: async ({ params }) => {
        const parsed = ProfilePageParamsSchema.safeParse(params);

        if (!parsed.success) {
          throw new Error('Invalid params');
        }

        return null;
      },
    },
  ],
};
