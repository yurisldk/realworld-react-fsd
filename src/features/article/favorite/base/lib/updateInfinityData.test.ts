import { ArticleDto } from '~shared/api/realworld';
import { ArticlesInfinityData, updateInfinityData } from './updateInfinityData';

const infinityData = {
  pages: [
    [
      { slug: 'article-1', title: 'Article 1' },
      { slug: 'article-2', title: 'Article 2' },
      { slug: 'article-3', title: 'Article 3' },
      { slug: 'article-4', title: 'Article 4' },
      { slug: 'article-5', title: 'Article 5' },
    ],
    [
      { slug: 'article-6', title: 'Article 6' },
      { slug: 'article-7', title: 'Article 7' },
      { slug: 'article-8', title: 'Article 8' },
      { slug: 'article-9', title: 'Article 9' },
      { slug: 'article-10', title: 'Article 10' },
    ],
  ],
  pageParams: [undefined, 5],
} as ArticlesInfinityData;

describe('updateInfinityData', () => {
  it('should update an existing article in the 1st position', () => {
    const newArticle = {
      slug: 'article-1',
      title: 'Updated Article 1',
    } as ArticleDto;

    const updatedInfinityData = updateInfinityData(infinityData, newArticle);

    const expectedInfinityData = {
      pages: [
        [
          { slug: 'article-1', title: 'Updated Article 1' },
          { slug: 'article-2', title: 'Article 2' },
          { slug: 'article-3', title: 'Article 3' },
          { slug: 'article-4', title: 'Article 4' },
          { slug: 'article-5', title: 'Article 5' },
        ],
        [
          { slug: 'article-6', title: 'Article 6' },
          { slug: 'article-7', title: 'Article 7' },
          { slug: 'article-8', title: 'Article 8' },
          { slug: 'article-9', title: 'Article 9' },
          { slug: 'article-10', title: 'Article 10' },
        ],
      ],
      pageParams: [undefined, 5],
    } as ArticlesInfinityData;

    expect(updatedInfinityData).toEqual(expectedInfinityData);
  });

  it('should update an existing article in the last position', () => {
    const newArticle = {
      slug: 'article-5',
      title: 'Updated Article 5',
    } as ArticleDto;

    const updatedInfinityData = updateInfinityData(infinityData, newArticle);

    const expectedInfinityData = {
      pages: [
        [
          { slug: 'article-1', title: 'Article 1' },
          { slug: 'article-2', title: 'Article 2' },
          { slug: 'article-3', title: 'Article 3' },
          { slug: 'article-4', title: 'Article 4' },
          { slug: 'article-5', title: 'Updated Article 5' },
        ],
        [
          { slug: 'article-6', title: 'Article 6' },
          { slug: 'article-7', title: 'Article 7' },
          { slug: 'article-8', title: 'Article 8' },
          { slug: 'article-9', title: 'Article 9' },
          { slug: 'article-10', title: 'Article 10' },
        ],
      ],
      pageParams: [undefined, 5],
    } as ArticlesInfinityData;

    expect(updatedInfinityData).toEqual(expectedInfinityData);
  });

  it('should update an existing article in the middle position', () => {
    const newArticle = {
      slug: 'article-7',
      title: 'Updated Article 7',
    } as ArticleDto;

    const updatedInfinityData = updateInfinityData(infinityData, newArticle);

    const expectedInfinityData = {
      pages: [
        [
          { slug: 'article-1', title: 'Article 1' },
          { slug: 'article-2', title: 'Article 2' },
          { slug: 'article-3', title: 'Article 3' },
          { slug: 'article-4', title: 'Article 4' },
          { slug: 'article-5', title: 'Article 5' },
        ],
        [
          { slug: 'article-6', title: 'Article 6' },
          { slug: 'article-7', title: 'Updated Article 7' },
          { slug: 'article-8', title: 'Article 8' },
          { slug: 'article-9', title: 'Article 9' },
          { slug: 'article-10', title: 'Article 10' },
        ],
      ],
      pageParams: [undefined, 5],
    } as ArticlesInfinityData;

    expect(updatedInfinityData).toEqual(expectedInfinityData);
  });

  it('should return infinityData when the article to update is not found', () => {
    const newArticle = {
      slug: 'article-11',
      title: 'Article 11',
    } as ArticleDto;

    const updatedInfinityData = updateInfinityData(infinityData, newArticle);

    expect(updatedInfinityData).toEqual(infinityData);
    expect(updatedInfinityData).not.toBe(infinityData);
  });
});
