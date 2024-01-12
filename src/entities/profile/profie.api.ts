// FIXME:
import { sessionModel } from '~entities/session';
import { baseUrl } from '~shared/api/realworld';
import {
  createQuery,
  declareParams,
  zodContract,
} from '~shared/lib/json-query';
import { ProfileDtoSchema } from './profie.contracts';
import { mapProfile } from './profile.lib';

export const PROFILE_KEY = ['profile', 'profile'];
export const profileQuery = createQuery({
  params: declareParams<string>(),
  request: {
    url: (username) => baseUrl(`/profiles/${username}`),
    method: 'GET',
  },
  response: {
    contract: zodContract(ProfileDtoSchema),
    mapData: ({ result }) => mapProfile(result),
  },
});

export const FOLLOW_PROFILE_KEY = ['profile', 'follow'];
export const followProfileMutation = createQuery({
  params: declareParams<string>(),
  request: {
    url: (username) => baseUrl(`/profiles/${username}/follow`),
    method: 'POST',
    headers: (headers) => {
      headers.Authorization = sessionModel.authorization.accessToken;
    },
  },
  response: {
    contract: zodContract(ProfileDtoSchema),
    mapData: ({ result }) => mapProfile(result),
  },
});

export const UNFOLLOW_PROFILE_KEY = ['profile', 'unfollow'];
export const unfollowProfileMutation = createQuery({
  params: declareParams<string>(),
  request: {
    url: (username) => baseUrl(`/profiles/${username}/follow`),
    method: 'DELETE',
    headers: (headers) => {
      headers.Authorization = sessionModel.authorization.accessToken;
    },
  },
  response: {
    contract: zodContract(ProfileDtoSchema),
    mapData: ({ result }) => mapProfile(result),
  },
});
