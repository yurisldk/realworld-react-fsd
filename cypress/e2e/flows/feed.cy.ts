describe('Feed Flow', { tags: ['@functional'] }, () => {
  let articleTitle: string;
  const authorUsername = `author_${Date.now()}`;
  let readerUser: { email: string; password: string };

  before(() => {
    cy.createUserByApi({ username: authorUsername }).then((author) => {
      cy.createArticleByApi(author.token).then((article) => {
        articleTitle = article.title;
      });
    });

    cy.createUserByApi({ username: `reader_${Date.now()}` }).then((reader) => {
      readerUser = reader;
    });
  });

  beforeEach(() => {
    cy.loginByApiWithSession(readerUser);
  });

  it('should display articles from followed users in the feed', () => {
    cy.visit(`/profile/${authorUsername}`);
    cy.intercept('POST', '/api/profiles/**/follow').as('followUser');
    cy.getByTest('follow-button').click();
    cy.wait('@followUser');

    cy.visit('/');
    cy.getByTest('your-feed-tab').click();

    cy.getByTest('article-preview').should('contain', articleTitle);
  });

  it('should not display articles in the feed after unfollowing', () => {
    cy.visit(`/profile/${authorUsername}`);
    cy.intercept('DELETE', '/api/profiles/**/follow').as('unfollowUser');
    cy.getByTest('unfollow-button').click();
    cy.wait('@unfollowUser');

    cy.visit('/');
    cy.getByTest('your-feed-tab').click();
    cy.contains('No articles are here... yet.').should('exist');
  });
});
