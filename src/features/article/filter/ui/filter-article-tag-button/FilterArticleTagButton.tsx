import { StoreApi } from 'zustand';
import { articleFilterModel } from '~entities/article';
import { filterArticle } from '../../model/filterArticle';

type FilterArticleTagButtonProps = {
  model: StoreApi<articleFilterModel.ArticleFilterState>;
  filter: articleFilterModel.ArticleFilter;
  title: string;
};

export function FilterArticleTagButton(props: FilterArticleTagButtonProps) {
  const { model, filter, title } = props;

  const handleClick = () => {
    filterArticle(model, filter);
  };

  return (
    <button
      className="tag-pill tag-default"
      style={{ cursor: 'pointer' }}
      onClick={handleClick}
      type="button"
    >
      {title}
    </button>
  );
}
