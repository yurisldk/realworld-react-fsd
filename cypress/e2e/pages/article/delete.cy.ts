describe('Delete Article', () => {
  let articleSlug: string;

  beforeEach(() => {
    cy.intercept('GET', '/api/articles/*').as('getArticle');
    cy.intercept('GET', '/api/articles/*/comments').as('getComments');
    cy.intercept('GET', '/api/user').as('getUser');

    cy.loginByApiWithSession();
    cy.createArticleByApi().then((article) => {
      articleSlug = article.slug;
      cy.visit(`/article/${articleSlug}`);
    });
  });

  it('should display the delete button for the article author', { tags: ['@functional'] }, () => {
    cy.getByTest('article-delete-button').should('be.visible');
  });

  it('should delete the article and redirect to the homepage', { tags: ['@destructive'] }, () => {
    cy.intercept('DELETE', '/api/articles/*').as('deleteArticle');
    cy.getByTest('article-delete-button').first().click();
    cy.wait('@deleteArticle');
    cy.getByTest('global-feed-tab').should('have.class', 'active');
  });

  it('should not display the delete button for a different user', { tags: ['@access'] }, () => {
    cy.wait(['@getArticle', '@getComments', '@getUser']);

    cy.createUserByApi().then((user1) => {
      cy.loginByApiWithSession(user1);
      cy.visit(`/article/${articleSlug}`);
      cy.wait(['@getArticle', '@getComments', '@getUser']);
      cy.getByTest('article-delete-button').should('not.exist');
    });
  });
});
