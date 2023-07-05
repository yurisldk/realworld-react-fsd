import { InfiniteData } from '@tanstack/react-query';
import { articleApi } from '~entities/article';

export type ArticlesInfinityData = InfiniteData<articleApi.Article[]>;

export const updateInfinityData = (
  infinityData: ArticlesInfinityData,
  newArticle: articleApi.Article,
) => {
  const articleOrderIdx = infinityData.pages
    .flat()
    .findIndex((article) => article.slug === newArticle.slug);

  if (articleOrderIdx === -1) return { ...infinityData };

  const pageLength = infinityData.pages[0].length;
  const [pageIdx, articleIdx] = [
    Math.floor(articleOrderIdx / pageLength),
    articleOrderIdx % pageLength,
  ];

  const newArticlesInfinityData: ArticlesInfinityData = {
    pages: [
      ...infinityData.pages.slice(0, pageIdx),
      [
        ...infinityData.pages[pageIdx].slice(0, articleIdx),
        newArticle,
        ...infinityData.pages[pageIdx].slice(articleIdx + 1),
      ],
      ...infinityData.pages.slice(pageIdx + 1),
    ],

    pageParams: [...infinityData.pageParams],
  };

  return newArticlesInfinityData;
};
