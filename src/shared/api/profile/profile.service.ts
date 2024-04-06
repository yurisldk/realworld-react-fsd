import { createJsonMutation, createJsonQuery } from '../../lib/fetch';
import { zodContract } from '../../lib/zod';
import { IAuthHeaderService } from '../auth-header.service';
import { IUrlService } from '../url.service';
import { ProfileDtoSchema } from './profile.contracts';
import { ProfileDto } from './profile.types';

export interface IProfileService {
  profileQuery(
    params: { username: string },
    signal?: AbortSignal,
  ): Promise<ProfileDto>;

  followProfileMutation(params: { username: string }): Promise<ProfileDto>;

  unfollowProfileMutation(params: { username: string }): Promise<ProfileDto>;
}

export class ProfileService implements IProfileService {
  constructor(
    private readonly urlService: IUrlService,
    private readonly authHeaderService: IAuthHeaderService,
  ) {}

  profileQuery(params: { username: string }, signal?: AbortSignal) {
    return createJsonQuery({
      request: {
        url: this.urlService.getUrl(`/profiles/${params.username}`),
        method: 'GET',
        headers: { ...this.authHeaderService.getHeader() },
      },
      response: { contract: zodContract(ProfileDtoSchema) },
      abort: signal,
    });
  }

  followProfileMutation(params: { username: string }) {
    return createJsonMutation({
      request: {
        url: this.urlService.getUrl(`/profiles/${params.username}/follow`),
        method: 'POST',
        headers: { ...this.authHeaderService.getHeader() },
      },
      response: { contract: zodContract(ProfileDtoSchema) },
    });
  }

  unfollowProfileMutation(params: { username: string }) {
    return createJsonMutation({
      request: {
        url: this.urlService.getUrl(`/profiles/${params.username}/follow`),
        method: 'DELETE',
        headers: { ...this.authHeaderService.getHeader() },
      },
      response: { contract: zodContract(ProfileDtoSchema) },
    });
  }
}
