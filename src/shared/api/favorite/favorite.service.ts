import { AxiosContracts } from '../../lib/axios'
import { realworld } from '../index'
import { FavoriteArticleDtoSchema } from './favorite.contracts'

export class FavoriteService {
  static favoriteArticleMutation(slug: string) {
    return realworld
      .post(`/articles/${slug}/favorite`)
      .then(AxiosContracts.responseContract(FavoriteArticleDtoSchema))
  }

  static unfavoriteArticleMutation(slug: string) {
    return realworld
      .delete(`/articles/${slug}/favorite`)
      .then(AxiosContracts.responseContract(FavoriteArticleDtoSchema))
  }
}
