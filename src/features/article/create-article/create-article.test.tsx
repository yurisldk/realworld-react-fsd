import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest'
import { ArticleService, articleTypesDto } from '~shared/api/article'
import { AuthService, authTypesDto } from '~shared/api/auth'
import { AxiosLib } from '~shared/lib/axios'
import { pathKeys } from '~shared/lib/react-router'
import { renderWithQueryClient } from '~shared/lib/test'
import { sessionLib, useSessionStore } from '~shared/session'
import { spinnerModel } from '~shared/ui/spinner'
import { CreateArticle } from './create-article.contract'
import { transformCreateArticleToArticle } from './create-article.lib'
import { CreateArticleForm } from './create-article.ui'

describe('CreateArticleForm', () => {
  beforeEach(() => {
    vi.spyOn(AuthService, 'currentUserQuery').mockResolvedValue(
      AxiosLib.mockResolvedAxiosResponse(userDto),
    )
    useSessionStore.getState().setSession(session)
  })

  it('should render the form with all input fields', () => {
    renderCreateArticleForm()

    expect(screen.getByPlaceholderText('Article Title')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText("What's this article about?"),
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Write your article (in markdown)'),
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter tags')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /publish article/i }),
    ).toBeInTheDocument()
  })

  it('should display validation errors when required fields are empty', async () => {
    const { type } = renderCreateArticleForm()

    await type(screen.getByPlaceholderText('Article Title'), '[Tab]')
    await type(
      screen.getByPlaceholderText("What's this article about?"),
      '[Tab]',
    )
    await type(
      screen.getByPlaceholderText('Write your article (in markdown)'),
      '[Tab]',
    )

    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(3)
    })
  })

  it('should call mutate when the form is valid and submitted', async () => {
    const createArticleMutationSpy = vi
      .spyOn(ArticleService, 'createArticleMutation')
      .mockResolvedValue(AxiosLib.mockResolvedAxiosResponse({ article }))

    const { click, type } = renderCreateArticleForm()

    await type(
      screen.getByPlaceholderText('Article Title'),
      createArticle.title,
    )
    await type(
      screen.getByPlaceholderText("What's this article about?"),
      createArticle.description,
    )
    await type(
      screen.getByPlaceholderText('Write your article (in markdown)'),
      createArticle.body,
    )
    await type(
      screen.getByPlaceholderText('Enter tags'),
      createArticle.tagList!,
    )

    await click(screen.getByRole('button', { name: /publish article/i }))

    await waitFor(() => {
      expect(createArticleMutationSpy).toHaveBeenCalledWith({
        createArticleDto,
      })
    })
  })

  it('should navigate to the article page on successful mutation', async () => {
    const navigate = vi.fn()
    mockedUseNavigate.mockReturnValue(navigate)

    vi.spyOn(ArticleService, 'createArticleMutation').mockResolvedValue(
      AxiosLib.mockResolvedAxiosResponse({ article }),
    )

    const { click, type } = renderCreateArticleForm()

    await type(
      screen.getByPlaceholderText('Article Title'),
      createArticle.title,
    )
    await type(
      screen.getByPlaceholderText("What's this article about?"),
      createArticle.description,
    )
    await type(
      screen.getByPlaceholderText('Write your article (in markdown)'),
      createArticle.body,
    )
    await type(
      screen.getByPlaceholderText('Enter tags'),
      createArticle.tagList!,
    )

    await click(screen.getByRole('button', { name: /publish article/i }))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        pathKeys.article.bySlug({ slug: article.title }),
        { replace: true },
      )
    })
  })

  it('should display server errors on mutation error', async () => {
    vi.spyOn(ArticleService, 'createArticleMutation').mockRejectedValue({
      message: 'An error occurred',
    })

    const { click, type } = renderCreateArticleForm()

    await type(
      screen.getByPlaceholderText('Article Title'),
      createArticle.title,
    )
    await type(
      screen.getByPlaceholderText("What's this article about?"),
      createArticle.description,
    )
    await type(
      screen.getByPlaceholderText('Write your article (in markdown)'),
      createArticle.body,
    )
    await type(
      screen.getByPlaceholderText('Enter tags'),
      createArticle.tagList!,
    )

    await click(screen.getByRole('button', { name: /publish article/i }))

    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument()
    })
  })

  it('should show spinner while the mutation is pending', async () => {
    const globalSpinnerState = spinnerModel.globalSpinner.getState()
    const showSpy = vi.spyOn(globalSpinnerState, 'show')
    vi.spyOn(ArticleService, 'createArticleMutation').mockResolvedValue(
      AxiosLib.mockResolvedAxiosResponse({ article }),
    )

    const { click, type } = renderCreateArticleForm()

    await type(
      screen.getByPlaceholderText('Article Title'),
      createArticle.title,
    )
    await type(
      screen.getByPlaceholderText("What's this article about?"),
      createArticle.description,
    )
    await type(
      screen.getByPlaceholderText('Write your article (in markdown)'),
      createArticle.body,
    )
    await type(
      screen.getByPlaceholderText('Enter tags'),
      createArticle.tagList!,
    )

    await click(screen.getByRole('button', { name: /publish article/i }))

    await waitFor(() => {
      expect(showSpy).toHaveBeenCalled()
    })
  })

  it('should hide spinner when the mutation is settled', async () => {
    const globalSpinnerState = spinnerModel.globalSpinner.getState()
    const hideSpy = vi.spyOn(globalSpinnerState, 'hide')
    vi.spyOn(ArticleService, 'createArticleMutation').mockResolvedValue(
      AxiosLib.mockResolvedAxiosResponse({ article }),
    )

    const { click, type } = renderCreateArticleForm()

    await type(
      screen.getByPlaceholderText('Article Title'),
      createArticle.title,
    )
    await type(
      screen.getByPlaceholderText("What's this article about?"),
      createArticle.description,
    )
    await type(
      screen.getByPlaceholderText('Write your article (in markdown)'),
      createArticle.body,
    )
    await type(
      screen.getByPlaceholderText('Enter tags'),
      createArticle.tagList!,
    )

    await click(screen.getByRole('button', { name: /publish article/i }))

    await waitFor(() => {
      expect(hideSpy).toHaveBeenCalled()
    })
  })
})

const userDto: authTypesDto.UserDto = {
  user: {
    username: 'testuser',
    email: 'testuser@example.com',
    bio: 'A short bio',
    image: 'http://example.com/profile.jpg',
    token: 'testtoken',
  },
}

const session = sessionLib.transformUserDtoToSession(userDto)

const createArticleDto: articleTypesDto.CreateArticleDto = {
  body: 'test-body',
  description: 'test-descriprion',
  title: 'test-title',
  tagList: ['test-tag-1', 'test-tag-2'],
}

const createArticle: CreateArticle = {
  body: 'test-body',
  description: 'test-descriprion',
  title: 'test-title',
  tagList: 'test-tag-1, test-tag-2',
}

const article = transformCreateArticleToArticle({ createArticle, session })

const mockedUseNavigate = useNavigate as Mock

function renderCreateArticleForm() {
  const user = userEvent.setup()
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <CreateArticleForm />
    </BrowserRouter>,
  )

  return { ...user, ...renderResult }
}
