import { StoreApi } from 'zustand';
import { articleFilterModel } from '~entities/article';

export function filterArticle(
  model: StoreApi<articleFilterModel.ArticleFilterState>,
  filter: articleFilterModel.ArticleFilter,
) {
  return model.getState().setFilter(filter);
}
