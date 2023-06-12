import { StoreApi } from 'zustand';
import { articleFilterModel } from '~entities/article';
import { tagApi } from '~entities/tag';
import { FilterArticleTagButton } from '~features/article';
import { ErrorHandler } from '~shared/ui/error-handler';

type PopularTagsProps = {
  model: StoreApi<articleFilterModel.ArticleFilterState>;
};

export function PopularTags(props: PopularTagsProps) {
  const { model } = props;

  const { data: tags, isLoading, isError, error } = tagApi.useGlobalTags();

  return (
    <div className="sidebar">
      <p>Popular Tags</p>
      <div className="tag-list">
        {isLoading && 'Loading tags...'}

        {isError && <ErrorHandler errorData={error} />}

        {tags &&
          tags.length &&
          tags.map((tag) => (
            <FilterArticleTagButton
              key={tag}
              model={model}
              filter={{ tag }}
              title={tag}
            />
          ))}
      </div>
    </div>
  );
}
