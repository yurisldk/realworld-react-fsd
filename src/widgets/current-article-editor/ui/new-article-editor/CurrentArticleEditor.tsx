import { useNavigate } from 'react-router-dom';
import { ArticleEditor, articleApi } from '~entities/article';
import { useUpdateArticle } from '~features/article';
import { UpdateArticleDto } from '~shared/api/realworld';
import { PATH_PAGE } from '~shared/lib/react-router';

type CurrentArticleEditorProps = {
  slug: string;
};

export function CurrentArticleEditor(props: CurrentArticleEditorProps) {
  const { slug } = props;

  const {
    data: initialData,
    isLoading,
    isError,
    error,
  } = articleApi.useArticle(slug);

  const { mutate } = useUpdateArticle();

  const navigate = useNavigate();

  return (
    <ArticleEditor
      article={initialData}
      isLoading={isLoading}
      isError={isError}
      error={error?.error}
      onSubmit={(values, { setSubmitting }) => {
        const newArticle = values as UpdateArticleDto;

        mutate(
          { slug, article: newArticle },
          {
            onSuccess: (article) => {
              navigate(PATH_PAGE.article.slug(article.slug));
            },
            onSettled: () => {
              setSubmitting(false);
            },
          },
        );
      }}
    />
  );
}
