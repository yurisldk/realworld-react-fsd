import { IoTrash } from 'react-icons/io5';
import { articleQueries } from '~entities/article';

type DeleteArticleButtonProps = { slug: string };

export function DeleteArticleButton(props: DeleteArticleButtonProps) {
  const { slug } = props;

  const { mutate: deleteArticle } =
    articleQueries.useDeleteArticleMutation(slug);

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
