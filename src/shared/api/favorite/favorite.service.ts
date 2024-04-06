import { createJsonMutation } from '../../lib/fetch';
import { zodContract } from '../../lib/zod';
import { IAuthHeaderService } from '../auth-header.service';
import { IUrlService } from '../url.service';
import { FavoriteArticleDtoSchema } from './favorite.contracts';
import { FavoriteArticleDto } from './favorite.types';

export interface IFavoriteService {
  favoriteArticleMutation(params: {
    slug: string;
  }): Promise<FavoriteArticleDto>;

  unfavoriteArticleMutation(params: {
    slug: string;
  }): Promise<FavoriteArticleDto>;
}

export class FavoriteService implements IFavoriteService {
  constructor(
    private readonly urlService: IUrlService,
    private readonly authHeaderService: IAuthHeaderService,
  ) {}

  favoriteArticleMutation(params: { slug: string }) {
    return createJsonMutation({
      request: {
        url: this.urlService.getUrl(`/articles/${params.slug}/favorite`),
        method: 'POST',
        headers: { ...this.authHeaderService.getHeader() },
      },
      response: { contract: zodContract(FavoriteArticleDtoSchema) },
    });
  }

  unfavoriteArticleMutation(params: { slug: string }) {
    return createJsonMutation({
      request: {
        url: this.urlService.getUrl(`/articles/${params.slug}/favorite`),
        method: 'DELETE',
        headers: { ...this.authHeaderService.getHeader() },
      },
      response: { contract: zodContract(FavoriteArticleDtoSchema) },
    });
  }
}
