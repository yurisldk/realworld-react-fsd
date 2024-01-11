import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ArticlesList } from './ArticlesList';

const props = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  error: null,
  hasNextPage: false,
  infinityArticles: undefined,
  renderArticles: vi.fn(),
  nextPageAction: null,
};

describe('<ArticlesList />', () => {
  it('renders loading state when isLoading is true', () => {
    const loadingProps = {
      ...props,
      isLoading: true,
    };

    render(<ArticlesList {...loadingProps} />);
    expect(screen.getByText('Loading articles...')).toBeDefined();
  });

  it('renders error state when isError is true', () => {
    const error = {
      error: {
        message: 'Error message',
      },
    };

    const errorProps = {
      ...props,
      isError: true,
      error,
    };

    // @ts-expect-error error is not assignable to type 'GenericErrorModel'
    render(<ArticlesList {...errorProps} />);
    expect(screen.getByText('Error message')).toBeDefined();
  });

  it('renders empty state when isSuccess is true and no articles are available', () => {
    const successEmptyProps = {
      ...props,
      isSuccess: true,
      infinityArticles: { pages: [[]], pageParams: [undefined] },
    };

    render(<ArticlesList {...successEmptyProps} />);
    expect(screen.getByText('No articles are here... yet.')).toBeDefined();
  });

  it('renders articles when isSuccess is true and articles are available', () => {
    const articles = [
      { id: 1, title: 'Article 1' },
      { id: 2, title: 'Article 2' },
    ];

    const successProps = {
      ...props,
      isSuccess: true,
      infinityArticles: { pages: [articles], pageParams: [undefined] },
      renderArticles: (article: { id: number; title: string }) => (
        <div key={article.id}>{article.title}</div>
      ),
    };

    // @ts-expect-error articles is not assignable to type 'Article[]'
    render(<ArticlesList {...successProps} />);
    expect(screen.getByText('Article 1')).toBeDefined();
    expect(screen.getByText('Article 2')).toBeDefined();
  });

  it('renders next page action when hasNextPage is true', () => {
    const successProps = {
      ...props,
      isSuccess: true,
      hasNextPage: true,
      infinityArticles: { pages: [[]], pageParams: [undefined] },
      nextPageAction: <button type="button">Load More</button>,
    };

    render(<ArticlesList {...successProps} />);
    expect(screen.getByText('Load More')).toBeDefined();
  });
});
