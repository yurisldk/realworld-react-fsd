import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';
import { ArticleEditor, articleApi } from '~entities/article';
import { useUpdateArticle } from '~features/article';
import { PATH_PAGE } from '~shared/lib/react-router';

type CurrentArticleEditorProps = {
  slug: string;
};

const validationSchema = object().shape({
  title: string(),
  description: string(),
  body: string(),
  tagList: string(),
});

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
      validationSchema={validationSchema}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onSubmit={(values, { setSubmitting }) => {
        const newArticle = values;

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
