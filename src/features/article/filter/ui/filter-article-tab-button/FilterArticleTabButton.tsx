import cn from 'classnames';
import { StoreApi, useStore } from 'zustand';
import { articleFilterModel } from '~entities/article';
import { filterArticle } from '../../model/filterArticle';

type FilterArticleTabButtonProps = {
  model: StoreApi<articleFilterModel.ArticleFilterState>;
  filter: articleFilterModel.ArticleFilter;
  title: string;
};

export function FilterArticleTabButton(props: FilterArticleTabButtonProps) {
  const { model, filter, title } = props;
  const currentFilter = useStore(model, (state) => state.filter);

  // TODO: do we need to have offset and limit exceptions??
  // FIXME: U G L Y
  const isActive = Object.keys(currentFilter).some((key) =>
    // @ts-expect-error
    Boolean(key in filter && currentFilter[key]),
  );

  const classes = cn('nav-link', { active: isActive });

  const handleClick = () => {
    filterArticle(model, filter);
  };

  return (
    <button
      className={classes}
      style={{ cursor: 'pointer' }}
      onClick={handleClick}
      type="button"
    >
      {title}
    </button>
  );
}
