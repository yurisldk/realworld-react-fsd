import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { unfollowProfile } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { ARTICLES_ROOT_QUERY_KEY } from '~entities/article/article.api';
import { ArticleSchema, ArticlesSchema } from '~entities/article/article.contracts';
import { Article, Articles } from '~entities/article/article.types';
import { Profile } from '~entities/profile/profie.types';
import { profileQueryOptions } from '~entities/profile/profile.api';
import { transformProfileDtoToProfile } from '~entities/profile/profile.lib';

export function useUnfollowProfileMutation(
  options: Pick<
    UseMutationOptions<Profile, DefaultError, string, { previousArticles: unknown; previousProfile: Profile }>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['profile', 'unfollow', ...mutationKey],

    mutationFn: async (username) => {
      const { data } = await unfollowProfile(username);
      const profile = transformProfileDtoToProfile(data);
      return profile;
    },

    onMutate: async (username) => {
      const articleQueryKey = ARTICLES_ROOT_QUERY_KEY;
      const profileQueryKey = profileQueryOptions(username).queryKey;

      await Promise.all([
        queryClient.cancelQueries({ queryKey: articleQueryKey }),
        queryClient.cancelQueries({ queryKey: profileQueryKey }),
      ]);

      const previousArticles = queryClient.getQueriesData({ queryKey: articleQueryKey });
      const previousProfile = queryClient.getQueryData(profileQueryKey);

      const updatedProfile = previousProfile && { ...previousProfile, following: true };

      queryClient.setQueryData(profileQueryKey, updatedProfile);

      queryClient.setQueriesData({ queryKey: articleQueryKey }, (rawData) => {
        if (!rawData) {
          return rawData;
        }

        const { data: articleData } = ArticleSchema.safeParse(rawData);
        if (articleData && articleData.author.username === username) {
          return { ...articleData, author: { ...articleData.author, following: false } } as Article;
        }

        const { data: articlesData } = ArticlesSchema.safeParse(rawData);
        if (articlesData) {
          const { articles, articlesCount } = articlesData;

          const updatedArticles = Object.fromEntries(
            Object.entries(articles).map(([slug, article]) => [
              slug,
              article?.author.username === username
                ? { ...article, author: { ...article.author, following: false } }
                : article,
            ]),
          );

          return { articles: updatedArticles, articlesCount } as Articles;
        }

        return rawData;
      });

      await onMutate?.(username);

      return { previousArticles, previousProfile };
    },

    onSuccess,

    onError: async (error, username, context) => {
      const articleQueryKey = ARTICLES_ROOT_QUERY_KEY;
      const profileQueryKey = profileQueryOptions(username).queryKey;

      queryClient.setQueriesData({ queryKey: articleQueryKey }, context.previousArticles);
      queryClient.setQueryData(profileQueryKey, context.previousProfile);
      await onError?.(error, username, context);
    },

    onSettled: async (data, error, username, context) => {
      const articleQueryKey = ARTICLES_ROOT_QUERY_KEY;
      const profileQueryKey = profileQueryOptions(username).queryKey;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: articleQueryKey }),
        queryClient.invalidateQueries({ queryKey: profileQueryKey }),
        onSettled?.(data, error, username, context),
      ]);
    },
  });
}
