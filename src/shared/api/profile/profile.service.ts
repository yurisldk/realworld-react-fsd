import { AxiosContracts } from '../../lib/axios'
import { realworld } from '../index'
import { ProfileDtoSchema } from './profile.contracts'

export class ProfileService {
  static profileQuery(username: string, config: { signal?: AbortSignal }) {
    return realworld
      .get(`/profiles/${username}`, config)
      .then(AxiosContracts.responseContract(ProfileDtoSchema))
  }

  static followProfileMutation(username: string) {
    return realworld
      .post(`/profiles/${username}/follow`)
      .then(AxiosContracts.responseContract(ProfileDtoSchema))
  }

  static unfollowProfileMutation(username: string) {
    return realworld
      .delete(`/profiles/${username}/follow`)
      .then(AxiosContracts.responseContract(ProfileDtoSchema))
  }
}
