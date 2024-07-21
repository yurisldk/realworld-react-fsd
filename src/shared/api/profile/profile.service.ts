import { handleMutationIssue } from '~shared/lib/error'
import { createJsonMutation, createJsonQuery } from '../../lib/fetch'
import { getUrl, authHeaderService } from '../api.service'
import { ProfileDtoSchema } from './profile.contracts'

export class ProfileService {
  static profileQuery(params: { username: string }, signal?: AbortSignal) {
    return createJsonQuery({
      request: {
        url: getUrl(`/profiles/${params.username}`),
        method: 'GET',
        headers: authHeaderService.getHeader(),
      },
      response: { contract: ProfileDtoSchema },
      abort: signal,
    })
  }

  static followProfileMutation(params: { username: string }) {
    return createJsonMutation({
      request: {
        url: getUrl(`/profiles/${params.username}/follow`),
        method: 'POST',
        headers: authHeaderService.getHeader(),
      },
      response: { contract: ProfileDtoSchema },
    }).catch((e) => {
      throw handleMutationIssue(e)
    })
  }

  static unfollowProfileMutation(params: { username: string }) {
    return createJsonMutation({
      request: {
        url: getUrl(`/profiles/${params.username}/follow`),
        method: 'DELETE',
        headers: authHeaderService.getHeader(),
      },
      response: { contract: ProfileDtoSchema },
    }).catch((e) => {
      throw handleMutationIssue(e)
    })
  }
}
