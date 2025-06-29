describe('Home Page – Global Feed', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display a list of global articles', { tags: ['@functional', '@prod-safe'] }, () => {
    cy.getByTest('article-preview').should('have.length.greaterThan', 0);
  });

  it('should show only "Global Feed" tab for anonymous users', { tags: ['@access', '@prod-safe'] }, () => {
    cy.getByTest('your-feed-tab').should('not.exist');
    cy.getByTest('global-feed-tab').should('have.class', 'active');
  });

  it('should filter articles by selected tag', { tags: ['@functional', '@prod-safe'] }, () => {
    cy.getByTest('tag-list').find('[data-test^="tag-"]').first().click();
    cy.getByTest('article-preview').should('exist');
    cy.url().should('include', 'tag=');
  });

  it('should display a message if no articles are available', { tags: ['@edge', '@functional'] }, () => {
    cy.intercept('GET', '**/articles*', { articles: [], articlesCount: 0 }).as('emptyFeed');
    cy.wait('@emptyFeed');
    cy.contains('No articles are here... yet.').should('be.visible');
  });

  it('should show pagination when articles count equals page size', { tags: ['@functional', '@prod-safe'] }, () => {
    cy.intercept('GET', '**/articles*', {
      articles: new Array(15).fill(null).map((_, i) => ({
        title: `Article ${i}`,
        slug: `article-${i}`,
        description: 'desc',
        body: 'body',
        tagList: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorited: false,
        favoritesCount: 0,
        author: {
          username: 'testuser',
          bio: null,
          image: null,
          following: false,
        },
      })),
      articlesCount: 15,
    }).as('paginatedArticles');

    cy.wait('@paginatedArticles');
    cy.getByTest('pagination').should('exist');
    cy.getByTest('pagination').within(() => {
      cy.contains('2').should('be.visible');
    });
  });
});
