import { sessionModel } from '~entities/session';
import { baseUrl } from '~shared/api/realworld';
import {
  createQuery,
  declareParams,
  zodContract,
} from '~shared/lib/json-query';
import { ProfileResponseSchema } from './profie.contracts';
import { mapProfile } from './profile.lib';

export const profileQuery = createQuery({
  params: declareParams<string>(),
  request: {
    url: (username) => baseUrl(`/profiles/${username}`),
    method: 'GET',
    headers: () => ({ ...sessionModel.authorizationHeader() }),
  },
  response: {
    contract: zodContract(ProfileResponseSchema),
    mapData: ({ result }) => mapProfile(result.profile),
  },
});

export const followProfileMutation = createQuery({
  params: declareParams<string>(),
  request: {
    url: (username) => baseUrl(`/profiles/${username}/follow`),
    method: 'POST',
    headers: () => ({ ...sessionModel.authorizationHeader() }),
  },
  response: {
    contract: zodContract(ProfileResponseSchema),
    mapData: ({ result }) => mapProfile(result.profile),
  },
});

export const unfollowProfileMutation = createQuery({
  params: declareParams<string>(),
  request: {
    url: (username) => baseUrl(`/profiles/${username}/follow`),
    method: 'DELETE',
    headers: () => ({ ...sessionModel.authorizationHeader() }),
  },
  response: {
    contract: zodContract(ProfileResponseSchema),
    mapData: ({ result }) => mapProfile(result.profile),
  },
});
