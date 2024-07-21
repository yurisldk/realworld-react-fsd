import { handleMutationIssue } from '~shared/lib/error'
import { createJsonMutation } from '../../lib/fetch'
import { getUrl, authHeaderService } from '../api.service'
import { FavoriteArticleDtoSchema } from './favorite.contracts'

export class FavoriteService {
  static favoriteArticleMutation(params: { slug: string }) {
    return createJsonMutation({
      request: {
        url: getUrl(`/articles/${params.slug}/favorite`),
        method: 'POST',
        headers: authHeaderService.getHeader(),
      },
      response: { contract: FavoriteArticleDtoSchema },
    }).catch((e) => {
      throw handleMutationIssue(e)
    })
  }

  static unfavoriteArticleMutation(params: { slug: string }) {
    return createJsonMutation({
      request: {
        url: getUrl(`/articles/${params.slug}/favorite`),
        method: 'DELETE',
        headers: authHeaderService.getHeader(),
      },
      response: { contract: FavoriteArticleDtoSchema },
    }).catch((e) => {
      throw handleMutationIssue(e)
    })
  }
}
