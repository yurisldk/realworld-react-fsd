import { StoreApi } from 'zustand';
import { articleFilterModel } from '~entities/article';
import { tagApi } from '~entities/tag';
import { FilterArticleTagButton } from '~features/article';

type PopularTagsProps = {
  model: StoreApi<articleFilterModel.ArticleFilterState>;
};

export function PopularTags(props: PopularTagsProps) {
  const { model } = props;

  const { data: tags, isLoading: isTagsLoading } = tagApi.useGlobalTags();

  return (
    <div className="sidebar">
      <p>Popular Tags</p>
      <div className="tag-list">
        {isTagsLoading && 'Loading tags...'}

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
