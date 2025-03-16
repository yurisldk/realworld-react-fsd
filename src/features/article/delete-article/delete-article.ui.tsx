import { IoTrash } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/router';
import { useDeleteArticleMutation } from './delete-article.mutation';

export function DeleteArticleButton(props: { slug: string }) {
  const { slug } = props;

  const navigate = useNavigate();

  const { mutate, isPending } = useDeleteArticleMutation({
    mutationKey: [slug],
    onSuccess: () => {
      navigate(pathKeys.home, { replace: true });
    },
  });

  const handleClick = () => {
    mutate(slug);
  };

  return (
    <button onClick={handleClick} className="btn btn-outline-danger btn-sm" type="button" disabled={isPending}>
      <IoTrash size={16} />
      &nbsp;Delete Article
    </button>
  );
}
