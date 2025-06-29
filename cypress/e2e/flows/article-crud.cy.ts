describe('Article CRUD Flow', { tags: ['@destructive'] }, () => {
  const articleData = {
    title: `CRUD Test Article ${Date.now()}`,
    description: 'CRUD flow test description',
    body: 'Initial body of the CRUD test article.',
    updatedBody: 'Updated body of the CRUD test article.',
  };

  beforeEach(() => {
    cy.loginByApiWithSession();
  });

  it('should create an article', () => {
    cy.visit('/editor');
    cy.getByTest('article-title-input').type(articleData.title);
    cy.getByTest('article-description-input').type(articleData.description);
    cy.getByTest('article-body-input').type(articleData.body);
    cy.getByTest('article-submit').click();

    cy.url().should('include', '/article/');
    cy.getByTest('article-title').should('contain', articleData.title);
    cy.getByTest('article-body').should('contain', articleData.body);
  });

  it('should edit an article', () => {
    cy.createArticleByApi().then((article) => {
      cy.visit(`/editor/${article.slug}`);
      cy.getByTest('article-body-input').clear().type(articleData.updatedBody);
      cy.getByTest('article-submit').click();
      cy.getByTest('article-body').should('contain', articleData.updatedBody);
    });
  });

  it('should delete an article', () => {
    cy.createArticleByApi().then((article) => {
      cy.visit(`/article/${article.slug}`);
      cy.getByTest('article-delete-button').first().click();
      cy.getByTest('global-feed-tab').should('have.class', 'active');
    });
  });
});
