import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { articleApi } from '~entities/article';
import { realworldApi } from '~shared/api/realworld';
import { renderWithClient } from '~shared/lib/react-query';
import { useMutationUnfavoriteArticle } from '../../api/unfavoriteArticle';
import { UnfavoriteArticleButton } from './UnfavoriteArticleButton';

const newArticle: articleApi.Article = {
  slug: 'Ill-synthesize-the-primary-AI-capacitor-that-should-array-the-JBOD-sensor!-120863',
  title:
    'Ill synthesize the primary AI capacitor, that should array the JBOD sensor!',
  description:
    'Perspiciatis illum illum et et error labore ut iure. Eius quidem eius placeat blanditiis in et deserunt. Eligendi fugiat vero nam asperiores sequi sit dignissimos. Quam rerum consequuntur dolor.',
  body: 'Pariatur quo neque est perspiciatis non illo rerum expedita minima.\\nEt commodi voluptas eos ex.\\nUnde velit delectus deleniti deleniti non in sit.\\nAliquid voluptatem magni. Ut in omnis sapiente laboriosam autem laborum.\\nRepellendus et beatae qui qui numquam saepe.\\nNon vitae molestias quos illum.\\nSed fugiat qui ullam molestias ad ullam dolore.\\nAutem ex minus distinctio dicta sapiente beatae veritatis at. Dicta quia molestias natus est.\\nSit animi inventore a ut ut suscipit.\\nEos et et commodi eligendi nihil.\\nEa reprehenderit consectetur eum. Autem sed aspernatur aut sint ipsam et facere rerum voluptas.\\nPerferendis eligendi molestias laudantium eveniet eos.\\nId veniam asperiores quis voluptates aut deserunt.\\nTempora et eius dignissimos nulla iusto et omnis pariatur.\\nSit mollitia eum blanditiis suscipit. Et fuga repellendus magnam dignissimos eius aspernatur rerum. Dolorum eius dignissimos et magnam voluptate aut voluptatem natus.\\nAut sint est eum molestiae consequatur officia omnis.\\nQuae et quam odit voluptatum itaque ducimus magni dolores ab.\\nDolorum sed iure voluptatem et reiciendis. Ad voluptate vel.\\nAut aut dolor. Facere consequatur ullam.\\nSint illum iste ab et saepe sit ut quis voluptatibus.\\nQuo esse dolorum a quasi nihil.\\nError quo eveniet.\\nQuia aut rem quia in iste fugit ad. Voluptas aut occaecati cum et quia quam.\\nBeatae libero doloribus nesciunt iusto.\\nDolores vitae neque quisquam qui ipsa ut aperiam. Deserunt ab porro similique est accusamus id enim aut suscipit.\\nSoluta reprehenderit error nesciunt odit veniam sed.\\nDolore optio qui aut ab.\\nAut minima provident eius repudiandae a quibusdam in nisi quam.',
  tagList: ['possimus', 'eos', 'omnis', 'laborum'],
  createdAt: '2022-12-09T13:46:24.262Z',
  updatedAt: '2022-12-09T13:46:24.262Z',
  favorited: false,
  favoritesCount: 0,
  author: {
    username: 'Anah Benešová',
    bio: 'I work at statefarm',
    image: 'https://api.realworld.io/images/demo-avatar.png',
    following: true,
  },
};

vi.mock('../../api/unfavoriteArticle', () => ({
  useMutationUnfavoriteArticle: vi.fn(() => ({
    mutate: vi.fn().mockImplementation(() => {}),
  })),
}));

describe('<UnfavoriteArticleButton />', () => {
  beforeEach(() => {
    vi.spyOn(realworldApi.articles, 'deleteArticleFavorite');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the button', () => {
    renderWithClient(<UnfavoriteArticleButton article={newArticle} />);

    const unfavoriteButton = screen.getByRole('button');
    expect(unfavoriteButton).toBeDefined();
  });

  it('should call the article API', async () => {
    renderWithClient(<UnfavoriteArticleButton article={newArticle} />);
    const unfavoriteButton = screen.getByRole('button');

    await userEvent.click(unfavoriteButton);

    expect(useMutationUnfavoriteArticle).toHaveBeenCalledTimes(1);
  });
});
