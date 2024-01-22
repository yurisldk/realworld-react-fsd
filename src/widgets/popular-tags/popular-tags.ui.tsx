import { useSuspenseQuery } from '@tanstack/react-query';
import { withErrorBoundary } from 'react-error-boundary';
import { tagQueries } from '~entities/tag';
import { withSuspense } from '~shared/lib/react';

type PopularTagsProps = {
  onTagClicked: (tag: string) => void;
};

export function Foo(props: PopularTagsProps) {
  const { onTagClicked } = props;

  const { data: tags } = useSuspenseQuery(tagQueries.tagsQueryOptions());

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

const SuspensedPopularTags = withSuspense(Foo, {
  fallback: <div>tags loading..</div>,
});
export const PopularTags = withErrorBoundary(SuspensedPopularTags, {
  fallbackRender: ({ error }) => <div>{error.message}</div>,
});
