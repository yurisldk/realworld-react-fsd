describe('Edit Article Page', () => {
  const updatedTitle = `Updated article ${Date.now()}`;

  beforeEach(() => {
    cy.loginByApiWithSession();
    cy.createArticleByApi().then((article) => {
      cy.wrap(article).as('createdArticle');
      cy.visit(`/editor/${article.slug}`);
    });
  });

  it('should display edit form with existing article data', { tags: ['@functional'] }, () => {
    cy.get<{
      title: string;
      description: string;
      body: string;
      slug: string;
      tagList: string[];
    }>('@createdArticle').then((article) => {
      cy.getByTest('article-title-input').should('have.value', article.title);
      cy.getByTest('article-description-input').should('have.value', article.description);
      cy.getByTest('article-body-input').should('have.value', article.body);
    });
  });

  it('should update the article successfully', { tags: ['@destructive'] }, () => {
    cy.getByTest('article-title-input').clear().type(updatedTitle);
    cy.getByTest('article-submit').click();

    cy.url().should('include', '/article/');
    cy.getByTest('article-title').should('contain', updatedTitle);
  });

  it('should redirect unauthorized user to login page', { tags: ['@access'] }, () => {
    cy.createArticleByApi().then((article) => {
      cy.logout();
      cy.visit(`/editor/${article.slug}`);
      cy.url().should('include', '/login');
    });
  });
});
