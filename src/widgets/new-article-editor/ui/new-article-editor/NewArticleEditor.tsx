import { useNavigate } from 'react-router-dom';
import { ArticleEditor } from '~entities/article';
import { useCreateArticle } from '~features/article';
import { NewArticleDto } from '~shared/api/realworld';
import { PATH_PAGE } from '~shared/lib/react-router';

const initialArticle: NewArticleDto = {
  title: '',
  description: '',
  body: '',
  tagList: [''],
};

export function NewArticleEditor() {
  const { mutate, isError, error } = useCreateArticle();

  const navigate = useNavigate();

  return (
    <ArticleEditor
      article={initialArticle}
      isLoading={false}
      isError={isError}
      error={error}
      onSubmit={(values, { setSubmitting }) => {
        const newArticle = values as NewArticleDto;

        mutate(newArticle, {
          onSuccess: (article) => {
            navigate(PATH_PAGE.article.slug(article.slug));
          },
          onSettled: () => {
            setSubmitting(false);
          },
        });
      }}
    />
  );
}
