import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { articleFilterModel } from '~entities/article';

export const initialFilterState: articleFilterModel.ArticleFilter = {
  offset: 0,
  limit: 10,
};

export const profilePageArticleFilterStore =
  createStore<articleFilterModel.ArticleFilterState>()(
    devtools(
      (...a) => ({
        ...articleFilterModel.createArticleFilterSlice(...a),
        filter: {
          ...initialFilterState,
        },
      }),
      { name: 'Profile Page Article Filter Store' },
    ),
  );
