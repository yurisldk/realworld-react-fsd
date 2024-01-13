import { useQuery } from '@tanstack/react-query';
import { tagApi } from '~entities/tag';
import { ErrorHandler } from '~shared/ui/error';

type PopularTagsProps = {
  onTagClick: (tag: string) => void;
};

export function PopularTags(props: PopularTagsProps) {
  const { onTagClick } = props;

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
              onClick={() => {
                onTagClick(tag);
              }}
            >
              {tag}
            </button>
          ))}
      </div>
    </div>
  );
}
