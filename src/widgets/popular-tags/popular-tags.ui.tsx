import { useQuery } from '@tanstack/react-query';
import { tagQueries } from '~entities/tag';
import { ErrorHandler } from '~shared/ui/error';

type PopularTagsProps = {
  onTagClicked: (tag: string) => void;
};

export function PopularTags(props: PopularTagsProps) {
  const { onTagClicked } = props;

  const {
    data: tags,
    isLoading,
    isError,
    error,
  } = useQuery(tagQueries.tagsQueryOptions());

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
              onClick={() => onTagClicked(tag)}
            >
              {tag}
            </button>
          ))}
      </div>
    </div>
  );
}
