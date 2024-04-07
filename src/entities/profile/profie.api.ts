import { authHeaderService, urlService } from '~shared/api';
import { createJsonMutation, createJsonQuery } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { ProfileResponseSchema } from './profie.contracts';
import { mapProfile } from './profile.lib';

export async function profileQuery(
  params: { username: string },
  signal?: AbortSignal,
) {
  return createJsonQuery({
    request: {
      url: urlService.getUrl(`/profiles/${params.username}`),
      method: 'GET',
      headers: { ...authHeaderService.getHeader() },
    },
    response: {
      contract: zodContract(ProfileResponseSchema),
      mapData: ({ profile }) => mapProfile(profile),
    },
    abort: signal,
  });
}

export async function followProfileMutation(params: { username: string }) {
  return createJsonMutation({
    request: {
      url: urlService.getUrl(`/profiles/${params.username}/follow`),
      method: 'POST',
      headers: { ...authHeaderService.getHeader() },
    },
    response: {
      contract: zodContract(ProfileResponseSchema),
      mapData: ({ profile }) => mapProfile(profile),
    },
  });
}

export async function unfollowProfileMutation(params: { username: string }) {
  return createJsonMutation({
    request: {
      url: urlService.getUrl(`/profiles/${params.username}/follow`),
      method: 'DELETE',
      headers: { ...authHeaderService.getHeader() },
    },
    response: {
      contract: zodContract(ProfileResponseSchema),
      mapData: ({ profile }) => mapProfile(profile),
    },
  });
}
