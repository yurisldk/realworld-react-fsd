import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { articleFilterModel } from '~entities/article';

export const initialFilterState: articleFilterModel.ArticleFilter = {
  limit: 10,
  offset: 0,
};

export const homePageArticleFilterStore =
  createStore<articleFilterModel.ArticleFilterState>()(
    devtools(
      (...a) => ({
        ...articleFilterModel.createArticleFilterSlice(...a),
        filter: {
          ...articleFilterModel.createArticleFilterSlice(...a).filter,
          ...initialFilterState,
        },
      }),
      { name: 'Home Page Article Filter Store' },
    ),
  );
