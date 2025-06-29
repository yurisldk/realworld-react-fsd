describe('Not Found Page', { tags: ['@smoke', '@functional', '@prod-safe'] }, () => {
  it('should be displayed when navigating to a non-existent route', () => {
    cy.visit('/some/non-existent-route', { failOnStatusCode: false });
    cy.getByTest('not-found-title').should('be.visible');
  });

  it('should contain a link to the homepage', () => {
    cy.visit('/some/invalid-url', { failOnStatusCode: false });
    cy.getByTest('go-home-link').should('be.visible').click();
    cy.getByTest('global-feed-tab').should('have.class', 'active');
  });
});
