import { screen } from '@testing-library/react';
import { renderWithRouter } from '~shared/lib/react-router';
import { ArticlePreviewCard } from './ArticlePreviewCard';

const article = {
  slug: 'how-to-train-your-dragon',
  title: 'How to train your dragon',
  description: 'Ever wonder how?',
  body: 'It takes a Jacobian',
  tagList: ['dragons', 'training'],
  createdAt: '2016-02-18T03:22:56.637Z',
  updatedAt: '2016-02-18T03:48:35.824Z',
  favorited: false,
  favoritesCount: 0,
  author: {
    username: 'jake',
    bio: 'I work at statefarm',
    image: 'https://i.stack.imgur.com/xHWG8.jpg',
    following: false,
  },
};

describe('<ArticlePreviewCard />', () => {
  it('renders ArticlePreviewCard component with correct data', () => {
    const meta = <div>Meta Data</div>;

    renderWithRouter(<ArticlePreviewCard article={article} meta={meta} />);

    expect(screen.getByText('How to train your dragon')).toBeInTheDocument();
    expect(screen.getByText('Ever wonder how?')).toBeInTheDocument();
    expect(screen.getByText('Meta Data')).toBeInTheDocument();
  });

  it('renders ArticlePreviewCard component without meta data', () => {
    renderWithRouter(<ArticlePreviewCard article={article} />);

    expect(screen.getByText('How to train your dragon')).toBeInTheDocument();
    expect(screen.getByText('Ever wonder how?')).toBeInTheDocument();
    expect(screen.queryByText('Meta Data')).not.toBeInTheDocument();
  });

  it('navigates to the article page when clicking on the article link', async () => {
    const { user } = renderWithRouter(<ArticlePreviewCard article={article} />);

    const readMoreLink = screen.getByText('Read more...');

    await user.click(readMoreLink);
    expect(window.location.pathname).toBe('/article/how-to-train-your-dragon');
  });
});
