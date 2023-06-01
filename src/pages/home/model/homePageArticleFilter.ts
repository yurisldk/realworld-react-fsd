import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { articleFilterModel } from '~entities/article';
import { sessionModel } from '~entities/session';

const isAuth = Boolean(sessionModel.sessionStore.getState().token);

const initialFilterState: articleFilterModel.ArticleFilter = {
  ...(isAuth && { userfeed: true }),
  ...(!isAuth && { global: true }),
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
