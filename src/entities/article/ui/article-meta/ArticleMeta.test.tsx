import { screen } from '@testing-library/react';
import { renderWithRouter } from '~shared/lib/react-router';
import { ArticleMeta } from './ArticleMeta';

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

describe('<ArticleMeta />', () => {
  it('renders ArticleMeta component with correct data', () => {
    renderWithRouter(<ArticleMeta article={article} />);

    const authorLink = screen.getByText('jake');
    const date = screen.getByText('February 18, 2016');
    const image = screen.getByAltText('jake');

    expect(authorLink).toBeDefined();
    expect(date).toBeDefined();
    expect(image).toBeDefined();
  });

  it('renders ArticleMeta component with action slot', () => {
    const actionSlot = <button type="button">Like</button>;

    renderWithRouter(<ArticleMeta article={article} actionSlot={actionSlot} />);

    const actionButton = screen.getByText('Like');

    expect(actionButton).toBeDefined();
  });

  it('navigates to the author profile page when clicking on the author link or image', async () => {
    const { user } = renderWithRouter(<ArticleMeta article={article} />);

    const authorLink = screen.getByText('jake');
    const authorImage = screen.getByAltText('jake');

    await user.click(authorLink);
    expect(window.location.pathname).toBe('/profile/jake');

    await user.click(authorImage);
    expect(window.location.pathname).toBe('/profile/jake');
  });
});
