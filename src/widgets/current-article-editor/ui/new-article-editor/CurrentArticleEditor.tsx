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
    isLoading: isArticleLoading,
    // isError: isArticleError,
    // error: articleError,
  } = articleApi.useArticle(slug);

  const { mutate } = useUpdateArticle();

  const navigate = useNavigate();

  // if (isArticleError)
  //   return (
  //     <FullPageWrapper>
  //       <ErrorHandler error={articleError} />;
  //     </FullPageWrapper>
  //   );

  return (
    <ArticleEditor
      article={initialData}
      validationSchema={validationSchema}
      isLoading={isArticleLoading}
      // isError={isUpdateError}
      // error={updateError}
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
