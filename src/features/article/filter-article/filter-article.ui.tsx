import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { Tabs } from '~shared/ui/tabs/tabs.ui';
import { selectSession } from '~entities/session/session.model';
import { tagsQueryOptions } from '~entities/tag/tag.api';
import { TagFilterSkeleton } from './filter-article.skeleton';
import { PrimaryLoaderArgs, SecondaryLoaderArgs } from './filter-article.types';

export function PrimaryFilter() {
  const session = useSelector(selectSession);

  const { context } = useLoaderData() as PrimaryLoaderArgs;
  const { filterQuery } = context;
  const { source, tag } = filterQuery;

  const [, setSearchParams] = useSearchParams();

  const tabValue = tag ? 'tag' : source;

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleTabClick = (source: string) => {
    setSearchParams(new URLSearchParams({ source, page: '1' }));
  };

  return (
    <Tabs.Root value={tabValue} onValueChange={handleTabClick}>
      <Tabs.List>
        {session && <Tabs.Trigger value="user">Your Feed</Tabs.Trigger>}
        <Tabs.Trigger value="global">Global Feed</Tabs.Trigger>
        {tag && <Tabs.Trigger value="tag">#{tag}</Tabs.Trigger>}
      </Tabs.List>
    </Tabs.Root>
  );
}

export function TagFilter() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<TagFilterSkeleton />}>
        <BaseTagFilter />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseTagFilter() {
  const { data: tags } = useSuspenseQuery(tagsQueryOptions);

  const [, setSearchParams] = useSearchParams();

  const handleTagClick = (tag: string) => () => {
    setSearchParams(new URLSearchParams({ source: 'global', page: '1', tag }));
  };

  return (
    <div className="tag-list">
      {tags.map((tag) => (
        <button key={tag} className="tag-pill tag-default" type="button" onClick={handleTagClick(tag)}>
          {tag}
        </button>
      ))}
    </div>
  );
}

export function SecondaryFilter() {
  const { params, context } = useLoaderData() as SecondaryLoaderArgs;
  const { filterQuery } = context;
  const { favorited } = filterQuery;
  const { username } = params;

  const [, setSearchParams] = useSearchParams();

  const tabValue = favorited ? 'favorited' : 'author';

  const handleTabClick = (value: string) => {
    const newParams = new URLSearchParams(filterQuery);
    newParams.set('page', '1');

    if (value === 'author') {
      newParams.delete('favorited');
      newParams.set('author', username);
    }

    if (value === 'favorited') {
      newParams.delete('author');
      newParams.set('favorited', username);
    }

    setSearchParams(newParams);
  };

  return (
    <Tabs.Root value={tabValue} onValueChange={handleTabClick}>
      <div className="articles-toggle">
        <Tabs.List>
          <Tabs.Trigger value="author">{`${username}`}&apos;s Articles</Tabs.Trigger>

          <Tabs.Trigger value="favorited">Favorited Articles</Tabs.Trigger>
        </Tabs.List>
      </div>
    </Tabs.Root>
  );
}
