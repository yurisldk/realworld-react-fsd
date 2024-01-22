import { useQuery } from '@tanstack/react-query';
import { useStore } from 'zustand';
import { tagApi } from '~entities/tag';
import { FilterByCategoryStore } from '~features/article';
import { ErrorHandler } from '~shared/ui/error';

type PopularTagsProps = {
  filterByCategoryStore: FilterByCategoryStore;
};

export function PopularTags(props: PopularTagsProps) {
  const { filterByCategoryStore } = props;

  const filterByTag = useStore(
    filterByCategoryStore,
    (state) => state.filterByTag,
  );

  const {
    data: tags,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: tagApi.TAGS_KEY,
    queryFn: tagApi.tagsQuery,
  });

  return (
    <div className="sidebar">
      <p>Popular Tags</p>
      <div className="tag-list">
        {isLoading && 'Loading tags...'}

        {isError && <ErrorHandler error={error} />}

        {tags &&
          tags.length &&
          tags.map((tag) => (
            <button
              key={tag}
              className="tag-pill tag-default"
              type="button"
              onClick={() => filterByTag(tag)}
            >
              {tag}
            </button>
          ))}
      </div>
    </div>
  );
}
