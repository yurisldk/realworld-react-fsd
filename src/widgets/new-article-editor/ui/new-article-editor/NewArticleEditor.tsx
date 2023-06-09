import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';
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

const validationSchema = object().shape({
  title: string().required('required'),
  description: string().required('required'),
  body: string().required('required'),
  tagList: string(),
});

export function NewArticleEditor() {
  const { mutate, isError, error } = useCreateArticle();

  const navigate = useNavigate();

  return (
    <ArticleEditor
      article={initialArticle}
      validationSchema={validationSchema}
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
