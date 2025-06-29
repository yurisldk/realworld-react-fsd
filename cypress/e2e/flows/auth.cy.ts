describe('Auth Flow', { tags: ['@functional'] }, () => {
  const email = `test+${Date.now()}@example.com`;
  const username = `testuser_${Date.now()}`;
  const password = 'password123';

  it('should complete the full auth flow: register => logout => login', () => {
    cy.visit('/register');
    cy.getByTest('register-username').type(username);
    cy.getByTest('register-email').type(email);
    cy.getByTest('register-password').type(password);
    cy.getByTest('register-submit').click();

    cy.getByTest('app-header-username').should('contain', username);

    cy.visit('/settings');
    cy.getByTest('logout-button').click();
    cy.getByTest('global-feed-tab').should('have.class', 'active');

    cy.visit('/login');
    cy.getByTest('login-email').type(email);
    cy.getByTest('login-password').type(password);
    cy.getByTest('login-submit').click();

    cy.getByTest('app-header-username').should('contain', username);
  });
});
