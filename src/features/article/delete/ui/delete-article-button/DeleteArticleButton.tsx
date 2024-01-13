import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IoTrash } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { articleApiTest } from '~entities/article';
import { PATH_PAGE } from '~shared/lib/react-router';

type DeleteArticleButtonProps = { slug: string };

export function DeleteArticleButton(props: DeleteArticleButtonProps) {
  const { slug } = props;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: deleteArticle } = useMutation({
    mutationKey: [...articleApiTest.DELETE_ARTICLE_KEY, slug],
    mutationFn: articleApiTest.deleteArticleMutation,
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: [...articleApiTest.ARTICLE_KEY, slug],
      });
      navigate(PATH_PAGE.root);
    },
  });

  const handleClick = () => {
    deleteArticle(slug);
  };

  return (
    <button
      onClick={handleClick}
      className="btn btn-outline-danger btn-sm"
      type="button"
    >
      <IoTrash size={16} />
      &nbsp;Delete Article
    </button>
  );
}
