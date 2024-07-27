import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { FavoriteService } from '~shared/api/favorite'
import { AxiosLib } from '~shared/lib/axios'
import { renderWithQueryClient } from '~shared/lib/test'
import { articleTypes } from '~entities/article'
import {
  UnfavoriteArticleBriefButton,
  UnfavoriteArticleExtendedButton,
} from './unfavorite-article.ui'

describe('UnfavoriteArticleButton', () => {
  describe('UnfavoriteArticleBriefButton', () => {
    it('should render the favorite button with the correct count', () => {
      renderUnfavoriteArticleBriefButton()

      expect(screen.getByRole('button'))
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('should trigger mutation and update favorites count when clicked', async () => {
      const unfavoriteArticleMutationSpy = vi
        .spyOn(FavoriteService, 'unfavoriteArticleMutation')
        .mockResolvedValue(AxiosLib.mockResolvedAxiosResponse({ article }))

      const { click } = renderUnfavoriteArticleBriefButton()

      await click(screen.getByRole('button'))

      await waitFor(() => {
        expect(unfavoriteArticleMutationSpy).toHaveBeenCalledWith(article.slug)
      })
    })
  })

  describe('UnfavoriteArticleExtendedButton', () => {
    it('should render the favorite button with the correct count and text', () => {
      renderUnfavoriteArticleExtendedButton()

      expect(
        screen.getByRole('button', { name: /unfavorite article/i }),
      ).toBeInTheDocument()
      expect(screen.getByText('(1)')).toBeInTheDocument()
    })

    it('should trigger mutation and update favorites count when clicked', async () => {
      const unfavoriteArticleMutationSpy = vi
        .spyOn(FavoriteService, 'unfavoriteArticleMutation')
        .mockResolvedValue(AxiosLib.mockResolvedAxiosResponse({ article }))

      const { click } = renderUnfavoriteArticleExtendedButton()

      await click(screen.getByRole('button', { name: /unfavorite article/i }))

      await waitFor(() => {
        expect(unfavoriteArticleMutationSpy).toHaveBeenCalledWith(article.slug)
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
  favorited: true,
  favoritesCount: 1,
  author: {
    username: 'testuser',
    bio: '',
    image: '',
    following: false,
  },
}

function renderUnfavoriteArticleBriefButton() {
  const user = userEvent.setup()
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <UnfavoriteArticleBriefButton article={article} />
    </BrowserRouter>,
  )

  return { ...user, ...renderResult }
}

function renderUnfavoriteArticleExtendedButton() {
  const user = userEvent.setup()
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <UnfavoriteArticleExtendedButton article={article} />
    </BrowserRouter>,
  )

  return { ...user, ...renderResult }
}
