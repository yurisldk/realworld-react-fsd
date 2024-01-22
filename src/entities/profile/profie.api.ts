import { sessionModel } from '~entities/session';
import { baseUrl } from '~shared/api/realworld';
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
      url: baseUrl(`/profiles/${params.username}`),
      method: 'GET',
      headers: { ...sessionModel.authorizationHeader() },
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
      url: baseUrl(`/profiles/${params.username}/follow`),
      method: 'POST',
      headers: { ...sessionModel.authorizationHeader() },
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
      url: baseUrl(`/profiles/${params.username}/follow`),
      method: 'DELETE',
      headers: { ...sessionModel.authorizationHeader() },
    },
    response: {
      contract: zodContract(ProfileResponseSchema),
      mapData: ({ profile }) => mapProfile(profile),
    },
  });
}
