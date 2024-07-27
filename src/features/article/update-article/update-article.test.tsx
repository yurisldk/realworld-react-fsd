import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { ArticleService, articleTypesDto } from '~shared/api/article'
import { AxiosLib } from '~shared/lib/axios'
import { pathKeys } from '~shared/lib/react-router'
import { renderWithQueryClient } from '~shared/lib/test'
import { spinnerModel } from '~shared/ui/spinner'
import { articleLib } from '~entities/article'
import { UpdateArticleForm } from './update-article.ui'

describe('UpdateArticleForm', () => {
  beforeEach(() => {
    vi.spyOn(ArticleService, 'articleQuery').mockResolvedValue(
      AxiosLib.mockResolvedAxiosResponse(articleDto),
    )
  })

  it('should render the form with the correct initial values', async () => {
    renderUpdateArticleForm()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Article Title')).toHaveValue(
        article.title,
      )
      expect(
        screen.getByPlaceholderText("What's this article about?"),
      ).toHaveValue(article.description)
      expect(
        screen.getByPlaceholderText('Write your article (in markdown)'),
      ).toHaveValue(article.body)
      expect(screen.getByPlaceholderText('Enter tags')).toHaveValue(
        article.tagList.join(', '),
      )
    })
  })

  it('should call the mutation with the updated article on form submission', async () => {
    const updateArticleMutationSpy = vi
      .spyOn(ArticleService, 'updateArticleMutation')
      .mockResolvedValue(AxiosLib.mockResolvedAxiosResponse({ article }))

    const { click, type, clear } = renderUpdateArticleForm()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Article Title')).toHaveValue(
        article.title,
      )
    })

    await clear(screen.getByPlaceholderText('Article Title'))
    await type(screen.getByPlaceholderText('Article Title'), 'Updated Title')

    await clear(screen.getByPlaceholderText("What's this article about?"))
    await type(
      screen.getByPlaceholderText("What's this article about?"),
      'Updated Description',
    )

    await clear(screen.getByPlaceholderText('Write your article (in markdown)'))
    await type(
      screen.getByPlaceholderText('Write your article (in markdown)'),
      'Updated Body',
    )

    await clear(screen.getByPlaceholderText('Enter tags'))
    await type(screen.getByPlaceholderText('Enter tags'), 'updated, tags')

    await click(screen.getByRole('button', { name: /update article/i }))

    await waitFor(() => {
      expect(updateArticleMutationSpy).toHaveBeenCalledWith(article.slug, {
        updateArticleDto: {
          title: 'Updated Title',
          description: 'Updated Description',
          body: 'Updated Body',
          tagList: ['updated', 'tags'],
        },
      })
    })
  })

  it('should navigate to the article page on successful mutation', async () => {
    const navigate = vi.fn()
    mockedUseNavigate.mockReturnValue(navigate)

    const { click, type, clear } = renderUpdateArticleForm()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Article Title')).toHaveValue(
        article.title,
      )
    })

    await clear(screen.getByPlaceholderText("What's this article about?"))
    await type(
      screen.getByPlaceholderText("What's this article about?"),
      'Updated Description',
    )

    await click(screen.getByRole('button', { name: /update article/i }))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        pathKeys.article.bySlug({ slug: article.slug }),
        { replace: true },
      )
    })
  })

  it('should display server errors on mutation error', async () => {
    vi.spyOn(ArticleService, 'updateArticleMutation').mockRejectedValue({
      message: 'An error occurred',
    })

    const { click, type, clear } = renderUpdateArticleForm()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Article Title')).toHaveValue(
        article.title,
      )
    })

    await clear(screen.getByPlaceholderText("What's this article about?"))
    await type(
      screen.getByPlaceholderText("What's this article about?"),
      'Updated Description',
    )

    await click(screen.getByRole('button', { name: /update article/i }))

    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument()
    })
  })

  it('should show the spinner during mutation', async () => {
    const globalSpinnerState = spinnerModel.globalSpinner.getState()
    const showSpy = vi.spyOn(globalSpinnerState, 'show')

    const { click, type, clear } = renderUpdateArticleForm()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Article Title')).toHaveValue(
        article.title,
      )
    })

    await clear(screen.getByPlaceholderText("What's this article about?"))
    await type(
      screen.getByPlaceholderText("What's this article about?"),
      'Updated Description',
    )

    await click(screen.getByRole('button', { name: /update article/i }))

    await waitFor(() => {
      expect(showSpy).toHaveBeenCalled()
    })
  })

  it('should hide spinner when the mutation is settled', async () => {
    const globalSpinnerState = spinnerModel.globalSpinner.getState()
    const hideSpy = vi.spyOn(globalSpinnerState, 'hide')

    const { click, type, clear } = renderUpdateArticleForm()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Article Title')).toHaveValue(
        article.title,
      )
    })

    await clear(screen.getByPlaceholderText("What's this article about?"))
    await type(
      screen.getByPlaceholderText("What's this article about?"),
      'Updated Description',
    )

    await click(screen.getByRole('button', { name: /update article/i }))

    await waitFor(() => {
      expect(hideSpy).toHaveBeenCalled()
    })
  })
})

const articleDto: articleTypesDto.ArticleDto = {
  article: {
    slug: 'test-article',
    title: 'Test Article',
    description: 'This is a test article',
    body: 'This is the body of the test article',
    tagList: ['test', 'article'],
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
  },
}

const article = articleLib.transformArticleDtoToArticle(articleDto)

const mockedUseNavigate = useNavigate as Mock

function renderUpdateArticleForm() {
  const user = userEvent.setup()
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <UpdateArticleForm slug="test-slug" />
    </BrowserRouter>,
  )

  return { ...user, ...renderResult }
}
