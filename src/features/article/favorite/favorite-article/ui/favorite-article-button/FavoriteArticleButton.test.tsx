import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ArticleDto, realworldApi } from '~shared/api/realworld';
import { renderWithClient } from '~shared/lib/react-query';
import { useMutationFavoriteArticle } from '../../api/favoriteArticle';
import { FavoriteArticleButton } from './FavoriteArticleButton';

const newArticle: ArticleDto = {
  slug: 'If-we-quantify-the-alarm-we-can-get-to-the-FTP-pixel-through-the-online-SSL-interface!-120863',
  title:
    'If we quantify the alarm, we can get to the FTP pixel through the online SSL interface!',
  description:
    'Omnis perspiciatis qui quia commodi sequi modi. Nostrum quam aut cupiditate est facere omnis possimus. Tenetur similique nemo illo soluta molestias facere quo. Ipsam totam facilis delectus nihil quidem soluta vel est omnis.',
  body: 'Quia quo iste et aperiam voluptas consectetur a omnis et.\\nDolores et earum consequuntur sunt et.\\nEa nulla ab voluptatem dicta vel. Temporibus aut adipisci magnam aliquam eveniet nihil laudantium reprehenderit sit.\\nAspernatur cumque labore voluptates mollitia deleniti et. Quos pariatur tenetur.\\nQuasi omnis eveniet eos maiores esse magni possimus blanditiis.\\nQui incidunt sit quos consequatur aut qui et aperiam delectus.\\nPraesentium quas culpa.\\nEaque occaecati cumque incidunt et. Provident saepe omnis non molestiae natus et.\\nAccusamus laudantium hic unde voluptate et sunt voluptatem.\\nMollitia velit id eius mollitia occaecati repudiandae. Voluptatum tempora voluptas est odio iure odio dolorem.\\nVoluptatum est deleniti explicabo explicabo harum provident quis molestiae. Sed dolores nostrum quis. Aut ipsa et qui vel similique sed hic a.\\nVoluptates dolorem culpa nihil aut ipsam voluptatem. Cupiditate officia voluptatum.\\nTenetur facere eum distinctio animi qui laboriosam.\\nQuod sed voluptatem et cumque est eos.\\nSint id provident suscipit harum odio et. Facere beatae delectus ut.\\nPossimus voluptas perspiciatis voluptatem nihil sint praesentium.\\nSint est nihil voluptates nesciunt voluptatibus temporibus blanditiis.\\nOfficiis voluptatem earum sed. Deserunt ab porro similique est accusamus id enim aut suscipit.\\nSoluta reprehenderit error nesciunt odit veniam sed.\\nDolore optio qui aut ab.\\nAut minima provident eius repudiandae a quibusdam in nisi quam.',
  tagList: ['rerum', 'maiores', 'omnis', 'quae'],
  createdAt: '2022-12-09T13:46:24.264Z',
  updatedAt: '2022-12-09T13:46:24.264Z',
  favorited: true,
  favoritesCount: 1,
  author: {
    username: 'Anah Benešová',
    bio: 'I work at statefarm',
    image: 'https://api.realworld.io/images/demo-avatar.png',
    following: true,
  },
};

vi.mock('../../api/favoriteArticle', () => ({
  useMutationFavoriteArticle: vi.fn(() => ({
    mutate: vi.fn().mockImplementation(() => {}),
  })),
}));

describe('<FavoriteArticleButton />', () => {
  beforeEach(() => {
    vi.spyOn(realworldApi.articles, 'createArticleFavorite');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the button', () => {
    renderWithClient(<FavoriteArticleButton article={newArticle} />);

    const favoriteButton = screen.getByRole('button');
    expect(favoriteButton).toBeInTheDocument();
  });

  it('should call the article API', async () => {
    renderWithClient(<FavoriteArticleButton article={newArticle} />);
    const favoriteButton = screen.getByRole('button');

    await userEvent.click(favoriteButton);

    expect(useMutationFavoriteArticle).toHaveBeenCalledTimes(1);
  });
});
