import { useSuspenseQuery } from '@tanstack/react-query';
import { withErrorBoundary } from 'react-error-boundary';
import { tagQueries } from '~entities/tag';
import { withSuspense } from '~shared/lib/react';
import { ErrorHandler } from '~shared/ui/error';
import { Loader } from '~shared/ui/loader';

type PopularTagsProps = {
  onTagClicked: (tag: string) => void;
};

export function Tags(props: PopularTagsProps) {
  const { onTagClicked } = props;

  const { data: tags } = useSuspenseQuery(
    tagQueries.tagsService.queryOptions(),
  );

  return (
    <div className="sidebar">
      <p>Popular Tags</p>
      <div className="tag-list">
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

const SuspensedPopularTags = withSuspense(Tags, {
  fallback: <Loader />,
});
export const PopularTags = withErrorBoundary(SuspensedPopularTags, {
  fallbackRender: ({ error }) => <ErrorHandler error={error} />,
});
