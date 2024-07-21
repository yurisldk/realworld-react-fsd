import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { FavoriteService } from '~shared/api/favorite'
import { renderWithQueryClient } from '~shared/lib/test'
import { articleTypes } from '~entities/article'
import {
  FavoriteArticleBriefButton,
  FavoriteArticleExtendedButton,
} from './favorite-article.ui'

describe('FavoriteArticleButton', () => {
  describe('FavoriteArticleBriefButton', () => {
    it('should render the favorite button with the correct count', () => {
      renderFavoriteArticleBriefButton()

      expect(screen.getByRole('button'))
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should trigger mutation and update favorites count when clicked', async () => {
      const favoriteArticleMutationSpy = vi
        .spyOn(FavoriteService, 'favoriteArticleMutation')
        .mockResolvedValue({ article })

      const { click } = renderFavoriteArticleBriefButton()

      await click(screen.getByRole('button'))

      await waitFor(() => {
        expect(favoriteArticleMutationSpy).toHaveBeenCalledWith({
          slug: article.slug,
        })
      })
    })
  })

  describe('FavoriteArticleExtendedButton', () => {
    it('should render the favorite button with the correct count and text', () => {
      renderFavoriteArticleExtendedButton()

      expect(
        screen.getByRole('button', { name: /favorite article/i }),
      ).toBeInTheDocument()
      expect(screen.getByText('(0)')).toBeInTheDocument()
    })

    it('should trigger mutation and update favorites count when clicked', async () => {
      const favoriteArticleMutationSpy = vi
        .spyOn(FavoriteService, 'favoriteArticleMutation')
        .mockResolvedValue({ article })

      const { click } = renderFavoriteArticleExtendedButton()

      await click(screen.getByRole('button', { name: /favorite article/i }))

      await waitFor(() => {
        expect(favoriteArticleMutationSpy).toHaveBeenCalledWith({
          slug: article.slug,
        })
      })
    })
  })
})

const article: articleTypes.Article = {
  slug: 'test-article',
  title: 'Test Article',
  description: 'This is a test article',
  body: 'This is the body of the test article',
  tagList: [],
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now()),
  favorited: false,
  favoritesCount: 0,
  author: {
    username: 'testuser',
    bio: '',
    image: '',
    following: false,
  },
}

function renderFavoriteArticleBriefButton() {
  const user = userEvent.setup()
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <FavoriteArticleBriefButton article={article} />
    </BrowserRouter>,
  )

  return { ...user, ...renderResult }
}

function renderFavoriteArticleExtendedButton() {
  const user = userEvent.setup()
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <FavoriteArticleExtendedButton article={article} />
    </BrowserRouter>,
  )

  return { ...user, ...renderResult }
}
