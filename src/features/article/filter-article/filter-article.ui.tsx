import { useSuspenseQuery } from '@tanstack/react-query'
import { withErrorBoundary } from 'react-error-boundary'
import { compose, withSuspense } from '~shared/lib/react'
import { useSessionStore } from '~shared/session'
import { ErrorHandler, logError } from '~shared/ui/error-handler'
import { Tabs } from '~shared/ui/tabs'
import { TagQueries } from '~entities/tag'
import { TagFilterSkeleton } from './filter-article.skeleton'

export type MainArticleFilter = {
  onTabChange: (tab: string) => void
  useTag: () => string | null
  useTab: () => string
}

export function MainFilter(props: { mainArticleFilter: MainArticleFilter }) {
  const { mainArticleFilter } = props

  const session = useSessionStore.use.session()

  const tag = mainArticleFilter.useTag()
  const tab = mainArticleFilter.useTab()

  return (
    <Tabs.Root
      value={tab}
      onValueChange={mainArticleFilter.onTabChange}
    >
      <Tabs.List>
        {session && <Tabs.Trigger value="user-feed">Your Feed</Tabs.Trigger>}
        <Tabs.Trigger value="global-feed">Global Feed</Tabs.Trigger>

        {tab === 'tag-feed' && (
          <Tabs.Trigger value="tag-feed">#{tag}</Tabs.Trigger>
        )}
      </Tabs.List>
    </Tabs.Root>
  )
}

export type TagArticleFilter = {
  onTagClick: (tag: string) => void
}

type TagFilterProps = { tagArticleFilter: TagArticleFilter }

const enhance = compose<TagFilterProps>(
  (component) =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
  (component) =>
    withSuspense(component, { FallbackComponent: TagFilterSkeleton }),
)

export const TagFilter = enhance((props: TagFilterProps) => {
  const { tagArticleFilter } = props

  const { data: tags } = useSuspenseQuery(TagQueries.tagsQuery())

  const handleTagClick = (tag: string) => () => {
    tagArticleFilter.onTagClick(tag)
  }

  return (
    <div className="tag-list">
      {tags.map((tag) => (
        <button
          key={tag}
          className="tag-pill tag-default"
          type="button"
          onClick={handleTagClick(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  )
})

export type ProfileArticleFilter = {
  onTabChange: (username: string) => (tab: string) => void
  useTab: () => string
}

export function ProfileFilter(props: {
  username: string
  profileArticleFilter: ProfileArticleFilter
}) {
  const { username, profileArticleFilter } = props

  const tab = profileArticleFilter.useTab()

  return (
    <Tabs.Root
      value={tab}
      onValueChange={profileArticleFilter.onTabChange(username)}
    >
      <div className="articles-toggle">
        <Tabs.List>
          <Tabs.Trigger value="author-feed">
            {`${username}`}&apos;s Articles
          </Tabs.Trigger>

          <Tabs.Trigger value="favorite-feed">Favorited Articles</Tabs.Trigger>
        </Tabs.List>
      </div>
    </Tabs.Root>
  )
}
