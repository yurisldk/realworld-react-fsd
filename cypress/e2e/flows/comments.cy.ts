describe('Comments Flow', () => {
  let articleSlug: string;
  const comment = `Test comment ${Date.now()}`;

  beforeEach(() => {
    cy.loginByApiWithSession();
    cy.createArticleByApi().then((article) => {
      articleSlug = article.slug;
      cy.visit(`/article/${articleSlug}`);
    });
  });

  it('should display the comment form', { tags: ['@functional'] }, () => {
    cy.getByTest('comment-input').should('be.visible');
    cy.getByTest('comment-submit').should('be.visible');
  });

  it('should add a comment to the article', { tags: ['@destructive'] }, () => {
    cy.getByTest('comment-input').type(comment);
    cy.getByTest('comment-submit').click();
    cy.getByTest('comment-item').contains(comment).should('exist');
  });

  it('should delete a comment', { tags: ['@destructive'] }, () => {
    cy.getByTest('comment-input').type(comment);
    cy.getByTest('comment-submit').click();
    cy.getByTest('comment-item')
      .contains(comment)
      .parents('[data-test="comment-item"]')
      .within(() => {
        cy.getByTest('comment-delete-button').click();
      });
    cy.getByTest('comment-item').should('not.exist');
  });

  it('should not allow submitting an empty comment', { tags: ['@edge'] }, () => {
    cy.getByTest('comment-submit').should('be.disabled');
    cy.getByTest('comment-item').should('not.exist');
  });

  it('should not show comment form to anonymous users', { tags: ['@access'] }, () => {
    cy.logout();
    cy.visit(`/article/${articleSlug}`);
    cy.getByTest('comment-input').should('not.exist');
    cy.getByTest('comment-submit').should('not.exist');
  });
});
