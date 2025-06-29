describe('Article View Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.getByTest('article-preview').first().click();
  });

  it('should display the article title and body', { tags: ['@functional', '@prod-safe'] }, () => {
    cy.getByTest('article-title').should('be.visible');
    cy.getByTest('article-body').should('be.visible');
  });

  it('should display the author, date, and interaction buttons', { tags: ['@functional', '@prod-safe'] }, () => {
    cy.getByTest('article-author').should('be.visible');
    cy.getByTest('article-date').should('be.visible');
    cy.getByTest('favorite-extended-button').should('be.visible');
  });

  it('should display the list of comments', { tags: ['@functional', '@prod-safe'] }, () => {
    cy.getByTest('comments').should('exist');
    cy.getByTest('comment-item').should('have.length.at.least', 0);
  });

  it('should allow adding a comment when authenticated', { tags: ['@destructive'] }, () => {
    cy.loginByApi();
    cy.visit('/');
    cy.getByTest('article-preview').first().click();

    const comment = `Test comment ${Date.now()}`;
    cy.getByTest('comment-input').type(comment);
    cy.getByTest('comment-submit').click();

    cy.getByTest('comment-item').contains(comment).should('exist');
  });

  it('should not show the comment form to anonymous users', { tags: ['@access', '@prod-safe'] }, () => {
    cy.getByTest('comment-input').should('not.exist');
    cy.getByTest('comment-submit').should('not.exist');
  });
});
