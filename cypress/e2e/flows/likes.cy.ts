describe('Likes Flow', () => {
  let articleSlug: string;

  beforeEach(() => {
    cy.createUserByApi().then((otherUser) => {
      cy.createArticleByApi(otherUser.token).then((article) => {
        articleSlug = article.slug;

        cy.loginByApiWithSession();
        cy.visit(`/article/${articleSlug}`);
      });
    });
  });

  it('should add an article to favorites', { tags: ['@destructive'] }, () => {
    cy.getByTest('favorite-extended-button').first().click();
    cy.getByTest('unfavorite-extended-button').should('exist');
  });

  it('should remove an article from favorites', { tags: ['@destructive'] }, () => {
    cy.getByTest('favorite-extended-button').first().click();
    cy.getByTest('unfavorite-extended-button').should('exist');
    cy.getByTest('unfavorite-extended-button').first().click();
    cy.getByTest('favorite-extended-button').should('exist');
  });
});
