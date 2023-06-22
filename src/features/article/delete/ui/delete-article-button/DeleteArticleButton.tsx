import { IoTrash } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';
import { useDeleteArticle } from '../../api/deleteArticle';

type DeleteArticleButtonProps = {
  slug: string;
};

export function DeleteArticleButton(props: DeleteArticleButtonProps) {
  const { slug } = props;

  const navigate = useNavigate();

  const { mutate } = useDeleteArticle();

  const handleClick = () => {
    mutate(slug, {
      onSuccess: () => {
        navigate(PATH_PAGE.root);
      },
    });
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
