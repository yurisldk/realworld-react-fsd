describe('Favorite Article', () => {
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

  it('should display the favorite button', { tags: ['@functional'] }, () => {
    cy.getByTest('favorite-extended-button').should('be.visible');
  });

  it('should add the article to favorites', { tags: ['@destructive'] }, () => {
    cy.getByTest('favorite-extended-button').first().click();
    cy.getByTest('unfavorite-extended-button').should('exist');
  });

  it('should remove the article from favorites', { tags: ['@destructive'] }, () => {
    cy.getByTest('favorite-extended-button').first().click();
    cy.getByTest('unfavorite-extended-button').should('exist');
    cy.getByTest('unfavorite-extended-button').first().click();
    cy.getByTest('favorite-extended-button').should('exist');
  });

  it('should not allow anonymous users to favorite the article', { tags: ['@access'] }, () => {
    cy.logout();
    cy.visit(`/article/${articleSlug}`);
    cy.getByTest('favorite-extended-button').first().click();
    cy.url().should('include', '/login');
  });
});
