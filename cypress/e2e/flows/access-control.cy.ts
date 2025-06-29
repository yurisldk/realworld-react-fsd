describe('Access Control Flow', { tags: ['@access'] }, () => {
  const protectedRoutes = ['/editor', '/settings'];

  protectedRoutes.forEach((route) => {
    it(`should redirect unauthenticated user from ${route} to /login`, () => {
      cy.logout();
      cy.visit(route);
      cy.url().should('include', '/login');
    });
  });

  it('should allow access to protected routes after login', () => {
    cy.loginByApi();
    cy.visit('/editor');
    cy.getByTest('article-title-input').should('be.visible');

    cy.visit('/settings');
    cy.getByTest('settings-form').should('be.visible');
  });
});
