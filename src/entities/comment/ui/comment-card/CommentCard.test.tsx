import { screen } from '@testing-library/react';
import { renderWithRouter } from '~shared/lib/react-router';
import { CommentCard } from './CommentCard';

describe('<CommentCard />', () => {
  const comment = {
    id: 1,
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:22:56.637Z',
    body: 'It takes a Jacobian',
    author: {
      username: 'jake',
      bio: 'I work at statefarm',
      image: 'https://i.stack.imgur.com/xHWG8.jpg',
      following: false,
    },
  };

  it('renders CommentCard component with correct data', () => {
    renderWithRouter(<CommentCard comment={comment} />);

    const commentBody = screen.getByText('It takes a Jacobian');
    const commentAuthor = screen.getByText('jake');
    const commentDate = screen.getByText('February 18, 2016');
    const commentAuthorImage = screen.getByAltText('jake');

    expect(commentBody).toBeDefined();
    expect(commentAuthor).toBeDefined();
    expect(commentDate).toBeDefined();
    expect(commentAuthorImage).toHaveProperty(
      'src',
      'https://i.stack.imgur.com/xHWG8.jpg',
    );
  });

  it('renders additional actions', () => {
    const actions = <button type="button">Like</button>;

    renderWithRouter(<CommentCard comment={comment} actions={actions} />);

    const additionalActions = screen.getByRole('button', { name: 'Like' });
    expect(additionalActions).toBeDefined();
  });

  it('navigates to the profile page when clicking on the profile link or image', async () => {
    const { user } = renderWithRouter(<CommentCard comment={comment} />);

    const profileLink = screen.getByText('jake');
    const profileImage = screen.getByAltText('jake');

    await user.click(profileLink);
    expect(window.location.pathname).toBe('/profile/jake');

    await user.click(profileImage);
    expect(window.location.pathname).toBe('/profile/jake');
  });
});
